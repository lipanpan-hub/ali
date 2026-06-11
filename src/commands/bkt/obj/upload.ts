import {Command} from '@oclif/core'

import {BktManager} from '../../../lib/bkt/bkt.js'

export default class BktUpload extends Command {
  static aliases = ['bkt:obj:up']
  static description = '交互式选择文件并上传到 OSS 存储桶'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const mgr = new BktManager()
    await mgr.uploadFiles()
  }
}
