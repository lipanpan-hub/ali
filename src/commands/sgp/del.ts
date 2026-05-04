import { Command } from '@oclif/core'

export default class SgpDel extends Command {
  static description = '删除安全组 (尚未实现)'
static examples = ['<%= config.bin %> <%= command.id %>']

  async run(): Promise<void> {
    this.warn('此功能尚未实现')
  }
}
