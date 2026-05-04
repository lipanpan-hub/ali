import {Args, Command} from '@oclif/core'
import * as inquirer from '@inquirer/prompts'

import {SecurityGroupManager} from '../../lib/sgp/sgp.js'

export default class SgpDel extends Command {
  static args = {
    securityGroupId: Args.string({description: '安全组 ID (可选，不提供则交互式选择)', required: false}),
  }

  static description = '删除安全组'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> sg-xxxxx']

  public async run(): Promise<void> {
    const {args} = await this.parse(SgpDel)
    let securityGroupId = args.securityGroupId

    // 如果没有提供安全组 ID，则交互式选择
    if (!securityGroupId) {
      const sgpManager = new SecurityGroupManager()
      const res = await sgpManager.getSecurityGroups()

      if (!res || !res.body?.securityGroups?.securityGroup || res.body.securityGroups.securityGroup.length === 0) {
        this.log('当前区域没有安全组')
        return
      }

      const securityGroups = res.body.securityGroups.securityGroup
      const choices = securityGroups.map((sg) => ({
        name: `${sg.securityGroupId} - ${sg.securityGroupName} (规则数: ${sg.ruleCount}) VPC: ${sg.vpcId}`,
        value: sg.securityGroupId || '',
      }))

      securityGroupId = await inquirer.select({
        choices,
        message: '请选择要删除的安全组:',
      })
    }

    if (!securityGroupId) {
      this.log('未选择安全组')
      return
    }

    // 确认删除
    const confirm = await inquirer.confirm({
      default: false,
      message: `确认删除安全组 ${securityGroupId}？此操作不可恢复。`,
    })

    if (!confirm) {
      this.log('已取消删除操作')
      return
    }

    const sgpManager = new SecurityGroupManager()
    await sgpManager.deleteSecurityGroup(securityGroupId)
  }
}
