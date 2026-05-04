import { Command } from '@oclif/core'

import { ConfigManager } from '../../lib/config.js'

export default class ConfigLs extends Command {
  static description = '列出所有配置文件'
static examples = ['<%= config.bin %> <%= command.id %>']

  async run(): Promise<void> {
    await this.parse(ConfigLs)
    const config = new ConfigManager()
    await config.list()
  }
}
