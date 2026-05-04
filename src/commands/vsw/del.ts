/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command } from '@oclif/core'

import type { PromptChoice } from '../../lib/types.js'

import { confirmPrompt, selectPrompt } from '../../lib/prompts.js'
import { listVpcs } from '../../lib/vpc/vpc.js'
import { deleteVSwitch, listVSwitches } from '../../lib/vsw/vsw.js'

export default class VswDel extends Command {
  static description = '删除VSwitch'
static examples = ['<%= config.bin %> <%= command.id %>']

  async run(): Promise<void> {
    try {
      const vpcs = await listVpcs()
      if (vpcs.length === 0) {
        this.warn('当前区域没有VPC')
        return
      }

      const vpcChoices: PromptChoice[] = vpcs.map((v) => ({
        description: `${v.vpcName} (${v.cidrBlock})`,
        title: v.vpcId,
        value: v.vpcId,
      }))

      const vpcId = await selectPrompt('请选择VPC:', vpcChoices)
      if (!vpcId) return

      const vswitches = await listVSwitches(vpcId)
      if (vswitches.length === 0) {
        this.warn('当前VPC没有交换机')
        return
      }

      const vswChoices: PromptChoice[] = vswitches.map((v) => ({
        description: `名称:${v.vswitchName} 区域:${v.zoneId} CIDR:${v.cidrBlock}`,
        title: v.vswitchId,
        value: v.vswitchId,
      }))

      const selected = await selectPrompt('请选择要删除的交换机:', vswChoices)
      if (!selected) return

      const confirmed = await confirmPrompt(`确认删除交换机 ${selected}？此操作不可恢复。`, false)
      if (!confirmed) {
        this.warn('已取消删除操作')
        return
      }

      await deleteVSwitch(selected)
      this.log(`交换机 ${selected} 删除成功`)
    } catch (error: any) {
      this.error(error.message ?? '未知错误')
    }
  }
}
