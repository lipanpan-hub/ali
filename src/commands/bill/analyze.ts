import {Args, Command} from '@oclif/core'

import {BillManager} from '../../lib/bill/bill.js'
import {defaultBillingCycle, isValidBillingCycle} from '../../lib/bill/cycle.js'

export default class BillAnalyze extends Command {
  static aliases = ['bill:az']
  static args = {
    cycle: Args.string({description: '账期 YYYY-MM (默认上个月)', required: false}),
  }
  static description = '分析指定账期的费用构成 (按产品占比与排名)'
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> 2025-04']

  public async run(): Promise<void> {
    const {args} = await this.parse(BillAnalyze)
    const cycle = args.cycle ?? defaultBillingCycle()
    if (!isValidBillingCycle(cycle)) {
      this.log('账期格式错误, 请使用 YYYY-MM 格式')
      return
    }

    await new BillManager().analyze(cycle)
  }
}
