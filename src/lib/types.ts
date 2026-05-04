export interface Profile {
  access_key_id: string
  access_key_secret: string
  language?: string
  mode: string
  name: string
  output_format?: string
  region_id: string
  site?: string
}

export interface AppConfig {
  current: string
  profiles: Profile[]
}

export interface AliError {
  data?: { Recommend?: string }
  message: string
}

export interface PromptChoice {
  description?: string
  title: string
  value: string
}
