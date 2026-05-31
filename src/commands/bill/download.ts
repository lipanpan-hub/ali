import {Args, Command, Flags} from '@oclif/core'

import {BillManager} from '../../lib/bill/bill.js'
import {defaultBillingCycle, isValidBillingCycle} from '../../lib/bill/cycle.js'

export default class BillDownload extends Command {
  static aliases = ['bill:dl']
  static args = {
    cycle: Args.string({description: '账期 YYYY-MM (默认上个月)', required: false}),
  }
  static description = '下载指定账期的实例明细账单到当前目录'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> 2025-04',
    '<%= config.bin %> <%= command.id %> 2025-04 -f json',
  ]
  static flags = {
    format: Flags.string({char: 'f', default: 'csv', description: '导出格式', options: ['csv', 'json']}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(BillDownload)
    const cycle = args.cycle ?? defaultBillingCycle()
    if (!isValidBillingCycle(cycle)) {
      this.log('账期格式错误, 请使用 YYYY-MM 格式')
      return
    }

    await new BillManager().download(cycle, flags.format as 'csv' | 'json')
  }
}
