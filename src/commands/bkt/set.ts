import {Command} from '@oclif/core'

import {BktManager} from '../../lib/bkt/bkt.js'

export default class BktSet extends Command {
  static description = '交互式设置存储桶属性'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const mgr = new BktManager()
    const bucket = await mgr.selectBucket()
    if (!bucket) return
    const property = await mgr.selectProperty()
    await mgr.setBucketProperty(bucket, property)
  }
}
