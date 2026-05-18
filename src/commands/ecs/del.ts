import * as inquirer from '@inquirer/prompts'
import {Args, Command} from '@oclif/core'

import {EcsManager} from '../../lib/ecs/ecs.js'

export default class EcsDel extends Command {
  static args = {
    instanceId: Args.string({description: 'ECS 实例 ID (可选，不提供则交互式选择)', required: false}),
  }
  static description = '删除 ECS 实例'
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> i-xxxxx']

  public async run(): Promise<void> {
    const {args} = await this.parse(EcsDel)
    const ecsManager = new EcsManager()

    let {instanceId} = args
    if (!instanceId) {
      const res = await ecsManager.getInstances()
      const instances = (res?.body?.instances?.instance ?? []).filter((inst) => inst.instanceChargeType === 'PostPaid')
      if (instances.length === 0) {
        this.log('当前区域没有后付费实例')
        return
      }

      instanceId = await inquirer.select({
        choices: instances.map((inst) => {
          const primaryIp = inst.networkInterfaces?.networkInterface?.[0]?.primaryIpAddress || ''
          const publicIp = inst.publicIpAddress?.ipAddress?.[0] || '无'
          return {
            name: `${inst.instanceId} - 名称:${inst.instanceName} 状态:${inst.status} 公网IP:${publicIp} 私网IP:${primaryIp}`,
            value: inst.instanceId || '',
          }
        }),
        message: '请选择要删除的后付费实例:',
      })
    }

    if (!instanceId) return

    const confirm = await inquirer.confirm({
      default: false,
      message: `确认要删除实例 ${instanceId} 吗？此操作不可恢复！`,
    })
    if (!confirm) {
      this.log('取消删除操作')
      return
    }

    await ecsManager.deleteInstance(instanceId)
  }
}
