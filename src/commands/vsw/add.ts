import * as inquirer from '@inquirer/prompts'
import {Args, Command} from '@oclif/core'

import {EcsManager} from '../../lib/ecs/ecs.js'
import {validateCidrBlock} from '../../lib/validator/validators.js'
import {VpcManager} from '../../lib/vpc/vpc.js'
import {VSwitchManager} from '../../lib/vsw/vsw.js'

export default class VswAdd extends Command {
  static args = {
    cidrBlock: Args.string({description: 'CIDR 块 (例如: 10.10.1.0/24)', required: false}),
    vpcId: Args.string({description: 'VPC ID', required: false}),
    vSwitchName: Args.string({description: '交换机名称', required: false}),
    zoneId: Args.string({description: '可用区 ID', required: false}),
  }
static description = '创建交换机'
static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> vpc-xxxxx cn-shenzhen-a 10.10.1.0/24 my-vswitch',
  ]

  public async run(): Promise<void> {
    const {args} = await this.parse(VswAdd)
    let {cidrBlock, vpcId, vSwitchName, zoneId} = args

    // #region 选择 VPC
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
    // #endregion

    // #region 选择可用区
    if (!zoneId) {
      const zonesDict = await new EcsManager().getZones()
      if (Object.keys(zonesDict).length === 0) {
        this.log('当前区域没有可用区')
        return
      }

      zoneId = await inquirer.select({
        choices: Object.entries(zonesDict)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([zId, zInfo]) => ({name: zInfo, value: zId})),
        message: '请选择可用区:',
      })
    }

    if (!zoneId) return
    // #endregion

    // #region 输入 CIDR
    if (!cidrBlock) {
      cidrBlock = await inquirer.input({
        message: '请输入交换机的 CIDR 块 (例如: 10.10.1.0/24):',
        validate: (value) => validateCidrBlock(value) || 'CIDR 块格式不正确，请输入正确的格式 (例如: 10.10.1.0/24)',
      })
    }

    if (!cidrBlock) return
    // #endregion

    // #region 输入名称
    if (!vSwitchName) {
      vSwitchName = await inquirer.input({
        message: '请输入交换机名称:',
        validate: (value) => value.length > 0 || '交换机名称不能为空',
      })
    }

    if (!vSwitchName) return
    // #endregion

    await new VSwitchManager().createVSwitch(vpcId, zoneId, cidrBlock, vSwitchName)
  }
}
