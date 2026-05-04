/* eslint-disable @typescript-eslint/no-explicit-any */
import { Args, Command } from '@oclif/core'

import { listImages } from '../../lib/img/img.js'

export default class ImgLs extends Command {
  static args = {
    platform: Args.string({ default: 'Ubuntu', description: '平台关键字' }),
  }
static description = '列出可用镜像'
static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> Ubuntu',
    '<%= config.bin %> <%= command.id %> Debian',
  ]

  async run(): Promise<void> {
    const { args } = await this.parse(ImgLs)

    try {
      const images = await listImages(args.platform)
      if (images.length === 0) {
        this.warn(`未找到包含 '${args.platform}' 的镜像`)
        return
      }

      this.log(`\n找到 ${images.length} 个 ${args.platform} 相关镜像:\n`)
      for (const img of images) {
        this.log(`${img.imageId} (创建时间: ${img.creationTime})`)
      }
    } catch (error: any) {
      this.error(error.message ?? '未知错误')
    }
  }
}
