import * as inquirer from '@inquirer/prompts'
import {Args, Command, Flags} from '@oclif/core'
import Fuse from 'fuse.js'

import {BktManager} from '../../lib/bkt/bkt.js'
import {regionChoices} from '../../lib/utils/regions.js'

export default class BktAdd extends Command {
  static aliases = ['bkt:create']
  static args = {
    name: Args.string({description: '存储桶名称', required: false}),
  }

  static description = '创建 OSS 存储空间'
  static examples = [
    '<%= config.bin %> <%= command.id %> my-bucket -r cn-hangzhou',
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    region: Flags.string({char: 'r', description: '区域ID (例如: cn-hangzhou)', required: false}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(BktAdd)
    let {name} = args
    let {region} = flags

    if (!name) {
      name = await inquirer.input({
        message: '请输入存储桶名称:',
        validate: (value) => value.length > 0 || '存储桶名称不能为空',
      })
    }

    if (!region) {
      const items = Object.entries(regionChoices).map(([id, label]) => ({id, label}))
      const fuse = new Fuse(items, {keys: ['id', 'label'], threshold: 0.4})
      region = await inquirer.search({
        message: '请选择区域 (输入关键字搜索):',
        source: (term) => {
          const results = term ? fuse.search(term).map((r) => r.item) : items
          return results.map((r) => ({name: r.label, value: r.id}))
        },
      })
    }

    if (!name || !region) return

    await new BktManager().createBucket(name, region)
  }
}
