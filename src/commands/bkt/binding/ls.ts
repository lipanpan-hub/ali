// 列出配置文件 oss_bkt_binding 字段下面用户添加的 绑定关系
// 添加 --run flag  用户可以交互式选择 一个 绑定关系  并执行过滤器 然后会打印出 最终可以上传的 文件列表

import {Flags} from '@oclif/core'

import {BaseCommand} from '../../../lib/base-command.js'
import {BktManager} from '../../../lib/bkt/bkt.js'

export default class BktBindingLs extends BaseCommand {
  static aliases = ['bkt:binding:list', 'bkt:bd:ls']
  static description = '列出本地目录与 OSS 存储桶的绑定关系'
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --run']
  static flags = {
    run: Flags.boolean({char: 'r', default: false, description: '交互式选择一个绑定并预览过滤后可上传的文件列表'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(BktBindingLs)
    const mgr = new BktManager()
    if (flags.run) {
      await mgr.runBinding()
    } else {
      await mgr.listBindings()
    }
  }
}
