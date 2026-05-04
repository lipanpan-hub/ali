/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command } from '@oclif/core'

import type { PromptChoice } from '../../lib/types.js'

import { listZones } from '../../lib/ecs/ecs.js'
import { selectPrompt, textPrompt } from '../../lib/prompts.js'
import { validateCidrBlock } from '../../lib/validators.js'
import { listVpcs } from '../../lib/vpc/vpc.js'
import { createVSwitch } from '../../lib/vsw/vsw.js'

export default class VswAdd extends Command {
  static description = '创建VSwitch'
static examples = ['<%= config.bin %> <%= command.id %>']

  async run(): Promise<void> {
    try {
      const vpcs = await listVpcs()
      if (vpcs.length === 0) {
        this.warn('当前区域没有VPC，请先创建VPC')
        return
      }

      const vpcChoices: PromptChoice[] = vpcs.map((v) => ({
        description: `${v.vpcName} (${v.cidrBlock})`,
        title: v.vpcId,
        value: v.vpcId,
      }))

      const vpcId = await selectPrompt('请选择VPC:', vpcChoices)
      if (!vpcId) return

      const zones = await listZones()
      const zoneChoices: PromptChoice[] = Object.entries(zones)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, desc]) => ({ description: desc, title: id, value: id }))

      const zoneId = await selectPrompt('请选择可用区:', zoneChoices)
      if (!zoneId) return

      const cidrBlock = await textPrompt(
        '请输入交换机的 CIDR 块 (例如: 10.10.1.0/24):',
        (v) => validateCidrBlock(v) || 'CIDR 块格式不正确',
      )
      if (!cidrBlock) return

      const vswitchName = await textPrompt(
        '请输入交换机名称:',
        (v) => v.length > 0 || '交换机名称不能为空',
      )
      if (!vswitchName) return

      const vswitchId = await createVSwitch(vpcId, zoneId, cidrBlock, vswitchName)
      this.log(`交换机创建成功: ${vswitchId}`)
    } catch (error: any) {
      this.error(error.message ?? '未知错误')
    }
  }
}
