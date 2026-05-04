/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command, Flags } from '@oclif/core'

import { listInstances } from '../../lib/ecs/ecs.js'

export default class EcsLs extends Command {
  static description = '列出ECS实例列表'
static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --block',
  ]
static flags = {
    block: Flags.boolean({ char: 'b', default: false, description: '多行显示模式' }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(EcsLs)

    try {
      const instances = await listInstances()
      if (instances.length === 0) {
        this.warn('当前region下没有实例')
        return
      }

      for (const inst of instances) {
        if (flags.block) {
          this.log(`实例ID: ${inst.instanceId}`)
          this.log(`实例状态: ${inst.status}`)
          this.log(`公网IP: ${inst.publicIp}`)
          this.log(`实例名称: ${inst.instanceName}`)
          this.log(`实例规格: ${inst.instanceType}`)
          this.log(`网络计费类型: ${inst.internetChargeType}`)
          this.log(`地域ID: ${inst.regionId}`)
          this.log(`主私网IP: ${inst.primaryPrivateIp}`)
          this.log(`镜像ID: ${inst.imageId}`)
          this.log(`安全组ID: ${inst.securityGroupIds.join(', ')}`)
          this.log(`交换机ID: ${inst.vswitchId}`)
          this.log(`专有网络ID: ${inst.vpcId}`)
          this.log('-'.repeat(50))
        } else {
          this.log(`实例ID: ${inst.instanceId} | 状态: ${inst.status} | 公网IP: ${inst.publicIp} | 私网IP: ${inst.primaryPrivateIp} | 规格: ${inst.instanceType} | 名称: ${inst.instanceName} | 镜像: ${inst.imageId} | 安全组: ${inst.securityGroupIds.join(',')} | 交换机: ${inst.vswitchId}`)
        }
      }
    } catch (error: any) {
      this.error(error.message ?? '未知错误')
    }
  }
}
