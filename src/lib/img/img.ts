import {
  CreateImageRequest,
  CreateImageResponse,
  DeleteImageRequest,
  DescribeImagesRequest,
  DescribeImagesRequestFilter,
  DescribeImagesResponse,
} from '@alicloud/ecs20140526'

import {createEcsClient} from '../client/client.js'
import {createRuntime} from '../client/runtime.js'
import {wrap} from '../client/wrap.js'

export class ImageManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any = null
  private region: string = ''

  constructor() {
    const c = createEcsClient()
    if (!c) return
    this.client = c.client
    this.region = c.region
  }

  // #region 创建
  async createImage(
    instanceId: string,
    imageName: string,
    description?: string,
  ): Promise<CreateImageResponse | null> {
    if (!this.client) return null

    const request = new CreateImageRequest({description, imageName, instanceId, regionId: this.region})

    return wrap('创建镜像', async () => {
      const res = await this.client.createImageWithOptions(request, createRuntime())
      console.log(`镜像创建成功: ${imageName}`)
      return res as CreateImageResponse
    })
  }
  // #endregion

  // #region 删除
  async deleteImage(imageId: string): Promise<boolean> {
    if (!this.client) return false

    const request = new DeleteImageRequest({imageId, regionId: this.region})
    const ok = await wrap('删除镜像', async () => {
      await this.client.deleteImageWithOptions(request, createRuntime())
      console.log(`镜像 ${imageId} 删除成功`)
      return true
    })
    return ok ?? false
  }
  // #endregion

  // #region 获取自定义
  async getCustomImages(): Promise<DescribeImagesResponse | null> {
    if (!this.client) return null

    const request = new DescribeImagesRequest({
      imageOwnerAlias: 'self',
      regionId: this.region,
      status: 'Available',
    })

    return wrap('获取自定义镜像列表', async () => {
      const res = await this.client.describeImagesWithOptions(request, createRuntime())
      return res as DescribeImagesResponse
    })
  }
  // #endregion

  // #region 获取系统镜像
  async getImages(): Promise<DescribeImagesResponse | null> {
    if (!this.client) return null

    // 阿里云要求 yyyy-MM-ddTHH:mmZ 格式（精确到分钟，不含秒）
    const xDaysAgo = new Date(Date.now() - 90 * 86_400_000)
    const creationStartTime = xDaysAgo.toISOString().replace(/:\d{2}\.\d{3}Z$/, 'Z')

    const request = new DescribeImagesRequest({
      actionType: 'CreateEcs',
      architecture: 'x86_64',
      filter: [new DescribeImagesRequestFilter({key: 'CreationStartTime', value: creationStartTime})],
      imageOwnerAlias: 'system',
      isSupportCloudinit: true,
      isSupportIoOptimized: true,
      pageSize: 100,
      regionId: this.region,
      status: 'Available',
    })

    return wrap('获取镜像列表', async () => {
      const res = await this.client.describeImagesWithOptions(request, createRuntime())
      return res as DescribeImagesResponse
    })
  }
  // #endregion

  // #region 列出
  async listImages(platform = 'Ubuntu'): Promise<void> {
    const res = await this.getImages()
    const images = res?.body?.images?.image ?? []
    if (images.length === 0) {
      console.log('当前区域没有可用镜像')
      return
    }

    const keyword = platform.toLowerCase()
    const matched = images.filter((img) => {
      const name = (img.imageName || '').toLowerCase()
      const platformName = (img.platform || '').toLowerCase()
      const osName = (img.OSNameEn || '').toLowerCase()
      return name.includes(keyword) || platformName.includes(keyword) || osName.includes(keyword)
    })

    if (matched.length === 0) {
      console.log(`未找到包含 '${platform}' 的镜像`)
      return
    }

    const sorted = matched
      .filter((img) => img.imageId)
      .sort((a, b) => (b.creationTime || '').localeCompare(a.creationTime || ''))

    console.log(`\n找到 ${sorted.length} 个 ${platform} 相关镜像:\n`)
    for (const img of sorted) {
      console.log(`${img.imageId} (创建时间: ${img.creationTime})`)
    }
  }
  // #endregion
}
