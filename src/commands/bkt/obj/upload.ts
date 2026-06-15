import {Args, Command, Flags} from '@oclif/core'

import {BktManager} from '../../../lib/bkt/bkt.js'

export default class BktUpload extends Command {
  static aliases = ['bkt:obj:up']
  static args = {
    bucket: Args.string({description: '存储桶名称，未指定时交互式选择', required: false}),
  }

  static description = '上传文件到 OSS 存储桶，未指定 --file 时交互式选择当前目录文件'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> my-bucket',
    '<%= config.bin %> <%= command.id %> my-bucket -f ./a.zip -f /path/to/b.png',
  ]
  static flags = {
    file: Flags.string({char: 'f', description: '手动指定要上传的文件路径，可多次指定', multiple: true}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(BktUpload)
    const mgr = new BktManager()
    await mgr.uploadFiles(flags.file, args.bucket)
  }
}
