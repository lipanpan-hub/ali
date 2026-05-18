import {
  DeleteInstanceRequest,
  DescribeAvailableResourceRequest,
  DescribeInstancesRequest,
  DescribeInstancesResponse,
  DescribeZonesRequest,
  RunInstancesRequest,
  RunInstancesRequestSystemDisk,
  RunInstancesResponse,
  StartInstanceRequest,
  StopInstanceRequest,
} from '@alicloud/ecs20140526'

import {createEcsClient} from '../client/client.js'
import {createRuntime} from '../client/runtime.js'
import {wrap} from '../client/wrap.js'

export interface CreateInstanceParams {
  imageId: string
  instanceName: string
  instanceType: string
  password: string
  privateIpAddress?: string
  securityGroupIds: string[]
  systemDiskCategory: string
  systemDiskSize: string
  vSwitchId: string
}

export class EcsManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any = null
  private region: string = ''

  constructor() {
    const c = createEcsClient()
    if (!c) return
    this.client = c.client
    this.region = c.region
  }

  // #region 创建
  async createInstance(params: CreateInstanceParams): Promise<null | RunInstancesResponse> {
    if (!this.client) return null

    const request = new RunInstancesRequest({
      imageId: params.imageId,
      instanceChargeType: 'PostPaid',
      instanceName: params.instanceName,
      instanceType: params.instanceType,
      internetChargeType: 'PayByTraffic',
      internetMaxBandwidthOut: 100,
      password: params.password,
      privateIpAddress: params.privateIpAddress,
      regionId: this.region,
      securityGroupIds: params.securityGroupIds,
      spotInterruptionBehavior: 'Stop',
      spotStrategy: 'SpotAsPriceGo',
      systemDisk: new RunInstancesRequestSystemDisk({
        category: params.systemDiskCategory,
        size: params.systemDiskSize,
      }),
      vSwitchId: params.vSwitchId,
    })

    return wrap('创建实例', async () => {
      const res = await this.client.runInstancesWithOptions(request, createRuntime())
      console.log(`实例创建成功: ${params.instanceName}`)
      return res as RunInstancesResponse
    })
  }
  // #endregion

  // #region 删除
  async deleteInstance(instanceId: string): Promise<boolean> {
    if (!this.client) return false

    const request = new DeleteInstanceRequest({force: true, instanceId})
    const ok = await wrap('删除实例', async () => {
      await this.client.deleteInstanceWithOptions(request, createRuntime())
      console.log(`实例 ${instanceId} 删除操作已执行`)
      return true
    })
    return ok ?? false
  }
  // #endregion

  // #region 实例列表（分页拉取全部）
  async getInstances(): Promise<DescribeInstancesResponse | null> {
    if (!this.client) return null

    const request = new DescribeInstancesRequest({maxResults: 100, regionId: this.region})

    return wrap('获取实例列表', async () => {
      const res = await this.client.describeInstancesWithOptions(request, createRuntime())
      return res as DescribeInstancesResponse
    })
  }
  // #endregion

  // #region 实例规格
  async getInstanceTypes(zoneId?: string): Promise<string[]> {
    if (!this.client) return []

    const request = new DescribeAvailableResourceRequest({
      destinationResource: 'InstanceType',
      instanceChargeType: 'PostPaid',
      regionId: this.region,
      spotStrategy: 'SpotAsPriceGo',
      zoneId,
    })

    const res = await wrap('获取实例规格', async () =>
      this.client.describeAvailableResourceWithOptions(request, createRuntime()),
    )
    if (!res) return []

    const set = new Set<string>()
    for (const zone of res.body?.availableZones?.availableZone ?? []) {
      if (zoneId && zone.zoneId !== zoneId) continue
      for (const r of zone.availableResources?.availableResource ?? []) {
        for (const item of r.supportedResources?.supportedResource ?? []) {
          if (item.value && item.status === 'Available') set.add(item.value)
        }
      }
    }

    return [...set].sort()
  }
  // #endregion

  // #region 可用区
  async getZones(): Promise<Record<string, string>> {
    if (!this.client) return {}

    const request = new DescribeZonesRequest({
      instanceChargeType: 'PostPaid',
      regionId: this.region,
      verbose: false,
    })

    const res = await wrap('获取可用区列表', async () =>
      this.client.describeZonesWithOptions(request, createRuntime()),
    )
    if (!res) return {}

    const dict: Record<string, string> = {}
    for (const z of res.body?.zones?.zone ?? []) {
      if (z.zoneId) dict[z.zoneId] = `${z.zoneId} ${z.localName ?? ''} ${z.zoneType ?? ''}`
    }

    return dict
  }
  // #endregion

  // #region 列出
  async listInstances(block = false): Promise<void> {
    const res = await this.getInstances()
    const instances = res?.body?.instances?.instance ?? []
    if (instances.length === 0) {
      console.log('当前区域没有 ECS 实例')
      return
    }

    for (const i of instances) {
      const primaryIp = i.networkInterfaces?.networkInterface?.[0]?.primaryIpAddress || ''
      const publicIp = i.publicIpAddress?.ipAddress?.[0] || '无'
      const sgIds = i.securityGroupIds?.securityGroupId?.join(', ') || '无'
      const vswId = i.vpcAttributes?.vSwitchId || ''
      const vpcId = i.vpcAttributes?.vpcId || ''

      if (block) {
        console.log(`实例ID: ${i.instanceId}`)
        console.log(`实例状态: ${i.status}`)
        console.log(`公网IP: ${publicIp}`)
        console.log(`实例名称: ${i.instanceName}`)
        console.log(`实例规格: ${i.instanceType}`)
        console.log(`网络计费类型: ${i.internetChargeType}`)
        console.log(`地域ID: ${i.regionId}`)
        console.log(`主私网IP: ${primaryIp}`)
        console.log(`镜像ID: ${i.imageId}`)
        console.log(`安全组ID: ${sgIds}`)
        console.log(`交换机ID: ${vswId}`)
        console.log(`专有网络ID: ${vpcId}`)
        console.log('-'.repeat(50))
      } else {
        console.log(
          `${i.instanceId} | 状态:${i.status} | 公网:${publicIp} | 私网:${primaryIp} | 规格:${i.instanceType} | 名称:${i.instanceName} | 安全组:${sgIds} | 交换机:${vswId}`,
        )
      }
    }
  }
  // #endregion

  // #region 启停
  async startInstance(instanceId: string): Promise<boolean> {
    if (!this.client) return false
    const request = new StartInstanceRequest({instanceId})
    const ok = await wrap('启动实例', async () => {
      await this.client.startInstanceWithOptions(request, createRuntime())
      console.log(`实例 ${instanceId} 启动请求已发送`)
      return true
    })
    return ok ?? false
  }

  async stopInstance(instanceId: string): Promise<boolean> {
    if (!this.client) return false
    const request = new StopInstanceRequest({instanceId})
    const ok = await wrap('停止实例', async () => {
      await this.client.stopInstanceWithOptions(request, createRuntime())
      console.log(`实例 ${instanceId} 停止请求已发送`)
      return true
    })
    return ok ?? false
  }
  // #endregion
}
