import {Hook} from '@oclif/core'

import {ConfigManager} from '../../lib/config/config.js'

const hook: Hook<'init'> = async function (options) {
  // 命令执行前注入 oclif 特有的配置目录, 供 ConfigManager 单例统一提供配置文件路径
  ConfigManager.setConfigDir(options.config.configDir)
}

export default hook
