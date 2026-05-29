import {confirm, search} from '@inquirer/prompts'
import {Command} from '@oclif/core'
import Fuse from 'fuse.js'

import {BktManager} from '../../lib/bkt/bkt.js'

interface BucketChoice {
  name: string
  region: string
}

export default class BktDel extends Command {
  static description = '删除空的 OSS 存储空间（交互式选择）'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const mgr = new BktManager()
    const buckets = await mgr.getBuckets()
    if (buckets.length === 0) {
      this.log('当前账号没有 OSS 存储空间')
      return
    }

    const fuse = new Fuse(buckets, {keys: ['name', 'region'], threshold: 0.4})

    const selected = await search<BucketChoice>({
      message: '搜索并选择要删除的存储桶',
      source: (term) => {
        const results = term ? fuse.search(term).map((r) => r.item) : buckets
        return results.map((b) => ({
          description: `${b.region} | ${b.storageClass}`,
          name: b.name,
          value: {name: b.name, region: b.region},
        }))
      },
    })

    const yes = await confirm({
      default: false,
      message: `确认要删除存储桶 ${selected.name} 吗？（仅空桶可删除，此操作不可恢复）`,
    })
    if (!yes) {
      this.log('取消删除操作')
      return
    }

    await mgr.deleteBucket(selected.name, selected.region)
  }
}
