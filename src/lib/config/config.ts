import * as fs from 'node:fs'
import * as os from 'node:os'
import {dirname, join} from 'node:path'

import type {Config, Profile} from './types.js'

export class ConfigManager {
  private configPath: string

  constructor(configPath: string) {
    this.configPath = configPath
  }

  /**
   * 获取配置文件的默认存储路径。
   *
   * @returns 位于用户主目录下的 `.aliops/config.json` 绝对路径
   */
  static getDefaultPath(): string {
    return join(os.homedir(), '.aliops', 'config.json')
  }

  getConfigPath(): string {
    return this.configPath
  }

  /**
   * 获取当前激活的配置档案（profile）。
   *
   * @returns 当前档案对象；若配置不存在、未设置当前档案或未找到匹配档案则返回 `null`
   */
  getCurrentProfile(): null | Profile {
    const config = this.readConfig()
    if (!config?.current) return null
    return config.profiles.find((p) => p.name === config.current) ?? null
  }

  /**
   * 读取并解析配置文件。
   *
   * @returns 解析后的配置对象；若文件不存在或解析失败则返回 `null`
   */
  readConfig(): Config | null {
    try {
      if (!fs.existsSync(this.configPath)) return null
      return JSON.parse(fs.readFileSync(this.configPath, 'utf8')) as Config
    } catch {
      return null
    }
  }

  /**
   * 局部更新当前激活档案的字段。
   *
   * @param updates - 需要合并到当前档案的部分字段
   * @returns 更新成功返回 `true`；若无配置、未设置当前档案或未找到档案则返回 `false`
   */
  updateCurrentProfile(updates: Partial<Profile>): boolean {
    const config = this.readConfig()
    if (!config?.current) return false

    const idx = config.profiles.findIndex((p) => p.name === config.current)
    if (idx === -1) return false

    config.profiles[idx] = {...config.profiles[idx], ...updates}
    this.writeConfig(config)
    return true
  }

  /**
   * 新增或更新一个配置档案（存在则覆盖，不存在则追加）。
   *
   * @param profile - 要写入的档案对象
   * @param setCurrent - 是否同时将该档案设为当前激活档案，默认 `false`
   */
  upsertProfile(profile: Profile, setCurrent = false): void {
    const config = this.readConfig() ?? {current: '', profiles: []}

    const idx = config.profiles.findIndex((p) => p.name === profile.name)
    if (idx === -1) {
      config.profiles.push(profile)
    } else {
      config.profiles[idx] = profile
    }

    if (setCurrent) config.current = profile.name
    this.writeConfig(config)
  }

  /**
   * 将配置对象序列化并写入配置文件（必要时自动创建目录）。
   *
   * @param config - 要持久化的完整配置对象
   */
  writeConfig(config: Config): void {
    const dir = dirname(this.configPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true})
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf8')
  }
}
