import {createRequire} from 'node:module'

import * as $Ecs20140526 from '@alicloud/ecs20140526'
import * as $Util from '@alicloud/tea-util'

import {ClientConfig} from '../client/client.js'

const require = createRequire(import.meta.url)
const Ecs20140526 = require('@alicloud/ecs20140526').default

export class ImageManager {
  private client: any = null
  private region: string = ''

  constructor() {
    const clientConfig = ClientConfig.getInstance()
    if (!clientConfig.config) {
      console.log('配置文件不存在, 请使用 ali config set 命令生成配置文件。')
      return
    }

    this.region = clientConfig.region
    const config = {
      ...clientConfig.config,
      endpoint: `ecs.${this.region}.aliyuncs.com`,
    }
    this.client = new Ecs20140526(config)
  }

  // 获取镜像列表
  async getImages(): Promise<$Ecs20140526.DescribeImagesResponse | null> {
    if (!this.client) return null

    // 计算三个月前的时间
    const xDaysAgo = new Date()
    xDaysAgo.setDate(xDaysAgo.getDate() - 90)
    const creationStartTime = xDaysAgo.toISOString().replace(/\.\d{3}Z$/, 'Z')

    const filter0 = new $Ecs20140526.DescribeImagesRequestFilter({
      key: 'CreationStartTime',
      value: creationStartTime,
    })

    const request = new $Ecs20140526.DescribeImagesRequest({
      actionType: 'CreateEcs',
      architecture: 'x86_64',
      filter: [filter0],
      imageOwnerAlias: 'system',
      isSupportCloudinit: true,
      isSupportIoOptimized: true,
      pageSize: 100,
      regionId: this.region,
      status: 'Available',
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      return await this.client.describeImagesWithOptions(request, runtime)
    } catch (error: any) {
      console.log(`获取镜像列表失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`建议: ${error.data.Recommend}`)
      }

      return null
    }
  }

  // 创建自定义镜像
  async createImage(instanceId: string, imageName: string, description?: string): Promise<$Ecs20140526.CreateImageResponse | null> {
    if (!this.client) return null

    const request = new $Ecs20140526.CreateImageRequest({
      description,
      imageName,
      instanceId,
      regionId: this.region,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      const res = await this.client.createImageWithOptions(request, runtime)
      console.log(`镜像创建成功: ${imageName}`)
      return res
    } catch (error: any) {
      console.log(`创建镜像失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`建议: ${error.data.Recommend}`)
      }

      return null
    }
  }

  // 删除自定义镜像
  async deleteImage(imageId: string): Promise<boolean> {
    if (!this.client) return false

    const request = new $Ecs20140526.DeleteImageRequest({
      imageId,
      regionId: this.region,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      await this.client.deleteImageWithOptions(request, runtime)
      console.log(`镜像 ${imageId} 删除成功`)
      return true
    } catch (error: any) {
      console.log(`删除镜像失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`建议: ${error.data.Recommend}`)
      }

      return false
    }
  }

  // 获取自定义镜像列表
  async getCustomImages(): Promise<$Ecs20140526.DescribeImagesResponse | null> {
    if (!this.client) return null

    const request = new $Ecs20140526.DescribeImagesRequest({
      imageOwnerAlias: 'self',
      regionId: this.region,
      status: 'Available',
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      return await this.client.describeImagesWithOptions(request, runtime)
    } catch (error: any) {
      console.log(`获取自定义镜像列表失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`建议: ${error.data.Recommend}`)
      }

      return null
    }
  }

  // 列出镜像
  async listImages(platform = 'Ubuntu'): Promise<void> {
    const res = await this.getImages()
    if (!res || !res.body?.images?.image) {
      console.log('未找到镜像')
      return
    }

    const images = res.body.images.image

    // 筛选匹配指定平台的镜像
    const matchedImages = images.filter((img) => {
      const imageName = img.imageName || ''
      const platformName = img.platform || ''
      const osName = img.OSNameEn || ''

      return (
        imageName.toLowerCase().includes(platform.toLowerCase()) ||
        platformName.toLowerCase().includes(platform.toLowerCase()) ||
        osName.toLowerCase().includes(platform.toLowerCase())
      )
    })

    if (matchedImages.length === 0) {
      console.log(`未找到包含 '${platform}' 的镜像`)
      return
    }

    // 提取镜像ID和创建时间并排序
    const imageInfoList = matchedImages
      .filter((img) => img.imageId)
      .map((img) => ({
        creationTime: img.creationTime || '',
        imageId: img.imageId || '',
      }))
      .sort((a, b) => b.creationTime.localeCompare(a.creationTime))

    console.log(`\n找到 ${imageInfoList.length} 个 ${platform} 相关镜像:\n`)
    for (const info of imageInfoList) {
      console.log(`${info.imageId} (创建时间: ${info.creationTime})`)
    }
  }
}
