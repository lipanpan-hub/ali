/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command } from '@oclif/core'

import type { PromptChoice } from '../../lib/types.js'

import { selectPrompt } from '../../lib/prompts.js'
import { listVpcs } from '../../lib/vpc/vpc.js'
import { listVSwitches } from '../../lib/vsw/vsw.js'

export default class VswLs extends Command {
  static description = '列出VSwitch列表'
static examples = ['<%= config.bin %> <%= command.id %>']

  async run(): Promise<void> {
    const {} = await this.parse(VswLs)
    try {
      const vpcs = await listVpcs()
      if (vpcs.length === 0) {
        this.warn('当前区域没有VPC')
        return
      }

      const choices: PromptChoice[] = vpcs.map((v) => ({
        description: `${v.vpcName} (${v.cidrBlock})`,
        title: v.vpcId,
        value: v.vpcId,
      }))

      const vpcId = await selectPrompt('请选择VPC:', choices)
      if (!vpcId) {
        this.warn('操作取消')
        return
      }

      const vswitches = await listVSwitches(vpcId)
      if (vswitches.length === 0) {
        this.warn('当前VPC没有交换机')
        return
      }

      for (const vsw of vswitches) {
        this.log(`VSwitchId: ${vsw.vswitchId}, VSwitchName: ${vsw.vswitchName}, ZoneId: ${vsw.zoneId}, CidrBlock: ${vsw.cidrBlock}, VpcId: ${vsw.vpcId}`)
      }
    } catch (error: any) {
      this.error(error.message ?? '未知错误')
    }
  }
}
