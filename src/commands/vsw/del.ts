import * as inquirer from '@inquirer/prompts'
import {Args, Command} from '@oclif/core'

import {VpcManager} from '../../lib/vpc/vpc.js'
import {VSwitchManager} from '../../lib/vsw/vsw.js'

export default class VswDel extends Command {
  static args = {
    vSwitchId: Args.string({description: '交换机 ID (可选，不提供则交互式选择)', required: false}),
  }
static description = '删除交换机'
static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> vsw-xxxxx']

  public async run(): Promise<void> {
    const {args} = await this.parse(VswDel)
    const vswManager = new VSwitchManager()

    let {vSwitchId} = args
    if (!vSwitchId) {
      const vpcRes = await new VpcManager().getVpcs()
      const vpcs = vpcRes?.body?.vpcs?.vpc ?? []
      if (vpcs.length === 0) {
        this.log('当前区域没有可用的 VPC')
        return
      }

      const selectedVpcId = await inquirer.select({
        choices: vpcs.map((vpc) => ({
          name: `${vpc.vpcId} - ${vpc.vpcName} (${vpc.cidrBlock})`,
          value: vpc.vpcId || '',
        })),
        message: '请选择 VPC:',
      })

      if (!selectedVpcId) return

      const vswRes = await vswManager.getVSwitches(selectedVpcId)
      const vSwitches = [...(vswRes?.body?.vSwitches?.vSwitch ?? [])].sort((a, b) =>
        (a.zoneId || '').localeCompare(b.zoneId || ''),
      )
      if (vSwitches.length === 0) {
        this.log('当前 VPC 没有交换机')
        return
      }

      vSwitchId = await inquirer.select({
        choices: vSwitches.map((vsw) => ({
          name: `${vsw.vSwitchId} - 名字:${vsw.vSwitchName} 区域:${vsw.zoneId} VPC:${vsw.vpcId} CIDR块:${vsw.cidrBlock}`,
          value: vsw.vSwitchId || '',
        })),
        message: '请选择要删除的交换机:',
      })
    }

    if (!vSwitchId) return

    const confirm = await inquirer.confirm({
      default: false,
      message: `确认删除交换机 ${vSwitchId}？此操作不可恢复。`,
    })
    if (!confirm) {
      this.log('已取消删除操作')
      return
    }

    await vswManager.deleteVSwitch(vSwitchId)
  }
}
