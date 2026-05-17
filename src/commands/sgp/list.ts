import {Command, Flags} from '@oclif/core'

import {SecurityGroupManager} from '../../lib/sgp/sgp.js'

export default class SgpLs extends Command {
  static aliases = ['sgp:ls']

  static description = '列出当前区域的所有安全组'

  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --block']

  static flags = {
    block: Flags.boolean({char: 'b', default: false, description: '使用块状显示模式'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(SgpLs)
    const sgpManager = new SecurityGroupManager()
    await sgpManager.listSecurityGroups(flags.block)
  }
}
