import {Args, Command} from '@oclif/core'
import * as inquirer from '@inquirer/prompts'

import {SecurityGroupManager} from '../../lib/sgp/sgp.js'
import {VpcManager} from '../../lib/vpc/vpc.js'

export default class SgpAdd extends Command {
  static args = {
    securityGroupName: Args.string({description: '安全组名称', required: false}),
    vpcId: Args.string({description: 'VPC ID', required: false}),
  }

  static description = '创建安全组'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> vpc-xxxxx my-sg']

  public async run(): Promise<void> {
    const {args} = await this.parse(SgpAdd)

    let {securityGroupName, vpcId} = args

    // 选择 VPC
    if (!vpcId) {
      const vpcManager = new VpcManager()
      const res = await vpcManager.getVpcs()

      if (!res || !res.body?.vpcs?.vpc || res.body.vpcs.vpc.length === 0) {
        this.log('当前区域没有可用的 VPC，请先创建 VPC')
        return
      }

      const vpcs = res.body.vpcs.vpc
      const choices = vpcs.map((vpc) => ({
        name: `${vpc.vpcId} - ${vpc.vpcName} (${vpc.cidrBlock})`,
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

    // 输入安全组名称
    if (!securityGroupName) {
      securityGroupName = await inquirer.input({
        message: '请输入安全组名称:',
        validate: (value) => {
          if (value.length === 0) {
            return '安全组名称不能为空'
          }

          return true
        },
      })
    }

    if (!securityGroupName) {
      this.log('未输入安全组名称')
      return
    }

    // 输入描述（可选）
    const description = await inquirer.input({
      message: '请输入安全组描述 (可选):',
    })

    const sgpManager = new SecurityGroupManager()
    await sgpManager.createSecurityGroup(vpcId, securityGroupName, description || undefined)
  }
}
