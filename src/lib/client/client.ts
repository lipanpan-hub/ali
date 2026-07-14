import {createRequire} from 'node:module'

import {ConfigManager} from '../config/config.js'

const require = createRequire(import.meta.url)
const {$OpenApiUtil} = require('@alicloud/openapi-core')
const Bssopenapi20171214 = require('@alicloud/bssopenapi20171214').default
const Ecs20140526 = require('@alicloud/ecs20140526').default
const Tingwu20230930 = require('@alicloud/tingwu20230930').default
const Vpc20160428 = require('@alicloud/vpc20160428').default
const NlsFileTransClient = require('@alicloud/nls-filetrans-2018-08-17')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SdkClient = any

let cached: null | {config: {accessKeyId: string; accessKeySecret: string}; region: string; site: string} = null

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
    site: profile.site,
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

export function createBssClient(): ClientWithRegion | null {
  const c = getConfig()
  if (!c) return null
  // BSS 账单为账号级全局服务, 国内站与国际站使用不同的中心化 endpoint
  const endpoint = c.site === 'intl' ? 'business.ap-southeast-1.aliyuncs.com' : 'business.aliyuncs.com'
  const config = new $OpenApiUtil.Config({...c.config, endpoint})
  return {client: new Bssopenapi20171214(config), region: c.region}
}

export function createTingwuClient(): ClientWithRegion | null {
  const c = getConfig()
  if (!c) return null
  // 通义听悟仅部署在华北2(北京), endpoint 与 regionId 固定, 不读取配置地域
  const config = new $OpenApiUtil.Config({...c.config, endpoint: 'tingwu.cn-beijing.aliyuncs.com', regionId: 'cn-beijing'})
  return {client: new Tingwu20230930(config), region: 'cn-beijing'}
}

export function createNlsClient(): ClientWithRegion | null {
  const c = getConfig()
  if (!c) return null
  // 录音文件识别为中心化服务, endpoint 固定上海, 基于 pop-core RPCClient 而非 OpenApi
  const client = new NlsFileTransClient({
    accessKeyId: c.config.accessKeyId,
    accessKeySecret: c.config.accessKeySecret,
    apiVersion: '2018-08-17',
    endpoint: 'http://filetrans.cn-shanghai.aliyuncs.com',
  })
  return {client, region: 'cn-shanghai'}
}
