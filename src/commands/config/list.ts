import {Command} from '@oclif/core'

import {ConfigManager} from '../../lib/config/config.js'

export default class ConfigLs extends Command {
  static aliases = ['config:ls']
static description = '列出所有的配置'
static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const configManager = new ConfigManager()
    const configPath = configManager.getConfigPath()

    this.log(`配置文件路径: ${configPath}`)

    const config = configManager.readConfig()
    if (!config) {
      this.log('配置文件不存在, 请使用 ali config set 命令生成配置文件。')
      return
    }

    this.log(JSON.stringify(config, null, 2))
  }
}
