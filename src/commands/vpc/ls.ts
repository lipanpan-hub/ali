/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command, Flags } from '@oclif/core'

import { listVpcs } from '../../lib/vpc/vpc.js'

export default class VpcLs extends Command {
  static description = '列出VPC列表'
static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --limit 20',
  ]
static flags = {
    limit: Flags.integer({ char: 'l', default: 10, description: '返回结果数量限制' }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(VpcLs)

    try {
      const vpcs = await listVpcs()
      const limited = vpcs.slice(0, flags.limit)

      for (const vpc of limited) {
        this.log(`VPC ID: ${vpc.vpcId}`)
        this.log(`VPC 名称: ${vpc.vpcName}`)
        this.log(`CIDR 块: ${vpc.cidrBlock}`)
        this.log(`区域 ID: ${vpc.regionId}`)
        this.log(`状态: ${vpc.status}`)
        this.log(`交换机 IDs: ${vpc.vSwitchIds.length > 0 ? vpc.vSwitchIds.join(', ') : '无'}`)
        this.log('-'.repeat(50))
      }
    } catch (error: any) {
      this.error(error.message ?? '未知错误')
    }
  }
}
