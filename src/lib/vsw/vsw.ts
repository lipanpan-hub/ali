/* eslint-disable @typescript-eslint/no-explicit-any */
import * as $vpc from '@alicloud/vpc20160428/dist/models/model.js'

import { createRuntime, getVpcClient } from '../client.js'
import { listVpcs } from '../vpc/vpc.js'

export interface VSwitchInfo {
  availableIpAddressCount: number
  cidrBlock: string
  status: string
  vpcId: string
  vswitchId: string
  vswitchName: string
  zoneId: string
}

export async function listVSwitches(vpcId: string): Promise<VSwitchInfo[]> {
  const vpcs = await listVpcs()
  const vpc = vpcs.find((v) => v.vpcId === vpcId)
  if (!vpc) return []

  const vswIds = vpc.vSwitchIds
  if (vswIds.length === 0) return []

  const results = await Promise.all(vswIds.map((id) => getVSwitchAttributes(id)))
  return results.filter((r): r is VSwitchInfo => r !== null).sort((a, b) => a.zoneId.localeCompare(b.zoneId))
}

export async function getVSwitchAttributes(vswitchId: string): Promise<null | VSwitchInfo> {
  const { client, region } = await getVpcClient()
  const request = new $vpc.DescribeVSwitchAttributesRequest({
    regionId: region,
    vSwitchId: vswitchId,
  })
  const runtime = createRuntime()

  try {
    const res = await client.describeVSwitchAttributesWithOptions(request, runtime)
    return {
      availableIpAddressCount: res.body?.availableIpAddressCount ?? 0,
      cidrBlock: res.body?.cidrBlock ?? '',
      status: res.body?.status ?? '',
      vpcId: res.body?.vpcId ?? '',
      vswitchId: res.body?.vSwitchId ?? vswitchId,
      vswitchName: res.body?.vSwitchName ?? '',
      zoneId: res.body?.zoneId ?? '',
    }
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}

export async function createVSwitch(
  vpcId: string,
  zoneId: string,
  cidrBlock: string,
  vswitchName: string,
): Promise<string> {
  const { client, region } = await getVpcClient()
  const request = new $vpc.CreateVSwitchRequest({
    cidrBlock,
    regionId: region,
    vpcId,
    vSwitchName: vswitchName,
    zoneId,
  })
  const runtime = createRuntime()

  try {
    const res = await client.createVSwitchWithOptions(request, runtime)
    return res.body?.vSwitchId ?? ''
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}

export async function deleteVSwitch(vswitchId: string): Promise<void> {
  const { client, region } = await getVpcClient()
  const request = new $vpc.DeleteVSwitchRequest({
    regionId: region,
    vSwitchId: vswitchId,
  })
  const runtime = createRuntime()

  try {
    await client.deleteVSwitchWithOptions(request, runtime)
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}
