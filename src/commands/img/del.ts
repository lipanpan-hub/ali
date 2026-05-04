import {Args, Command} from '@oclif/core'
import * as inquirer from '@inquirer/prompts'

import {ImageManager} from '../../lib/img/img.js'

export default class ImgDel extends Command {
  static args = {
    imageId: Args.string({description: '镜像 ID (可选，不提供则交互式选择)', required: false}),
  }

  static description = '删除自定义镜像'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> m-xxxxx']

  public async run(): Promise<void> {
    const {args} = await this.parse(ImgDel)
    let imageId = args.imageId

    // 如果没有提供镜像 ID，则交互式选择
    if (!imageId) {
      const imgManager = new ImageManager()
      const res = await imgManager.getCustomImages()

      if (!res || !res.body?.images?.image || res.body.images.image.length === 0) {
        this.log('当前区域没有自定义镜像')
        return
      }

      const images = res.body.images.image
      const choices = images.map((img) => ({
        name: `${img.imageId} - ${img.imageName} (创建时间: ${img.creationTime})`,
        value: img.imageId || '',
      }))

      imageId = await inquirer.select({
        choices,
        message: '请选择要删除的镜像:',
      })
    }

    if (!imageId) {
      this.log('未选择镜像')
      return
    }

    // 确认删除
    const confirm = await inquirer.confirm({
      default: false,
      message: `确认删除镜像 ${imageId}？此操作不可恢复。`,
    })

    if (!confirm) {
      this.log('已取消删除操作')
      return
    }

    const imgManager = new ImageManager()
    await imgManager.deleteImage(imageId)
  }
}
