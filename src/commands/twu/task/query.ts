import * as inquirer from '@inquirer/prompts'
import {Args, Command, Flags} from '@oclif/core'

import {TingwuManager} from '../../../lib/twu/twu.js'

export default class TwuTaskQuery extends Command {
  static args = {
    taskId: Args.string({description: '听悟任务 ID'}),
  }
  static aliases = ['twu:tq']
  static description = '根据任务 ID 查询通义听悟转写任务信息'
  static examples = [
    '<%= config.bin %> <%= command.id %> c5394c6ee0fb474899d42215a3925c7e',
    '<%= config.bin %> <%= command.id %> c5394c6ee0fb474899d42215a3925c7e --download',
    '<%= config.bin %> <%= command.id %> c5394c6ee0fb474899d42215a3925c7e --watch --download',
    '<%= config.bin %> <%= command.id %> c5394c6ee0fb474899d42215a3925c7e --vtt',
    '<%= config.bin %> <%= command.id %> c5394c6ee0fb474899d42215a3925c7e --paragraph',
    '<%= config.bin %> <%= command.id %> -t c5394c6ee0fb474899d42215a3925c7e',
  ]
  static flags = {
    download: Flags.boolean({char: 'd', default: false, description: '任务完成时下载转写结果 JSON 到当前目录'}),
    paragraph: Flags.boolean({default: false, description: '轮询等待任务完成, 下载 JSON 并按段落转换为 WebVTT 字幕文件'}),
    'task-id': Flags.string({char: 't', description: '听悟任务 ID (未提供时进入交互式录入)'}),
    vtt: Flags.boolean({default: false, description: '轮询等待任务完成, 下载 JSON 并自动转换为 WebVTT 字幕文件'}),
    watch: Flags.boolean({char: 'w', default: false, description: '轮询查询, 直到任务状态为完成或失败'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(TwuTaskQuery)

    // 优先级: 位置参数 > flag > 交互式录入
    let taskId = (args.taskId ?? flags['task-id'])?.trim()
    if (!taskId) {
      taskId = (await inquirer.input({message: '请输入听悟任务 ID:'})).trim()
    }

    if (!taskId) {
      this.log('任务 ID 不能为空')
      return
    }

    await new TingwuManager().queryTask(taskId, flags.download, flags.watch, flags.vtt, flags.paragraph)
  }
}
