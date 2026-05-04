/* eslint-disable camelcase */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

import type { AppConfig, Profile } from './types.js'

import { regionChoices } from './constants.js'
import { confirmPrompt, fuzzySelectPrompt, textPrompt } from './prompts.js'

export class ConfigManager {
  private configPath: string

  constructor() {
    this.configPath = join(homedir(), '.aliops', 'config.json')
  }

  async getCurrentProfile(): Promise<null | Profile> {
    const config = await this.load()
    if (!config?.current) return null
    return config.profiles.find((p) => p.name === config.current) ?? null
  }

  async getRegionId(): Promise<string | undefined> {
    const profile = await this.getCurrentProfile()
    return profile?.region_id
  }

  async list(): Promise<void> {
    console.log(`配置文件路径: ${this.configPath}`)
    const config = await this.load()
    if (!config) {
      console.log('配置文件不存在，请使用 ali config set 命令生成配置文件。')
      return
    }

    console.log(JSON.stringify(config, null, 4))
  }

  async load(): Promise<AppConfig | null> {
    try {
      const content = await readFile(this.configPath, 'utf8')
      return JSON.parse(content) as AppConfig
    } catch {
      return null
    }
  }

  async save(config: AppConfig): Promise<void> {
    const dir = this.configPath.replace(/[\\/][^\\/]+$/, '')
    await mkdir(dir, { recursive: true })
    await writeFile(this.configPath, JSON.stringify(config, null, 4))
  }

  async set(): Promise<void> {
    const profileName = await textPrompt('请输入配置文件的名字:')
    if (!profileName) return

    const accessKeyId = await textPrompt('请输入 access_key_id:')
    if (!accessKeyId) return

    const accessKeySecret = await textPrompt('请输入 access_key_secret:')
    if (!accessKeySecret) return

    const regionId = await fuzzySelectPrompt('请选择区域:', regionChoices)
    if (!regionId) return

    const newProfile: Profile = {
      access_key_id: accessKeyId,
      access_key_secret: accessKeySecret,
      language: 'en',
      mode: 'AK',
      name: profileName,
      output_format: 'json',
      region_id: regionId,
      site: 'china',
    }

    const config = (await this.load()) ?? { current: '', profiles: [] }

    const existingIdx = config.profiles.findIndex((p) => p.name === profileName)
    if (existingIdx === -1) {
      config.profiles.push(newProfile)
      console.log(`配置文件 '${profileName}' 已添加`)
    } else {
      const overwrite = await confirmPrompt(`配置文件 '${profileName}' 已存在，是否覆盖？`)
      if (!overwrite) {
        console.log('操作已取消')
        return
      }

      config.profiles[existingIdx] = newProfile
      console.log(`配置文件 '${profileName}' 已覆盖`)
    }

    const applyNow = await confirmPrompt('是否立即应用当前配置？')
    if (applyNow) {
      config.current = profileName
      console.log(`当前配置已切换到 '${profileName}'`)
    }

    await this.save(config)
    console.log(`配置文件已保存到: ${this.configPath}`)
  }

  async setRegion(): Promise<string | undefined> {
    const newRegionId = await fuzzySelectPrompt('请选择区域:', regionChoices)
    if (!newRegionId) {
      console.log('操作已取消')
      return undefined
    }

    await this.updateCurrentProfile({ region_id: newRegionId })
    console.log(`区域已更新为: ${newRegionId}`)
    return newRegionId
  }

  async updateCurrentProfile(updates: Partial<Profile>): Promise<null | Profile> {
    const config = await this.load()
    if (!config?.current) return null

    const idx = config.profiles.findIndex((p) => p.name === config.current)
    if (idx === -1) return null

    config.profiles[idx] = { ...config.profiles[idx], ...updates }
    await this.save(config)
    return config.profiles[idx]
  }
}
