import {Args, Command, Flags} from '@oclif/core'

import {BktManager} from '../../lib/bkt/bkt.js'

export default class BktSign extends Command {
  static aliases = ['bkt:upload-url']
  static args = {
    bucket: Args.string({description: '存储桶名称', required: false}),
    object: Args.string({description: '上传的对象名称（含路径）', required: false}),
  }

  static description = '为 OSS 存储桶生成上传签名 URL，未指定时交互式选择'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> my-bucket path/to/file.zip',
    '<%= config.bin %> <%= command.id %> my-bucket path/to/file.zip --expires 7200',
  ]
  static flags = {
    expires: Flags.integer({char: 'e', default: 3600, description: 'URL 有效期（秒）'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(BktSign)
    const mgr = new BktManager()

    const bucket = args.bucket ? await mgr.getBucketByName(args.bucket) : await mgr.selectBucket()
    if (!bucket) {
      if (args.bucket) this.log(`未找到存储桶 ${args.bucket}`)
      return
    }

    await mgr.signUploadUrl(bucket, args.object, flags.expires)
  }
}
