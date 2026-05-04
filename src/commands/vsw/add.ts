import {Args, Command, Flags} from '@oclif/core'
import * as inquirer from '@inquirer/prompts'

import {EcsManager} from '../../lib/ecs/ecs.js'
import {validateCidrBlock} from '../../lib/validator/validators.js'
import {VpcManager} from '../../lib/vpc/vpc.js'
import {VSwitchManager} from '../../lib/vsw/vsw.js'

export default class VswAdd extends Command {
  static args = {
    cidrBlock: Args.string({description: 'CIDR 块 (例如: 10.10.1.0/24)', required: false}),
    vSwitchName: Args.string({description: '交换机名称', required: false}),
    vpcId: Args.string({description: 'VPC ID', required: false}),
    zoneId: Args.string({description: '可用区 ID', required: false}),
  }

  static description = '创建交换机'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> vpc-xxxxx cn-shenzhen-a 10.10.1.0/24 my-vswitch',
  ]

  static flags = {
    interactive: Flags.boolean({char: 'i', default: true, description: '交互式模式'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(VswAdd)

    let {cidrBlock, vSwitchName, vpcId, zoneId} = args

    // #region 选择 VPC
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

    // #endregion

    // #region 选择可用区
    if (!zoneId) {
      const ecsManager = new EcsManager()
      const zonesDict = await ecsManager.getZones()

      if (!zonesDict || Object.keys(zonesDict).length === 0) {
        this.log('当前区域没有可用区')
        return
      }

      const choices = Object.entries(zonesDict)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([zId, zInfo]) => ({
          name: zInfo,
          value: zId,
        }))

      zoneId = await inquirer.select({
        choices,
        message: '请选择可用区:',
      })
    }

    if (!zoneId) {
      this.log('未选择可用区')
      return
    }

    // #endregion

    // #region 输入 CIDR 块
    if (!cidrBlock) {
      cidrBlock = await inquirer.input({
        message: '请输入交换机的 CIDR 块 (例如: 10.10.1.0/24):',
        validate: (value) => {
          if (!validateCidrBlock(value)) {
            return 'CIDR 块格式不正确，请输入正确的格式 (例如: 10.10.1.0/24)'
          }

          return true
        },
      })
    }

    if (!cidrBlock) {
      this.log('未输入 CIDR 块')
      return
    }

    // #endregion

    // #region 输入交换机名称
    if (!vSwitchName) {
      vSwitchName = await inquirer.input({
        message: '请输入交换机名称:',
        validate: (value) => {
          if (value.length === 0) {
            return '交换机名称不能为空'
          }

          return true
        },
      })
    }

    if (!vSwitchName) {
      this.log('未输入交换机名称')
      return
    }

    // #endregion

    // #region 创建交换机
    const vswManager = new VSwitchManager()
    await vswManager.createVSwitch(vpcId, zoneId, cidrBlock, vSwitchName)
    // #endregion
  }
}
