import * as inquirer from '@inquirer/prompts'
import {Command} from '@oclif/core'
import Fuse from 'fuse.js'

import {ConfigManager} from '../../../lib/config/config.js'
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
  static aliases = ['twu:ta']
  static description = '创建通义听悟离线语音转写任务'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    // #region 采集 AppKey
    const configManager = new ConfigManager()
    const appKeys = configManager.getCurrentProfile()?.tingwu_app_keys ?? []

    let appKey: string
    if (appKeys.length > 0) {
      // 存在历史 AppKey, 用 fuse 模糊搜索选择, 也允许直接输入新值
      const fuse = new Fuse(appKeys, {threshold: 0.4})
      appKey = await inquirer.search({
        message: '请选择或输入听悟项目 AppKey:',
        source: (term) => {
          const keyword = term?.trim() ?? ''
          const matched = keyword ? fuse.search(keyword).map((r) => r.item) : appKeys
          const choices = matched.map((k) => ({name: k, value: k}))
          // 输入的关键字不在历史列表中时, 提供"使用新值"选项
          if (keyword && !appKeys.includes(keyword)) choices.unshift({name: `使用新 AppKey: ${keyword}`, value: keyword})
          return choices
        },
      })
    } else {
      appKey = await inquirer.input({message: '请输入听悟项目 AppKey:'})
    }

    appKey = appKey.trim()
    if (!appKey) {
      this.log('AppKey 不能为空')
      return
    }

    // 最终使用的 AppKey 不在配置中时, 询问是否保存
    if (!appKeys.includes(appKey)) {
      const save = await inquirer.confirm({default: true, message: '该 AppKey 不在配置中, 是否保存到配置文件?'})
      if (save) {
        const ok = configManager.updateCurrentProfile({tingwu_app_keys: [...appKeys, appKey]}) // eslint-disable-line camelcase
        this.log(ok ? 'AppKey 已保存到配置' : '当前无可用配置, AppKey 未保存')
      }
    }
    // #endregion

    // #region 采集任务参数
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
