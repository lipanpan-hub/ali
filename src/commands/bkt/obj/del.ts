import {Args, Command} from '@oclif/core'
import prompts from 'prompts'

import {BktManager} from '../../../lib/bkt/bkt.js'

// 这个命令让用户交互式选择存储桶
// 用户选定存储桶之后再让用户交互式选择(prompts+fuse.js)一个或多个存储桶当中的object 执行删除操作
export default class BktObjDel extends Command {
  static aliases = ['bkt:obj:rm']
  static args = {
    bucket: Args.string({description: '存储桶名称', required: false}),
  }

  static description = '删除 OSS 存储桶中的对象，交互式多选，未指定存储桶时交互式选择'
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> my-bucket']

  public async run(): Promise<void> {
    const {args} = await this.parse(BktObjDel)
    const mgr = new BktManager()

    const bucket = args.bucket ? await mgr.getBucketByName(args.bucket) : await mgr.selectBucket()
    if (!bucket) {
      if (args.bucket) this.log(`未找到存储桶 ${args.bucket}`)
      return
    }

    const objects = await mgr.selectObjects(bucket)
    if (objects.length === 0) return

    const names = objects.map((o) => o.name)
    const {yes} = await prompts({
      initial: false,
      message: `确认要执行删除操作吗？此操作不可恢复`,
      name: 'yes',
      type: 'confirm',
    })
    if (!yes) {
      this.log('取消删除操作')
      return
    }

    await mgr.deleteObjects(bucket, names)
  }
}
