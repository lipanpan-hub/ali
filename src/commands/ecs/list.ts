import {Command, Flags} from '@oclif/core'

import {EcsManager} from '../../lib/ecs/ecs.js'

export default class EcsLs extends Command {
  static aliases = ['ecs:ls']
static description = '列出当前区域的所有 ECS 实例'
static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --block']
static flags = {
    block: Flags.boolean({char: 'b', default: false, description: '使用块状显示模式'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(EcsLs)
    await new EcsManager().listInstances(flags.block)
  }
}
