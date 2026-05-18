import * as inquirer from '@inquirer/prompts'
import {Command, Flags} from '@oclif/core'

import type {Profile} from '../../lib/config/types.js'

import {ConfigManager} from '../../lib/config/config.js'
import {regionChoices} from '../../lib/utils/regions.js'

export default class ConfigSet extends Command {
  static description = '设置配置文件'
  static examples = ['<%= config.bin %> <%= command.id %>']
  static flags = {
    name: Flags.string({char: 'n', description: '配置文件名称'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(ConfigSet)
    const configManager = new ConfigManager()

    // #region 配置名称
    const profileName =
      flags.name ??
      (await inquirer.input({
        message: '请输入配置文件的名字:',
        validate: (v) => v.length > 0 || '配置名称不能为空',
      }))
    if (!profileName) return
    // #endregion

    // #region AccessKey
    const accessKeyId = await inquirer.input({
      message: '请输入 access_key_id:',
      validate: (v) => v.length > 0 || 'access_key_id 不能为空',
    })

    const accessKeySecret = await inquirer.password({
      mask: '*',
      message: '请输入 access_key_secret:',
      validate: (v) => v.length > 0 || 'access_key_secret 不能为空',
    })
    // #endregion

    // #region 区域
    const regionId = await inquirer.search({
      message: '请选择区域 (输入关键字搜索):',
      source(input) {
        const keyword = (input ?? '').toLowerCase()
        return Object.entries(regionChoices)
          .filter(([id, label]) => !keyword || id.toLowerCase().includes(keyword) || label.toLowerCase().includes(keyword))
          .map(([id, label]) => ({name: label, value: id}))
      },
    })
    if (!regionId) return
    // #endregion

    // #region 检查同名
    const config = configManager.readConfig()
    const existing = config?.profiles.find((p) => p.name === profileName)
    if (existing) {
      const overwrite = await inquirer.confirm({
        default: true,
        message: `配置文件 '${profileName}' 已存在，是否覆盖？`,
      })
      if (!overwrite) {
        this.log('操作已取消')
        return
      }
    }
    // #endregion

    // #region 保存
    const newProfile: Profile = {
      access_key_id: accessKeyId, // eslint-disable-line camelcase
      access_key_secret: accessKeySecret, // eslint-disable-line camelcase
      language: 'en',
      mode: 'AK',
      name: profileName,
      output_format: 'json', // eslint-disable-line camelcase
      region_id: regionId, // eslint-disable-line camelcase
      site: 'china',
    }

    const setCurrent = await inquirer.confirm({
      default: true,
      message: '是否立即应用当前配置？',
    })

    configManager.upsertProfile(newProfile, setCurrent)

    this.log(existing ? `配置文件 '${profileName}' 已覆盖` : `配置文件 '${profileName}' 已添加`)
    if (setCurrent) this.log(`当前配置已切换到 '${profileName}'`)
    this.log(`配置文件已保存到: ${configManager.getConfigPath()}`)
    // #endregion
  }
}
