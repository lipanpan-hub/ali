import * as fs from 'node:fs'
import * as os from 'node:os'
import {dirname, join} from 'node:path'

import type {Config, Profile} from './types.js'

export class ConfigManager {
  private configPath: string

  constructor() {
    this.configPath = join(os.homedir(), '.aliops', 'config.json')
  }

  getConfigPath(): string {
    return this.configPath
  }

  getCurrentProfile(): null | Profile {
    const config = this.readConfig()
    if (!config?.current) return null
    return config.profiles.find((p) => p.name === config.current) ?? null
  }

  readConfig(): Config | null {
    try {
      if (!fs.existsSync(this.configPath)) return null
      return JSON.parse(fs.readFileSync(this.configPath, 'utf8')) as Config
    } catch {
      return null
    }
  }

  updateCurrentProfile(updates: Partial<Profile>): boolean {
    const config = this.readConfig()
    if (!config?.current) return false

    const idx = config.profiles.findIndex((p) => p.name === config.current)
    if (idx === -1) return false

    config.profiles[idx] = {...config.profiles[idx], ...updates}
    this.writeConfig(config)
    return true
  }

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

  writeConfig(config: Config): void {
    const dir = dirname(this.configPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true})
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf8')
  }
}
