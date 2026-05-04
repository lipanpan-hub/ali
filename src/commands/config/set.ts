import {Command, Flags} from '@oclif/core'
import prompts from 'prompts'

import {ConfigManager} from '../../lib/config/config.js'
import type {Profile} from '../../lib/config/types.js'
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

    // #region 获取配置名称
    let profileName = flags.name
    if (!profileName) {
      const nameResponse = await prompts({
        message: '请输入配置文件的名字:',
        name: 'name',
        type: 'text',
      })
      profileName = nameResponse.name
    }

    if (!profileName) {
      this.log('配置名称不能为空')
      return
    }

    // #endregion

    // #region 获取 AccessKey ID
    const akIdResponse = await prompts({
      message: '请输入 access_key_id:',
      name: 'accessKeyId',
      type: 'text',
    })

    if (!akIdResponse.accessKeyId) {
      this.log('access_key_id 不能为空')
      return
    }

    // #endregion

    // #region 获取 AccessKey Secret
    const akSecretResponse = await prompts({
      message: '请输入 access_key_secret:',
      name: 'accessKeySecret',
      type: 'password',
    })

    if (!akSecretResponse.accessKeySecret) {
      this.log('access_key_secret 不能为空')
      return
    }

    // #endregion

    // #region 选择区域
    const regionOptions = Object.entries(regionChoices).map(([value, title]) => ({
      title,
      value,
    }))

    const regionResponse = await prompts({
      choices: regionOptions,
      message: '请选择区域:',
      name: 'regionId',
      type: 'autocomplete',
    })

    if (!regionResponse.regionId) {
      this.log('区域不能为空')
      return
    }

    // #endregion

    // #region 构建配置对象
    const newProfile: Profile = {
      access_key_id: akIdResponse.accessKeyId,
      access_key_secret: akSecretResponse.accessKeySecret,
      language: 'en',
      mode: 'AK',
      name: profileName,
      output_format: 'json',
      region_id: regionResponse.regionId,
      site: 'china',
    }
    // #endregion

    // #region 检查是否存在同名配置
    const config = configManager.readConfig()
    if (config) {
      const existingProfile = config.profiles.find((p) => p.name === profileName)
      if (existingProfile) {
        const overwriteResponse = await prompts({
          initial: true,
          message: `配置文件 '${profileName}' 已存在，是否覆盖？`,
          name: 'overwrite',
          type: 'confirm',
        })

        if (!overwriteResponse.overwrite) {
          this.log('操作已取消')
          return
        }

        this.log(`配置文件 '${profileName}' 已覆盖`)
      } else {
        this.log(`配置文件 '${profileName}' 已添加`)
      }
    } else {
      this.log(`配置文件 '${profileName}' 已添加`)
    }

    // #endregion

    // #region 询问是否立即应用
    const applyResponse = await prompts({
      initial: true,
      message: '是否立即应用当前配置？',
      name: 'apply',
      type: 'confirm',
    })

    const setCurrent = applyResponse.apply === true
    // #endregion

    // #region 保存配置
    configManager.upsertProfile(newProfile, setCurrent)

    if (setCurrent) {
      this.log(`当前配置已切换到 '${profileName}'`)
    }

    this.log(`配置文件已保存到: ${configManager.getConfigPath()}`)
    // #endregion
  }
}
