import { Command, Flags } from '@oclif/core'

import { ConfigManager } from '../../lib/config/config.js'

export default class ConfigSet extends Command {
  static description = '创建/更新配置文件 或 切换区域'
static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --region',
  ]
static flags = {
    region: Flags.boolean({ char: 'r', default: false, description: '仅切换区域' }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(ConfigSet)
    const config = new ConfigManager()

    await (flags.region ? config.setRegion() : config.set());
  }
}
