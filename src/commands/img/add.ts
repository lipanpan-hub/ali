import { Command } from '@oclif/core'

export default class ImgAdd extends Command {
  static description = '添加自定义镜像 (尚未实现)'
static examples = ['<%= config.bin %> <%= command.id %>']

  async run(): Promise<void> {
    this.warn('此功能尚未实现')
  }
}
