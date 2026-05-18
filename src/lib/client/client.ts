import {createRequire} from 'node:module'

import {ConfigManager} from '../config/config.js'

const require = createRequire(import.meta.url)
const {$OpenApiUtil} = require('@alicloud/openapi-core')
const Ecs20140526 = require('@alicloud/ecs20140526').default
const Vpc20160428 = require('@alicloud/vpc20160428').default

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SdkClient = any

let cached: null | {config: {accessKeyId: string; accessKeySecret: string}; region: string} = null

function getConfig() {
  if (cached) return cached

  const profile = new ConfigManager().getCurrentProfile()
  if (!profile) {
    console.log('配置文件不存在, 请使用 ali config set 命令生成配置文件。')
    return null
  }

  cached = {
    config: {accessKeyId: profile.access_key_id, accessKeySecret: profile.access_key_secret},
    region: profile.region_id,
  }
  return cached
}

export function resetAliClient(): void {
  cached = null
}

export interface ClientWithRegion {
  client: SdkClient
  region: string
}

export function createEcsClient(): ClientWithRegion | null {
  const c = getConfig()
  if (!c) return null
  const config = new $OpenApiUtil.Config({...c.config, endpoint: `ecs.${c.region}.aliyuncs.com`})
  return {client: new Ecs20140526(config), region: c.region}
}

export function createVpcClient(): ClientWithRegion | null {
  const c = getConfig()
  if (!c) return null
  const config = new $OpenApiUtil.Config({...c.config, endpoint: `vpc.${c.region}.aliyuncs.com`})
  return {client: new Vpc20160428(config), region: c.region}
}
