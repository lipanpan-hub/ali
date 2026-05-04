/* eslint-disable @typescript-eslint/no-explicit-any */
import * as $ecs from '@alicloud/ecs20140526/dist/models/model.js'

import { createRuntime, getEcsClient } from '../client.js'

export interface ImageInfo {
  creationTime: string
  imageId: string
  imageName: string
  osname: string
  platform: string
  status: string
}

export async function listImages(platform = 'Ubuntu'): Promise<ImageInfo[]> {
  const { client, region } = await getEcsClient()

  const daysAgo = new Date()
  daysAgo.setDate(daysAgo.getDate() - 90)
  const creationStartTime = daysAgo.toISOString().replace(/\.\d{3}Z$/, 'Z')

  const request = new $ecs.DescribeImagesRequest({
    actionType: 'CreateEcs',
    architecture: 'x86_64',
    filter: [new $ecs.DescribeImagesRequestFilter({
      key: 'CreationStartTime',
      value: creationStartTime,
    })],
    imageOwnerAlias: 'system',
    isSupportCloudinit: true,
    isSupportIoOptimized: true,
    pageSize: 100,
    regionId: region,
    status: 'Available',
  })
  const runtime = createRuntime()

  try {
    const res = await client.describeImagesWithOptions(request, runtime)
    const images = res.body?.images?.image ?? []
    const keyword = platform.toLowerCase()

    return images
      .filter((img: any) => {
        const name = (img.imageName ?? '').toLowerCase()
        const plat = (img.platform ?? '').toLowerCase()
        const osname = (img.osnameEn ?? '').toLowerCase()
        return name.includes(keyword) || plat.includes(keyword) || osname.includes(keyword)
      })
      .map((img: any) => ({
        creationTime: img.creationTime ?? '',
        imageId: img.imageId ?? '',
        imageName: img.imageName ?? '',
        osname: img.osnameEn ?? '',
        platform: img.platform ?? '',
        status: img.status ?? '',
      }))
      .sort((a: ImageInfo, b: ImageInfo) => b.creationTime.localeCompare(a.creationTime))
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}
