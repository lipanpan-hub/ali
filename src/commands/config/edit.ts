import {Command} from '@oclif/core'

import {ConfigManager} from '../../lib/config/config.js'
import {editConfigTui} from '../../lib/config/edit-config-tui.js'

export default class ConfigEdit extends Command {
  static description = '在终端启动 TUI 编辑器编辑用户配置文件'

  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const configManager = new ConfigManager()

    // 确保配置文件存在, 不存在则写入默认空配置, 避免 TUI 读取时报错
    if (!configManager.readConfig()) {
      configManager.writeConfig({current: '', profiles: []})
    }

    const configPath = configManager.getConfigPath()

    // 启动 TUI 编辑器, 等待用户编辑并退出
    await editConfigTui(configPath)
  }
}
