// 配置文件类型定义

// 本地目录与 OSS 存储桶的绑定关系
export interface OssBktBinding {
  bucket_name: string
  bucket_region: string
  exclude_filters: string[] // 反向过滤器: 命中则从本地目录中去除文件
  include_filters: string[] // 正向过滤器: 命中则在本地目录中保留文件
  local_dir: string
}

export interface Profile {
  access_key_id: string
  access_key_secret: string
  language: string
  mode: string
  name: string
  nls_app_keys?: string[]
  oss_bkt_binding?: OssBktBinding[]
  output_format: string
  region_id: string
  site: string
  tingwu_app_keys?: string[]
}

export interface Config {
  current: string
  profiles: Profile[]
}
