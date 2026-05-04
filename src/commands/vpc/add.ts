import {Args, Command} from '@oclif/core'
import * as inquirer from '@inquirer/prompts'

import {validateCidrBlock} from '../../lib/validator/validators.js'
import {VpcManager} from '../../lib/vpc/vpc.js'

export default class VpcAdd extends Command {
  static args = {
    cidrBlock: Args.string({description: 'CIDR 块 (例如: 10.0.0.0/8)', required: false}),
    vpcName: Args.string({description: 'VPC 名称', required: false}),
  }

  static description = '创建 VPC'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> 10.0.0.0/8 my-vpc']

  public async run(): Promise<void> {
    const {args} = await this.parse(VpcAdd)

    let {cidrBlock, vpcName} = args

    // 输入 CIDR 块
    if (!cidrBlock) {
      cidrBlock = await inquirer.input({
        message: '请输入 VPC 的 CIDR 块 (例如: 10.0.0.0/8):',
        validate: (value) => {
          if (!validateCidrBlock(value)) {
            return 'CIDR 块格式不正确，请输入正确的格式 (例如: 10.0.0.0/8)'
          }

          return true
        },
      })
    }

    if (!cidrBlock) {
      this.log('未输入 CIDR 块')
      return
    }

    // 输入 VPC 名称
    if (!vpcName) {
      vpcName = await inquirer.input({
        message: '请输入 VPC 名称:',
        validate: (value) => {
          if (value.length === 0) {
            return 'VPC 名称不能为空'
          }

          return true
        },
      })
    }

    if (!vpcName) {
      this.log('未输入 VPC 名称')
      return
    }

    const vpcManager = new VpcManager()
    await vpcManager.createVpc(cidrBlock, vpcName)
  }
}
