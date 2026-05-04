/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command, Flags } from '@oclif/core'

import type { PromptChoice } from '../../lib/types.js'

import { confirmPrompt, selectPrompt } from '../../lib/prompts.js'
import { deleteVpc, listVpcs } from '../../lib/vpc/vpc.js'

export default class VpcDel extends Command {
  static description = '删除指定的VPC'
static examples = ['<%= config.bin %> <%= command.id %> --force']
static flags = {
    force: Flags.boolean({ char: 'f', default: false, description: '强制删除，不进行确认' }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(VpcDel)

    try {
      const vpcs = await listVpcs()
      if (vpcs.length === 0) {
        this.warn('当前区域没有VPC')
        return
      }

      const choices: PromptChoice[] = vpcs.map((v) => ({
        description: `${v.vpcName} (${v.cidrBlock}) ${v.status}`,
        title: v.vpcId,
        value: v.vpcId,
      }))

      const selected = await selectPrompt('请选择要删除的VPC:', choices)
      if (!selected) {
        this.warn('操作取消')
        return
      }

      if (!flags.force) {
        const confirmed = await confirmPrompt(`确认删除VPC ${selected}？此操作不可恢复！`, false)
        if (!confirmed) {
          this.warn('操作取消')
          return
        }
      }

      await deleteVpc(selected)
      this.log(`VPC ${selected} 删除成功`)
    } catch (error: any) {
      this.error(error.message ?? '未知错误')
    }
  }
}
