import { Command } from '@oclif/core'

export default class ImgDel extends Command {
  static description = '删除自定义镜像 (尚未实现)'
static examples = ['<%= config.bin %> <%= command.id %>']

  async run(): Promise<void> {
    this.warn('此功能尚未实现')
  }
}
