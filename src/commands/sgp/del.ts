import * as inquirer from '@inquirer/prompts'
import {Args, Command} from '@oclif/core'

import {SecurityGroupManager} from '../../lib/sgp/sgp.js'

export default class SgpDel extends Command {
  static args = {
    securityGroupId: Args.string({description: '安全组 ID (可选，不提供则交互式选择)', required: false}),
  }
static description = '删除安全组'
static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> sg-xxxxx']

  public async run(): Promise<void> {
    const {args} = await this.parse(SgpDel)
    const sgpManager = new SecurityGroupManager()

    let {securityGroupId} = args
    if (!securityGroupId) {
      const res = await sgpManager.getSecurityGroups()
      const sgs = res?.body?.securityGroups?.securityGroup ?? []
      if (sgs.length === 0) {
        this.log('当前区域没有安全组')
        return
      }

      securityGroupId = await inquirer.select({
        choices: sgs.map((sg) => ({
          name: `${sg.securityGroupId} - ${sg.securityGroupName} (规则数: ${sg.ruleCount}) VPC: ${sg.vpcId}`,
          value: sg.securityGroupId || '',
        })),
        message: '请选择要删除的安全组:',
      })
    }

    if (!securityGroupId) return

    const confirm = await inquirer.confirm({
      default: false,
      message: `确认删除安全组 ${securityGroupId}？此操作不可恢复。`,
    })
    if (!confirm) {
      this.log('已取消删除操作')
      return
    }

    await sgpManager.deleteSecurityGroup(securityGroupId)
  }
}
