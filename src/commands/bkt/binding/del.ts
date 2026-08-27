// 这个命令的作用是可以让用户交互式的选择 config.json 配置文件 oss_bkt_binding 字段下面 一个绑定关系 然后执行删除操作 

import {BaseCommand} from '../../../lib/base-command.js'
import {BktManager} from '../../../lib/bkt/bkt.js'

export default class BktBindingDel extends BaseCommand {
  static aliases = ['bkt:binding:remove', 'bkt:bd:del']
  static description = '交互式选择并删除一个本地目录与 OSS 存储桶的绑定关系'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    await new BktManager().deleteBinding()
  }
}
