/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command, Flags } from '@oclif/core'

import { textPrompt } from '../../lib/prompts.js'
import { createVpc } from '../../lib/vpc/vpc.js'

export default class VpcAdd extends Command {
  static description = '创建新的VPC'
static examples = [
    '<%= config.bin %> <%= command.id %> --cidr 192.168.0.0/16',
    '<%= config.bin %> <%= command.id %> --cidr 10.0.0.0/8 --name my-vpc',
  ]
static flags = {
    cidr: Flags.string({ char: 'c', description: 'VPC的CIDR块' }),
    name: Flags.string({ char: 'n', description: 'VPC名称' }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(VpcAdd)

    try {
      const cidr = flags.cidr ?? (await textPrompt('请输入VPC的CIDR块 (例如: 192.168.0.0/16):'))
      if (!cidr) {
        this.warn('未输入CIDR块，操作取消')
        return
      }

      const name = flags.name ?? (await textPrompt('请输入VPC名称 (可选，留空跳过):'))

      const vpcId = await createVpc(cidr, name || undefined)
      this.log(`VPC 创建成功: ${vpcId}`)
    } catch (error: any) {
      this.error(error.message ?? '未知错误')
    }
  }
}
