import {Args, Command} from '@oclif/core'
import * as inquirer from '@inquirer/prompts'

import {EcsManager} from '../../lib/ecs/ecs.js'

export default class EcsDel extends Command {
  static args = {
    instanceId: Args.string({description: 'ECS 实例 ID (可选，不提供则交互式选择)', required: false}),
  }

  static description = '删除 ECS 实例'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> i-xxxxx']

  public async run(): Promise<void> {
    const {args} = await this.parse(EcsDel)
    let instanceId = args.instanceId

    // 如果没有提供实例 ID，则交互式选择
    if (!instanceId) {
      const ecsManager = new EcsManager()
      const res = await ecsManager.getInstances()

      if (!res || !res.body?.instances?.instance || res.body.instances.instance.length === 0) {
        this.log('当前区域没有可用的实例')
        return
      }

      const instances = res.body.instances.instance
      // 只选择后付费实例
      const postPaidInstances = instances.filter((inst) => inst.instanceChargeType === 'PostPaid')

      if (postPaidInstances.length === 0) {
        this.log('当前区域没有后付费实例')
        return
      }

      const choices = postPaidInstances.map((inst) => {
        const primaryIp =
          inst.networkInterfaces?.networkInterface && inst.networkInterfaces.networkInterface.length > 0
            ? inst.networkInterfaces.networkInterface[0].primaryIpAddress || ''
            : ''
        const publicIp =
          inst.publicIpAddress?.ipAddress && inst.publicIpAddress.ipAddress.length > 0
            ? inst.publicIpAddress.ipAddress[0]
            : '无'

        return {
          name: `${inst.instanceId} - 名称:${inst.instanceName} 状态:${inst.status} 公网IP:${publicIp} 私网IP:${primaryIp} 计费:${inst.instanceChargeType}`,
          value: inst.instanceId || '',
        }
      })

      instanceId = await inquirer.select({
        choices,
        message: '请选择要删除的后付费实例:',
      })
    }

    if (!instanceId) {
      this.log('未选择实例')
      return
    }

    // 二次确认
    const confirm = await inquirer.confirm({
      default: false,
      message: `确认要删除实例 ${instanceId} 吗？此操作不可恢复！`,
    })

    if (!confirm) {
      this.log('取消删除操作')
      return
    }

    const ecsManager = new EcsManager()
    await ecsManager.deleteInstance(instanceId)
  }
}
