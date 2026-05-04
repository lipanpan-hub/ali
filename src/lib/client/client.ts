import {$OpenApiUtil} from '@alicloud/openapi-core'

import {ConfigManager} from '../config/config.js'

// 单例模式的客户端配置类
export class ClientConfig {
  private static instance: ClientConfig | null = null
  public config: $OpenApiUtil.Config | null = null
  public region: string = ''

  private constructor() {
    const configManager = new ConfigManager()
    const currentProfile = configManager.getCurrentProfile()

    if (!currentProfile) {
      console.log('配置文件不存在, 请使用 ali config set 命令生成配置文件。')
      return
    }

    // 创建配置对象
    this.config = new $OpenApiUtil.Config({
      accessKeyId: currentProfile.access_key_id,
      accessKeySecret: currentProfile.access_key_secret,
    })

    this.region = currentProfile.region_id
  }

  // 获取单例实例
  public static getInstance(): ClientConfig {
    if (!ClientConfig.instance) {
      ClientConfig.instance = new ClientConfig()
    }

    return ClientConfig.instance
  }

  // 重置单例(用于配置更新后重新加载)
  public static reset(): void {
    ClientConfig.instance = null
  }
}
