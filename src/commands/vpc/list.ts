import {Command} from '@oclif/core'

import {VpcManager} from '../../lib/vpc/vpc.js'

export default class VpcLs extends Command {
  static aliases = ['vpc:ls']

  static description = '列出当前区域的所有 VPC'

  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const vpcManager = new VpcManager()
    await vpcManager.listVpcs()
  }
}
