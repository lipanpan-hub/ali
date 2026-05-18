import * as inquirer from '@inquirer/prompts'
import {Args, Command} from '@oclif/core'

import {ImageManager} from '../../lib/img/img.js'

export default class ImgDel extends Command {
  static args = {
    imageId: Args.string({description: '镜像 ID (可选，不提供则交互式选择)', required: false}),
  }
static description = '删除自定义镜像'
static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> m-xxxxx']

  public async run(): Promise<void> {
    const {args} = await this.parse(ImgDel)
    const imgManager = new ImageManager()

    let {imageId} = args
    if (!imageId) {
      const res = await imgManager.getCustomImages()
      const images = res?.body?.images?.image ?? []
      if (images.length === 0) {
        this.log('当前区域没有自定义镜像')
        return
      }

      imageId = await inquirer.select({
        choices: images.map((img) => ({
          name: `${img.imageId} - ${img.imageName} (创建时间: ${img.creationTime})`,
          value: img.imageId || '',
        })),
        message: '请选择要删除的镜像:',
      })
    }

    if (!imageId) return

    const confirm = await inquirer.confirm({
      default: false,
      message: `确认删除镜像 ${imageId}？此操作不可恢复。`,
    })
    if (!confirm) {
      this.log('已取消删除操作')
      return
    }

    await imgManager.deleteImage(imageId)
  }
}
