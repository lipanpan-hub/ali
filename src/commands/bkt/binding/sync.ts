// 交互式选定一个绑定关系, 扫描本地目录并应用过滤器得到可上传文件列表, 再同步上传到 OSS
// 上传项为 {filePath, name} 对象, name 以本地文件夹名开头以保留目录层级
// 上传前做增量比对 (云端 ETag/MD5), 内容未变化的文件自动跳过, 避免重复上传

import {BaseCommand} from '../../../lib/base-command.js'
import {BktManager} from '../../../lib/bkt/bkt.js'

export default class BktBindingSync extends BaseCommand {
  static aliases = ['bkt:bd:sync']
  static description = '交互式选择一个绑定关系, 将本地目录中过滤后的文件增量同步到 OSS 存储桶'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    await new BktManager().syncBinding()
  }
}
