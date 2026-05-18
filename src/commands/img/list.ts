import {Command, Flags} from '@oclif/core'

import {ImageManager} from '../../lib/img/img.js'

export default class ImgLs extends Command {
  static aliases = ['img:ls']
static description = '列出指定平台的可用镜像'
static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --platform Ubuntu',
    '<%= config.bin %> <%= command.id %> -p Debian',
  ]
static flags = {
    platform: Flags.string({char: 'p', default: 'Ubuntu', description: '操作系统平台名称'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(ImgLs)
    await new ImageManager().listImages(flags.platform)
  }
}
