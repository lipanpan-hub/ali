import {Flags} from '@oclif/core'

import {BaseCommand} from '../../lib/base-command.js'
import {BktManager} from '../../lib/bkt/bkt.js'

export default class BktLs extends BaseCommand {
  static aliases = ['bkt:ls']
  static description = '列出当前账号的所有 OSS 存储空间'
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> -d']
  static flags = {
    detail: Flags.boolean({char: 'd', default: false, description: '交互式选择存储桶并显示详细信息'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(BktLs)
    const mgr = new BktManager()
    if (flags.detail) {
      await mgr.selectBucketDetail()
    } else {
      await mgr.listBuckets()
    }
  }
}
