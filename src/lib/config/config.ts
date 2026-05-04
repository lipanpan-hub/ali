import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import type {Config, Profile} from './types.js'

export class ConfigManager {
  private configPath: string

  constructor() {
    // 根据操作系统确定配置文件路径
    const homeDir = os.homedir()
    const configDir = path.join(homeDir, '.aliops')
    this.configPath = path.join(configDir, 'config.json')
  }

  // 获取配置文件路径
  getConfigPath(): string {
    return this.configPath
  }

  // 读取配置文件
  readConfig(): Config | null {
    try {
      if (!fs.existsSync(this.configPath)) {
        return null
      }

      const content = fs.readFileSync(this.configPath, 'utf8')
      return JSON.parse(content) as Config
    } catch {
      return null
    }
  }

  // 写入配置文件
  writeConfig(config: Config): void {
    const configDir = path.dirname(this.configPath)
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, {recursive: true})
    }

    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf8')
  }

  // 获取当前配置
  getCurrentProfile(): Profile | null {
    const config = this.readConfig()
    if (!config || !config.current) {
      return null
    }

    const profile = config.profiles.find((p) => p.name === config.current)
    return profile || null
  }

  // 更新当前配置的字段
  updateCurrentProfile(updates: Partial<Profile>): boolean {
    const config = this.readConfig()
    if (!config || !config.current) {
      return false
    }

    const profileIndex = config.profiles.findIndex((p) => p.name === config.current)
    if (profileIndex === -1) {
      return false
    }

    config.profiles[profileIndex] = {
      ...config.profiles[profileIndex],
      ...updates,
    }

    this.writeConfig(config)
    return true
  }

  // 添加或更新配置
  upsertProfile(profile: Profile, setCurrent = false): void {
    let config = this.readConfig()
    if (!config) {
      config = {current: '', profiles: []}
    }

    const existingIndex = config.profiles.findIndex((p) => p.name === profile.name)
    if (existingIndex >= 0) {
      config.profiles[existingIndex] = profile
    } else {
      config.profiles.push(profile)
    }

    if (setCurrent) {
      config.current = profile.name
    }

    this.writeConfig(config)
  }
}
