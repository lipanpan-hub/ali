/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command, Flags } from '@oclif/core'

import type { PromptChoice } from '../../lib/types.js'

import { deleteInstance, listInstances } from '../../lib/ecs/ecs.js'
import { confirmPrompt, selectPrompt } from '../../lib/prompts.js'

export default class EcsDel extends Command {
  static description = '删除ECS实例'
static examples = ['<%= config.bin %> <%= command.id %> --force']
static flags = {
    force: Flags.boolean({ char: 'f', default: false, description: '强制删除，不进行确认' }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(EcsDel)

    try {
      const instances = await listInstances()
      const postPaid = instances.filter((i) => i.instanceChargeType === 'PostPaid')

      if (postPaid.length === 0) {
        this.warn('当前region下没有后付费实例')
        return
      }

      const choices: PromptChoice[] = postPaid.map((inst) => ({
        description: `名称:${inst.instanceName} 状态:${inst.status} 公网IP:${inst.publicIp} 私网IP:${inst.primaryPrivateIp}`,
        title: inst.instanceId,
        value: inst.instanceId,
      }))

      const selected = await selectPrompt('请选择要删除的后付费实例:', choices)
      if (!selected) {
        this.warn('操作取消')
        return
      }

      if (!flags.force) {
        const confirmed = await confirmPrompt(`确认要删除实例 ${selected} 吗？此操作不可恢复！`, false)
        if (!confirmed) {
          this.warn('取消删除操作')
          return
        }
      }

      await deleteInstance(selected)
      this.log(`实例 ${selected} 删除操作已执行`)
    } catch (error: any) {
      this.error(error.message ?? '未知错误')
    }
  }
}
