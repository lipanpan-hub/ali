/* eslint-disable @typescript-eslint/no-explicit-any */
import * as $vpc from '@alicloud/vpc20160428/dist/models/model.js'

import { createRuntime, getVpcClient } from '../client.js'

export interface VpcInfo {
  cidrBlock: string
  regionId: string
  status: string
  vpcId: string
  vpcName: string
  vSwitchIds: string[]
}

export async function listVpcs(): Promise<VpcInfo[]> {
  const { client, region } = await getVpcClient()
  const request = new $vpc.DescribeVpcsRequest({ regionId: region })
  const runtime = createRuntime()

  try {
    const res = await client.describeVpcsWithOptions(request, runtime)
    const vpcs = res.body?.vpcs?.vpc ?? []
    return vpcs.map((v: any) => ({
      cidrBlock: v.cidrBlock ?? '',
      regionId: v.regionId ?? '',
      status: v.status ?? '',
      vpcId: v.vpcId ?? '',
      vpcName: v.vpcName ?? '',
      vSwitchIds: v.vSwitchIds?.vSwitchId ?? [],
    }))
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}

export async function createVpc(cidrBlock: string, vpcName?: string, description?: string): Promise<string> {
  const { client, region } = await getVpcClient()
  const request = new $vpc.CreateVpcRequest({
    cidrBlock,
    description,
    regionId: region,
    vpcName,
  })
  const runtime = createRuntime()

  try {
    const res = await client.createVpcWithOptions(request, runtime)
    return res.body?.vpcId ?? ''
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}

export async function deleteVpc(vpcId: string): Promise<void> {
  const { client, region } = await getVpcClient()
  const request = new $vpc.DeleteVpcRequest({
    regionId: region,
    vpcId,
  })
  const runtime = createRuntime()

  try {
    await client.deleteVpcWithOptions(request, runtime)
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}
