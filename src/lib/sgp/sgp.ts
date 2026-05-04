/* eslint-disable @typescript-eslint/no-explicit-any */
import * as $ecs from '@alicloud/ecs20140526/dist/models/model.js'

import { createRuntime, getEcsClient } from '../client.js'

export interface SecurityGroupInfo {
  creationTime: string
  description: string
  ruleCount: number
  securityGroupId: string
  securityGroupName: string
  vpcId: string
}

export interface SecurityGroupRule {
  creationTime: string
  description: string
  direction: string
  ipProtocol: string
  policy: string
  portRange: string
  priority: string
  sourceCidrIp: string
  sourceGroupId: string
}

export async function listSecurityGroups(): Promise<SecurityGroupInfo[]> {
  const { client, region } = await getEcsClient()
  const request = new $ecs.DescribeSecurityGroupsRequest({ regionId: region })
  const runtime = createRuntime()

  try {
    const res = await client.describeSecurityGroupsWithOptions(request, runtime)
    const groups = res.body?.securityGroups?.securityGroup ?? []
    return groups.map((sg: any) => ({
      creationTime: sg.creationTime ?? '',
      description: sg.description ?? '',
      ruleCount: sg.ruleCount ?? 0,
      securityGroupId: sg.securityGroupId ?? '',
      securityGroupName: sg.securityGroupName ?? '',
      vpcId: sg.vpcId ?? '',
    }))
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}

export async function getSecurityGroupAttribute(
  securityGroupId: string,
): Promise<SecurityGroupRule[]> {
  const { client, region } = await getEcsClient()
  const request = new $ecs.DescribeSecurityGroupAttributeRequest({
    regionId: region,
    securityGroupId,
  })
  const runtime = createRuntime()

  try {
    const res = await client.describeSecurityGroupAttributeWithOptions(request, runtime)
    const permissions = res.body?.permissions?.permission ?? []
    return permissions.map((p: any) => ({
      creationTime: p.creationTime ?? '',
      description: p.description ?? '',
      direction: p.direction ?? '',
      ipProtocol: p.ipProtocol ?? '',
      policy: p.policy ?? '',
      portRange: p.portRange ?? '',
      priority: p.priority ?? '',
      sourceCidrIp: p.sourceCidrIp ?? '',
      sourceGroupId: p.sourceGroupId ?? '',
    }))
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}
