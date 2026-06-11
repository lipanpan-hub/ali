import {Args, Command} from '@oclif/core'

import {TingwuManager} from '../../../lib/twu/twu.js'

export default class TwuTaskQuery extends Command {
  static args = {
    taskId: Args.string({description: '听悟任务 ID', required: true}),
  }
  static aliases = ['twu:tq']
  static description = '根据任务 ID 查询通义听悟转写任务信息'
  static examples = ['<%= config.bin %> <%= command.id %> c5394c6ee0fb474899d42215a3925c7e']

  public async run(): Promise<void> {
    const {args} = await this.parse(TwuTaskQuery)
    await new TingwuManager().queryTask(args.taskId)
  }
}
