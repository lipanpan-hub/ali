import * as inquirer from '@inquirer/prompts'
import {Command} from '@oclif/core'

import {TingwuManager} from '../../../lib/twu/twu.js'

const LANGUAGE_CHOICES = [
  {name: '中文', value: 'cn'},
  {name: '英文', value: 'en'},
  {name: '粤语', value: 'yue'},
  {name: '日语', value: 'ja'},
  {name: '韩语', value: 'ko'},
  {name: '多语言自动识别', value: 'auto'},
]

export default class TwuTaskAdd extends Command {
  static description = '创建通义听悟离线语音转写任务'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    // #region 采集任务参数
    const appKey = (await inquirer.input({message: '请输入听悟项目 AppKey:'})).trim()
    if (!appKey) {
      this.log('AppKey 不能为空')
      return
    }

    const fileUrl = (await inquirer.input({message: '请输入音视频文件 URL:'})).trim()
    if (!fileUrl) {
      this.log('文件 URL 不能为空')
      return
    }

    const sourceLanguage = await inquirer.select({choices: LANGUAGE_CHOICES, message: '请选择源语言:'})

    const diarizationEnabled = await inquirer.confirm({default: false, message: '是否开启说话人分离?'})

    let speakerCount = 0
    if (diarizationEnabled) {
      const input = await inquirer.input({
        default: '0',
        message: '请输入说话人数量 (0 表示自动判断):',
        validate: (v) => /^\d+$/.test(v) || '请输入数字',
      })
      speakerCount = Number(input)
    }
    // #endregion

    // #region 选择热词词表
    const manager = new TingwuManager()
    let phraseId: string | undefined
    const usePhrase = await inquirer.confirm({default: false, message: '是否使用热词词表?'})
    if (usePhrase) {
      const phrases = await manager.getPhrases()
      if (phrases.length === 0) {
        this.log('当前没有可用的热词词表')
      } else {
        phraseId = await inquirer.select({
          choices: phrases.map((p) => ({name: `${p.name ?? '-'}  ${p.description ?? ''}`.trim(), value: p.phraseId})),
          message: '请选择热词词表:',
        })
      }
    }
    // #endregion

    await manager.createTask({appKey, diarizationEnabled, fileUrl, phraseId, sourceLanguage, speakerCount})
  }
}
