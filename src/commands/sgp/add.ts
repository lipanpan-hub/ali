import { Command } from '@oclif/core'

export default class SgpAdd extends Command {
  static description = '创建安全组 (尚未实现)'
static examples = ['<%= config.bin %> <%= command.id %>']

  async run(): Promise<void> {
    this.warn('此功能尚未实现')
  }
}
