import * as inquirer from '@inquirer/prompts'
import {Args, Command} from '@oclif/core'

import {VpcManager} from '../../lib/vpc/vpc.js'
import {VSwitchManager} from '../../lib/vsw/vsw.js'

export default class VswLs extends Command {
  static aliases = ['vsw:ls']
static args = {
    vpcId: Args.string({description: 'VPC ID (可选，不提供则交互式选择)', required: false}),
  }
static description = '列出指定 VPC 下的所有交换机'
static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> vpc-xxxxx']

  public async run(): Promise<void> {
    const {args} = await this.parse(VswLs)
    let {vpcId} = args

    if (!vpcId) {
      const res = await new VpcManager().getVpcs()
      const vpcs = res?.body?.vpcs?.vpc ?? []
      if (vpcs.length === 0) {
        this.log('当前区域没有可用的 VPC，请先创建 VPC')
        return
      }

      vpcId = await inquirer.select({
        choices: vpcs.map((vpc) => ({
          name: `${vpc.vpcId} - ${vpc.vpcName} (${vpc.cidrBlock}) ${vpc.regionId} ${vpc.status}`,
          value: vpc.vpcId || '',
        })),
        message: '请选择 VPC:',
      })
    }

    if (!vpcId) return

    await new VSwitchManager().listVSwitches(vpcId)
  }
}
