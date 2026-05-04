import {Args, Command} from '@oclif/core'
import * as inquirer from '@inquirer/prompts'

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
    let vSwitchId = args.vSwitchId

    // 如果没有提供交换机 ID，则交互式选择
    if (!vSwitchId) {
      // 先选择 VPC
      const vpcManager = new VpcManager()
      const vpcRes = await vpcManager.getVpcs()

      if (!vpcRes || !vpcRes.body?.vpcs?.vpc || vpcRes.body.vpcs.vpc.length === 0) {
        this.log('当前区域没有可用的 VPC')
        return
      }

      const vpcs = vpcRes.body.vpcs.vpc
      const vpcChoices = vpcs.map((vpc) => ({
        name: `${vpc.vpcId} - ${vpc.vpcName} (${vpc.cidrBlock})`,
        value: vpc.vpcId || '',
      }))

      const selectedVpcId = await inquirer.select({
        choices: vpcChoices,
        message: '请选择 VPC:',
      })

      if (!selectedVpcId) {
        this.log('未选择 VPC')
        return
      }

      // 获取该 VPC 下的所有交换机
      const vswManager = new VSwitchManager()
      const vswRes = await vswManager.getVSwitches(selectedVpcId)

      if (!vswRes || !vswRes.body?.vSwitches?.vSwitch || vswRes.body.vSwitches.vSwitch.length === 0) {
        this.log('当前 VPC 没有交换机')
        return
      }

      const vSwitches = vswRes.body.vSwitches.vSwitch
      // 按可用区ID排序
      vSwitches.sort((a: any, b: any) => (a.zoneId || '').localeCompare(b.zoneId || ''))

      const vswChoices = vSwitches.map((vsw: any) => ({
        name: `${vsw.vSwitchId} - 名字:${vsw.vSwitchName} 区域:${vsw.zoneId} VPC:${vsw.vpcId} CIDR块:${vsw.cidrBlock}`,
        value: vsw.vSwitchId || '',
      }))

      vSwitchId = await inquirer.select({
        choices: vswChoices,
        message: '请选择要删除的交换机:',
      })
    }

    if (!vSwitchId) {
      this.log('未选择交换机')
      return
    }

    // 确认删除
    const confirm = await inquirer.confirm({
      default: false,
      message: `确认删除交换机 ${vSwitchId}？此操作不可恢复。`,
    })

    if (!confirm) {
      this.log('已取消删除操作')
      return
    }

    const vswManager = new VSwitchManager()
    await vswManager.deleteVSwitch(vSwitchId)
  }
}
