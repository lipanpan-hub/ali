import { $OpenApiUtil } from '@alicloud/openapi-core'
import * as $dara from '@darabonba/typescript'

import { ConfigManager } from './config.js'

const configManager = new ConfigManager()

export async function buildOpenApiConfig(endpoint: string): Promise<$OpenApiUtil.Config> {
  const profile = await configManager.getCurrentProfile()
  if (!profile) {
    throw new Error('配置文件不存在，请使用 ali config set 命令生成配置文件。')
  }

  return new $OpenApiUtil.Config({
    accessKeyId: profile.access_key_id,
    accessKeySecret: profile.access_key_secret,
    endpoint,
    regionId: profile.region_id,
  })
}

export function createRuntime(): $dara.RuntimeOptions {
  return new $dara.RuntimeOptions()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor = new (...args: any[]) => any

export async function getEcsClient(): Promise<{ client: InstanceType<AnyConstructor>; region: string }> {
  const profile = await configManager.getCurrentProfile()
  if (!profile) {
    throw new Error('配置文件不存在，请使用 ali config set 命令生成配置文件。')
  }

  const endpoint = `ecs.${profile.region_id}.aliyuncs.com`
  const config = await buildOpenApiConfig(endpoint)
  const EcsClientModule = await import('@alicloud/ecs20140526')
  const EcsClient = EcsClientModule.default as unknown as AnyConstructor
  return { client: new EcsClient(config), region: profile.region_id }
}

export async function getVpcClient(): Promise<{ client: InstanceType<AnyConstructor>; region: string }> {
  const profile = await configManager.getCurrentProfile()
  if (!profile) {
    throw new Error('配置文件不存在，请使用 ali config set 命令生成配置文件。')
  }

  const endpoint = `vpc.${profile.region_id}.aliyuncs.com`
  const config = await buildOpenApiConfig(endpoint)
  const VpcClientModule = await import('@alicloud/vpc20160428')
  const VpcClient = VpcClientModule.default as unknown as AnyConstructor
  return { client: new VpcClient(config), region: profile.region_id }
}
