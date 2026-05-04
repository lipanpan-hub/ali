import {createRequire} from 'node:module'

import * as $Ecs20140526 from '@alicloud/ecs20140526'
import * as $Util from '@alicloud/tea-util'

import {ClientConfig} from '../client/client.js'

const require = createRequire(import.meta.url)
const Ecs20140526 = require('@alicloud/ecs20140526').default

export class EcsManager {
  private client: any = null
  private region: string = ''

  constructor() {
    const clientConfig = ClientConfig.getInstance()
    if (!clientConfig.config) {
      console.log('配置文件不存在, 请使用 ali config set 命令生成配置文件。')
      return
    }

    this.region = clientConfig.region
    const config = {
      ...clientConfig.config,
      endpoint: `ecs.${this.region}.aliyuncs.com`,
    }
    this.client = new Ecs20140526(config)
  }

  // 获取可用区列表
  async getZones(): Promise<Record<string, string> | null> {
    if (!this.client) return null

    const request = new $Ecs20140526.DescribeZonesRequest({
      instanceChargeType: 'PostPaid',
      regionId: this.region,
      verbose: false,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      const res = await this.client.describeZonesWithOptions(request, runtime)
      const zonesDict: Record<string, string> = {}

      if (res.body?.zones?.zone) {
        for (const zone of res.body.zones.zone) {
          zonesDict[zone.zoneId] = `${zone.zoneId} ${zone.localName} ${zone.zoneType}`
        }
      }

      return zonesDict
    } catch (error: any) {
      console.log(`获取可用区列表失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`建议: ${error.data.Recommend}`)
      }

      return null
    }
  }

  // 获取 ECS 实例列表
  async getInstances(): Promise<$Ecs20140526.DescribeInstancesResponse | null> {
    if (!this.client) return null

    const request = new $Ecs20140526.DescribeInstancesRequest({
      regionId: this.region,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      return await this.client.describeInstancesWithOptions(request, runtime)
    } catch (error: any) {
      console.log(`获取实例列表失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`建议: ${error.data.Recommend}`)
      }

      return null
    }
  }

  // 删除 ECS 实例
  async deleteInstance(instanceId: string): Promise<boolean> {
    if (!this.client) return false

    const request = new $Ecs20140526.DeleteInstanceRequest({
      instanceId,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      await this.client.deleteInstanceWithOptions(request, runtime)
      console.log(`实例 ${instanceId} 删除操作已执行`)
      return true
    } catch (error: any) {
      console.log(`删除实例失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`诊断建议: ${error.data.Recommend}`)
      }

      return false
    }
  }

  // 停止 ECS 实例
  async stopInstance(instanceId: string): Promise<boolean> {
    if (!this.client) return false

    const request = new $Ecs20140526.StopInstanceRequest({
      instanceId,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      await this.client.stopInstanceWithOptions(request, runtime)
      console.log(`实例 ${instanceId} 停止请求已发送`)
      return true
    } catch (error: any) {
      console.log(`停止实例失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`诊断建议: ${error.data.Recommend}`)
      }

      return false
    }
  }

  // 启动 ECS 实例
  async startInstance(instanceId: string): Promise<boolean> {
    if (!this.client) return false

    const request = new $Ecs20140526.StartInstanceRequest({
      instanceId,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      await this.client.startInstanceWithOptions(request, runtime)
      console.log(`实例 ${instanceId} 启动请求已发送`)
      return true
    } catch (error: any) {
      console.log(`启动实例失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`诊断建议: ${error.data.Recommend}`)
      }

      return false
    }
  }

  // 创建 ECS 实例
  async createInstance(params: {
    cidrBlock?: string
    imageId: string
    instanceName: string
    instanceType: string
    password: string
    privateIpAddress?: string
    securityGroupIds: string[]
    systemDiskCategory: string
    systemDiskSize: string
    vSwitchId: string
  }): Promise<$Ecs20140526.RunInstancesResponse | null> {
    if (!this.client) return null

    const systemDisk = new $Ecs20140526.RunInstancesRequestSystemDisk({
      category: params.systemDiskCategory,
      size: params.systemDiskSize,
    })

    const request = new $Ecs20140526.RunInstancesRequest({
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
      systemDisk,
      vSwitchId: params.vSwitchId,
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      const res = await this.client.runInstancesWithOptions(request, runtime)
      console.log(`实例创建成功: ${params.instanceName}`)
      return res
    } catch (error: any) {
      console.log(`创建实例失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`诊断建议: ${error.data.Recommend}`)
      }

      return null
    }
  }

  // 获取实例规格列表
  async getInstanceTypes(zoneId?: string): Promise<string[]> {
    if (!this.client) return []

    const request = new $Ecs20140526.DescribeAvailableResourceRequest({
      destinationResource: 'InstanceType',
      instanceChargeType: 'PostPaid',
      regionId: this.region,
      spotStrategy: 'SpotAsPriceGo',
    })

    const runtime = new $Util.RuntimeOptions({})

    try {
      const res = await this.client.describeAvailableResourceWithOptions(request, runtime)
      const instanceTypes: string[] = []

      if (res.body?.availableZones?.availableZone) {
        for (const zone of res.body.availableZones.availableZone) {
          // 如果指定了 zone_id，则只处理匹配的可用区
          if (zoneId && zone.zoneId !== zoneId) {
            continue
          }

          if (zone.availableResources?.availableResource) {
            for (const resource of zone.availableResources.availableResource) {
              if (resource.supportedResources?.supportedResource) {
                for (const supported of resource.supportedResources.supportedResource) {
                  if (supported.value && !instanceTypes.includes(supported.value)) {
                    instanceTypes.push(supported.value)
                  }
                }
              }
            }
          }
        }
      }

      return instanceTypes.sort()
    } catch (error: any) {
      console.log(`获取实例规格失败: ${error.message}`)
      if (error.data?.Recommend) {
        console.log(`建议: ${error.data.Recommend}`)
      }

      return []
    }
  }

  // 列出 ECS 实例
  async listInstances(block = true): Promise<void> {
    const res = await this.getInstances()
    if (!res || !res.body?.instances?.instance) {
      console.log('未找到 ECS 实例')
      return
    }

    const instances = res.body.instances.instance
    for (const instance of instances) {
      // 获取主私网IP
      let primaryIp = ''
      if (instance.networkInterfaces?.networkInterface && instance.networkInterfaces.networkInterface.length > 0) {
        primaryIp = instance.networkInterfaces.networkInterface[0].primaryIpAddress || ''
      }

      // 获取交换机ID和专有网络ID
      let vswitchId = ''
      let vpcId = ''
      if (instance.vpcAttributes) {
        vswitchId = instance.vpcAttributes.vSwitchId || ''
        vpcId = instance.vpcAttributes.vpcId || ''
      }

      // 获取公网IP
      const publicIp =
        instance.publicIpAddress?.ipAddress && instance.publicIpAddress.ipAddress.length > 0
          ? instance.publicIpAddress.ipAddress[0]
          : '无'

      if (block) {
        // 多行输出模式
        console.log(`实例ID: ${instance.instanceId}`)
        console.log(`实例状态: ${instance.status}`)
        console.log(`公网IP: ${publicIp}`)
        console.log(`实例名称: ${instance.instanceName}`)
        console.log(`实例规格: ${instance.instanceType}`)
        console.log(`网络计费类型: ${instance.internetChargeType}`)
        console.log(`地域ID: ${instance.regionId}`)
        console.log(`主私网IP: ${primaryIp}`)
        console.log(`镜像ID: ${instance.imageId}`)
        console.log(`安全组ID: ${instance.securityGroupIds?.securityGroupId?.join(', ') || '无'}`)
        console.log(`交换机ID: ${vswitchId}`)
        console.log(`专有网络ID: ${vpcId}`)
        console.log('-'.repeat(50))
      } else {
        // 单行输出模式
        const securityGroups = instance.securityGroupIds?.securityGroupId?.join(', ') || '无'
        console.log(
          `实例ID: ${instance.instanceId} | 状态: ${instance.status} | 公网IP: ${publicIp} | 私网IP: ${primaryIp} | 规格: ${instance.instanceType} | 名称: ${instance.instanceName} | 镜像: ${instance.imageId} | 安全组: ${securityGroups} | 交换机: ${vswitchId}`,
        )
      }
    }
  }
}
