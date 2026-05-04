import {Args, Command} from '@oclif/core'
import * as inquirer from '@inquirer/prompts'

import {VpcManager} from '../../lib/vpc/vpc.js'

export default class VpcDel extends Command {
  static args = {
    vpcId: Args.string({description: 'VPC ID (可选，不提供则交互式选择)', required: false}),
  }

  static description = '删除 VPC'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> vpc-xxxxx']

  public async run(): Promise<void> {
    const {args} = await this.parse(VpcDel)
    let vpcId = args.vpcId

    // 如果没有提供 VPC ID，则交互式选择
    if (!vpcId) {
      const vpcManager = new VpcManager()
      const res = await vpcManager.getVpcs()

      if (!res || !res.body?.vpcs?.vpc || res.body.vpcs.vpc.length === 0) {
        this.log('当前区域没有可用的 VPC')
        return
      }

      const vpcs = res.body.vpcs.vpc
      const choices = vpcs.map((vpc) => ({
        name: `${vpc.vpcId} - ${vpc.vpcName} (${vpc.cidrBlock}) ${vpc.regionId} ${vpc.status}`,
        value: vpc.vpcId || '',
      }))

      vpcId = await inquirer.select({
        choices,
        message: '请选择要删除的 VPC:',
      })
    }

    if (!vpcId) {
      this.log('未选择 VPC')
      return
    }

    // 确认删除
    const confirm = await inquirer.confirm({
      default: false,
      message: `确认删除 VPC ${vpcId}？此操作不可恢复。`,
    })

    if (!confirm) {
      this.log('已取消删除操作')
      return
    }

    const vpcManager = new VpcManager()
    await vpcManager.deleteVpc(vpcId)
  }
}
