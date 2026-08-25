// 创建本地目录和阿里云OSS云端buckt 的绑定关系 并存入配置文件
// 需要让用户交互式提供一个本地目录
// 需要让用户交互式选择 一个阿里云存储桶
// 然后还需要用户交互式的提供 反向过滤器正则表达式  可以添加多个过滤器 用于去除本地目录中的文件
// 然后还需要用户交互式提供 正向过滤器 正则表达式 可以添加多个过滤器 用于保留本地目录中的文件
// 把收集到的数据存储到 config.json 配置文件 oss_bkt_binding 字段下面

import {BaseCommand} from '../../../lib/base-command.js'
import {BktManager} from '../../../lib/bkt/bkt.js'

export default class BktBindingAdd extends BaseCommand {
  static aliases = ['bkt:binding:create',"bkt:bd:add"]
  static description = '创建本地目录与 OSS 存储桶的绑定关系'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    await new BktManager().addBinding()
  }
}
