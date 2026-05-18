import * as inquirer from '@inquirer/prompts'
import {Args, Command} from '@oclif/core'

import {VpcManager} from '../../lib/vpc/vpc.js'

export default class VpcDel extends Command {
  static args = {
    vpcId: Args.string({description: 'VPC ID (可选，不提供则交互式选择)', required: false}),
  }
static description = '删除 VPC'
static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> vpc-xxxxx']

  public async run(): Promise<void> {
    const {args} = await this.parse(VpcDel)
    const vpcManager = new VpcManager()

    let {vpcId} = args
    if (!vpcId) {
      const res = await vpcManager.getVpcs()
      const vpcs = res?.body?.vpcs?.vpc ?? []
      if (vpcs.length === 0) {
        this.log('当前区域没有可用的 VPC')
        return
      }

      vpcId = await inquirer.select({
        choices: vpcs.map((vpc) => ({
          name: `${vpc.vpcId} - ${vpc.vpcName} (${vpc.cidrBlock}) ${vpc.regionId} ${vpc.status}`,
          value: vpc.vpcId || '',
        })),
        message: '请选择要删除的 VPC:',
      })
    }

    if (!vpcId) return

    const confirm = await inquirer.confirm({
      default: false,
      message: `确认删除 VPC ${vpcId}？此操作不可恢复。`,
    })
    if (!confirm) {
      this.log('已取消删除操作')
      return
    }

    await vpcManager.deleteVpc(vpcId)
  }
}
