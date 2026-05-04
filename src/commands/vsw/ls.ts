import {Args, Command} from '@oclif/core'
import * as inquirer from '@inquirer/prompts'

import {VpcManager} from '../../lib/vpc/vpc.js'
import {VSwitchManager} from '../../lib/vsw/vsw.js'

export default class VswLs extends Command {
  static args = {
    vpcId: Args.string({description: 'VPC ID (可选，不提供则交互式选择)', required: false}),
  }

  static description = '列出当前 VPC 下的所有交换机'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> vpc-xxxxx']

  public async run(): Promise<void> {
    const {args} = await this.parse(VswLs)
    let vpcId = args.vpcId

    // 如果没有提供 VPC ID，则交互式选择
    if (!vpcId) {
      const vpcManager = new VpcManager()
      const res = await vpcManager.getVpcs()

      if (!res || !res.body?.vpcs?.vpc || res.body.vpcs.vpc.length === 0) {
        this.log('当前区域没有可用的 VPC，请先创建 VPC')
        return
      }

      const vpcs = res.body.vpcs.vpc
      const choices = vpcs.map((vpc) => ({
        name: `${vpc.vpcId} - ${vpc.vpcName} (${vpc.cidrBlock}) ${vpc.regionId} ${vpc.status}`,
        value: vpc.vpcId || '',
      }))

      vpcId = await inquirer.select({
        choices,
        message: '请选择 VPC:',
      })
    }

    if (!vpcId) {
      this.log('未选择 VPC')
      return
    }

    const vswManager = new VSwitchManager()
    await vswManager.listVSwitches(vpcId)
  }
}
