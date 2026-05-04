/* eslint-disable @typescript-eslint/no-explicit-any */
import * as $ecs from '@alicloud/ecs20140526/dist/models/model.js'

import { createRuntime, getEcsClient } from '../client.js'

export interface InstanceInfo {
  imageId: string
  instanceChargeType: string
  instanceId: string
  instanceName: string
  instanceType: string
  internetChargeType: string
  primaryPrivateIp: string
  publicIp: string
  regionId: string
  securityGroupIds: string[]
  status: string
  vpcId: string
  vswitchId: string
}

export interface CreateInstanceParams {
  imageId: string
  instanceName?: string
  instanceType: string
  loginAsNonRoot?: boolean
  password: string
  privateIpAddress?: string
  securityGroupIds: string[]
  systemDiskCategory?: string
  systemDiskSize?: string
  vswitchId: string
}

export interface DiskTypeInfo {
  max: string
  min: string
  value: string
}

export async function listInstances(): Promise<InstanceInfo[]> {
  const { client, region } = await getEcsClient()
  const request = new $ecs.DescribeInstancesRequest({ regionId: region })
  const runtime = createRuntime()

  try {
    const res = await client.describeInstancesWithOptions(request, runtime)
    const instances = res.body?.instances?.instance ?? []
    return instances.map((inst: any) => {
      const ni = inst.networkInterfaces?.networkInterface?.[0]
      return {
        imageId: inst.imageId ?? '',
        instanceChargeType: inst.instanceChargeType ?? '',
        instanceId: inst.instanceId ?? '',
        instanceName: inst.instanceName ?? '',
        instanceType: inst.instanceType ?? '',
        internetChargeType: inst.internetChargeType ?? '',
        primaryPrivateIp: ni?.primaryIpAddress ?? '',
        publicIp: inst.publicIpAddresses?.ipAddress?.[0] ?? '',
        regionId: inst.regionId ?? '',
        securityGroupIds: inst.securityGroupIds?.securityGroupId ?? [],
        status: inst.status ?? '',
        vpcId: inst.vpcAttributes?.vpcId ?? '',
        vswitchId: inst.vpcAttributes?.vSwitchId ?? '',
      }
    })
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}

export async function createInstance(params: CreateInstanceParams): Promise<void> {
  const { client, region } = await getEcsClient()
  const request = new $ecs.RunInstancesRequest({
    imageId: params.imageId,
    imageOptions: new $ecs.RunInstancesRequestImageOptions({
      loginAsNonRoot: params.loginAsNonRoot ?? true,
    }),
    instanceChargeType: 'PostPaid',
    instanceName: params.instanceName ?? 'test',
    instanceType: params.instanceType,
    internetChargeType: 'PayByTraffic',
    internetMaxBandwidthOut: 100,
    password: params.password,
    privateDnsNameOptions: new $ecs.RunInstancesRequestPrivateDnsNameOptions({
      enableInstanceIdDnsAaaaRecord: true,
      enableInstanceIdDnsARecord: true,
      enableIpDnsARecord: true,
      enableIpDnsPtrRecord: true,
      hostnameType: 'IpBased',
    }),
    privateIpAddress: params.privateIpAddress,
    regionId: region,
    securityGroupIds: params.securityGroupIds,
    spotInterruptionBehavior: 'Stop',
    spotStrategy: 'SpotAsPriceGo',
    systemDisk: new $ecs.RunInstancesRequestSystemDisk({
      category: params.systemDiskCategory ?? 'cloud_essd',
      size: params.systemDiskSize ?? '40',
    }),
    vSwitchId: params.vswitchId,
  })
  const runtime = createRuntime()

  try {
    await client.runInstancesWithOptions(request, runtime)
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}

export async function deleteInstance(instanceId: string): Promise<void> {
  const { client } = await getEcsClient()
  const request = new $ecs.DeleteInstanceRequest({
    instanceId,
  })
  const runtime = createRuntime()

  try {
    await client.deleteInstanceWithOptions(request, runtime)
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}

export async function listZones(): Promise<Record<string, string>> {
  const { client, region } = await getEcsClient()
  const request = new $ecs.DescribeZonesRequest({
    instanceChargeType: 'PostPaid',
    regionId: region,
  })
  const runtime = createRuntime()

  try {
    const res = await client.describeZonesWithOptions(request, runtime)
    const zones = res.body?.zones?.zone ?? []
    const result: Record<string, string> = {}
    for (const zone of zones) {
      result[zone.zoneId ?? ''] = `${zone.zoneId} ${zone.localName} ${zone.zoneType}`
    }

    return result
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}

export async function listInstanceTypes(zoneId?: string): Promise<string[]> {
  const { client, region } = await getEcsClient()
  const request = new $ecs.DescribeAvailableResourceRequest({
    destinationResource: 'InstanceType',
    instanceChargeType: 'PostPaid',
    regionId: region,
    spotStrategy: 'SpotAsPriceGo',
  })
  const runtime = createRuntime()

  try {
    const res = await client.describeAvailableResourceWithOptions(request, runtime)
    const instanceTypes: string[] = []
    const zones = res.body?.availableZones?.availableZone ?? []

    for (const zone of zones) {
      if (zoneId && zone.zoneId !== zoneId) continue
      const resources = zone.availableResources?.availableResource ?? []
      for (const resource of resources) {
        const supported = resource.supportedResources?.supportedResource ?? []
        for (const s of supported) {
          if (s.value && !instanceTypes.includes(s.value)) {
            instanceTypes.push(s.value)
          }
        }
      }
    }

    return instanceTypes
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}

export async function getAvailableSystemDiskTypes(
  instanceType: string,
  zoneId: string,
): Promise<DiskTypeInfo[]> {
  const { client, region } = await getEcsClient()
  const request = new $ecs.DescribeAvailableResourceRequest({
    destinationResource: 'SystemDisk',
    instanceChargeType: 'PostPaid',
    instanceType,
    regionId: region,
    spotStrategy: 'SpotAsPriceGo',
  })
  const runtime = createRuntime()

  try {
    const res = await client.describeAvailableResourceWithOptions(request, runtime)
    const diskTypes: DiskTypeInfo[] = []
    const zones = res.body?.availableZones?.availableZone ?? []

    for (const zone of zones) {
      if (zone.zoneId !== zoneId) continue
      const resources = zone.availableResources?.availableResource ?? []
      for (const resource of resources) {
        const supported = resource.supportedResources?.supportedResource ?? []
        for (const s of supported) {
          if (s.status === 'Available' && s.value) {
            const existing = diskTypes.find((d) => d.value === s.value)
            if (!existing) {
              diskTypes.push({ max: s.max ?? '', min: s.min ?? '', value: s.value })
            }
          }
        }
      }
    }

    return diskTypes
  } catch (error: any) {
    console.error(error.message)
    if (error.data?.Recommend) console.error(`诊断建议: ${error.data.Recommend}`)
    throw error
  }
}
