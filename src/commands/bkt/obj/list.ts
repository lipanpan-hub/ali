import {Args} from '@oclif/core'

import {BaseCommand} from '../../../lib/base-command.js'
import {BktManager} from '../../../lib/bkt/bkt.js'

export default class BktObjList extends BaseCommand {
  static aliases = ['bkt:obj:ls']
  static args = {
    bucket: Args.string({description: '存储桶名称', required: false}),
  }

  static description = '列出 OSS 存储桶中的对象，未指定存储桶时交互式选择'
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> my-bucket']

  public async run(): Promise<void> {
    const {args} = await this.parse(BktObjList)
    const mgr = new BktManager()

    const bucket = args.bucket ? await mgr.getBucketByName(args.bucket) : await mgr.selectBucket()
    if (!bucket) {
      if (args.bucket) this.log(`未找到存储桶 ${args.bucket}`)
      return
    }

    await mgr.listObjects(bucket)
  }
}
