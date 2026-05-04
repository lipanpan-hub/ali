// 配置文件类型定义
export interface Profile {
  access_key_id: string
  access_key_secret: string
  language: string
  mode: string
  name: string
  output_format: string
  region_id: string
  site: string
}

export interface Config {
  current: string
  profiles: Profile[]
}
