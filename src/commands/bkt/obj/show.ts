import {Args} from '@oclif/core'

import {BaseCommand} from '../../../lib/base-command.js'
import {BktManager} from '../../../lib/bkt/bkt.js'

export default class BktObjShow extends BaseCommand {
  static aliases = ['bkt:obj:info']
  static args = {
    bucket: Args.string({description: '存储桶名称', required: false}),
    object: Args.string({description: '对象名称', required: false}),
  }

  static description = '显示 OSS 存储桶中对象的详细信息，未指定时交互式选择'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> my-bucket path/to/file.zip',
  ]

  public async run(): Promise<void> {
    const {args} = await this.parse(BktObjShow)
    const mgr = new BktManager()

    const bucket = args.bucket ? await mgr.getBucketByName(args.bucket) : await mgr.selectBucket()
    if (!bucket) {
      if (args.bucket) this.log(`未找到存储桶 ${args.bucket}`)
      return
    }

    let objectName = args.object
    if (!objectName) {
      const obj = await mgr.selectObject(bucket)
      if (!obj) return
      objectName = obj.name
    }

    await mgr.showObject(bucket, objectName)
  }
}
