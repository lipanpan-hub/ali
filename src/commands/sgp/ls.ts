/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command, Flags } from '@oclif/core'

import { listSecurityGroups } from '../../lib/sgp/sgp.js'

export default class SgpLs extends Command {
  static description = '列出安全组列表'
static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --block',
  ]
static flags = {
    block: Flags.boolean({ char: 'b', default: false, description: '多行显示模式' }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(SgpLs)

    try {
      const groups = await listSecurityGroups()
      if (groups.length === 0) {
        this.warn('当前区域没有安全组')
        return
      }

      this.log(`共 ${groups.length} 个安全组\n`)

      for (const sg of groups) {
        const createTime = sg.creationTime.replace('T', ' ').replace('Z', '')
        if (flags.block) {
          this.log(`安全组ID: ${sg.securityGroupId}`)
          this.log(`名称:     ${sg.securityGroupName}`)
          this.log(`规则数:   ${sg.ruleCount}`)
          this.log(`创建时间: ${createTime}`)
          this.log(`VPC ID:   ${sg.vpcId}`)
          this.log('-'.repeat(50))
        } else {
          this.log(`${sg.securityGroupId} | ${sg.securityGroupName} | 规则:${sg.ruleCount} | ${createTime} | ${sg.vpcId}`)
        }
      }
    } catch (error: any) {
      this.error(error.message ?? '未知错误')
    }
  }
}
