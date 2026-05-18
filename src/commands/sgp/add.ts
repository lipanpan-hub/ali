import * as inquirer from '@inquirer/prompts'
import {Args, Command} from '@oclif/core'

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

    if (!vpcId) {
      const res = await new VpcManager().getVpcs()
      const vpcs = res?.body?.vpcs?.vpc ?? []
      if (vpcs.length === 0) {
        this.log('当前区域没有可用的 VPC，请先创建 VPC')
        return
      }

      vpcId = await inquirer.select({
        choices: vpcs.map((vpc) => ({
          name: `${vpc.vpcId} - ${vpc.vpcName} (${vpc.cidrBlock})`,
          value: vpc.vpcId || '',
        })),
        message: '请选择 VPC:',
      })
    }

    if (!securityGroupName) {
      securityGroupName = await inquirer.input({
        message: '请输入安全组名称:',
        validate: (value) => value.length > 0 || '安全组名称不能为空',
      })
    }

    if (!vpcId || !securityGroupName) return

    const description = await inquirer.input({message: '请输入安全组描述 (可选):'})
    await new SecurityGroupManager().createSecurityGroup(vpcId, securityGroupName, description || undefined)
  }
}
