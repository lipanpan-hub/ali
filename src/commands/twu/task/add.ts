import * as inquirer from '@inquirer/prompts'
import {Command, Flags} from '@oclif/core'
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
  static description = '创建通义听悟离线语音转写任务 (提交后轮询等待完成, 自动下载结果并生成 VTT 字幕和纯文本)'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -k myAppKey -u https://example.com/a.mp4 -l cn',
    '<%= config.bin %> <%= command.id %> -u https://example.com/a.mp4 --diarization --speaker-count 2',
    '<%= config.bin %> <%= command.id %> -u https://example.com/a.mp4 -p phrase-id-xxx --paragraph',
  ]
  static flags = {
    'app-key': Flags.string({char: 'k', description: '听悟项目 AppKey'}),
    diarization: Flags.boolean({allowNo: true, description: '开启说话人分离 (不指定则交互式询问)'}),
    'file-url': Flags.string({char: 'u', description: '音视频文件 URL'}),
    language: Flags.string({char: 'l', description: '源语言', options: LANGUAGE_CHOICES.map((c) => c.value)}),
    paragraph: Flags.boolean({default: false, description: '额外按段落生成 WebVTT 字幕文件'}),
    phrase: Flags.boolean({allowNo: true, description: '是否使用热词词表 (不指定则交互式询问)'}),
    'phrase-id': Flags.string({char: 'p', description: '热词词表 ID'}),
    'speaker-count': Flags.integer({description: '说话人数量 (0 表示自动判断), 指定即开启说话人分离'}),
    txt: Flags.boolean({default: true, description: '将识别结果抽取为纯文本文件'}),
    vtt: Flags.boolean({default: true, description: '将识别结果转换为 WebVTT 字幕文件'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(TwuTaskAdd)

    // #region 采集 AppKey
    const configManager = new ConfigManager(ConfigManager.getDefaultPath())
    const appKeys = configManager.getCurrentProfile()?.tingwu_app_keys ?? []

    let appKey: string
    const fromFlag = Boolean(flags['app-key'])
    if (fromFlag) {
      appKey = flags['app-key']!.trim()
    } else if (appKeys.length > 0) {
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
      appKey = appKey.trim()
    } else {
      appKey = (await inquirer.input({message: '请输入听悟项目 AppKey:'})).trim()
    }

    if (!appKey) {
      this.log('AppKey 不能为空')
      return
    }

    // 最终使用的 AppKey 不在配置中时保存: 交互模式下询问, flag 模式下自动保存
    if (!appKeys.includes(appKey)) {
      const save = fromFlag || (await inquirer.confirm({default: true, message: '该 AppKey 不在配置中, 是否保存到配置文件?'}))
      if (save) {
        const ok = configManager.updateCurrentProfile({tingwu_app_keys: [...appKeys, appKey]}) // eslint-disable-line camelcase
        this.log(ok ? 'AppKey 已保存到配置' : '当前无可用配置, AppKey 未保存')
      }
    }
    // #endregion

    // #region 采集任务参数
    const fileUrl = flags['file-url'] ? flags['file-url'].trim() : (await inquirer.input({message: '请输入音视频文件 URL:'})).trim()
    if (!fileUrl) {
      this.log('文件 URL 不能为空')
      return
    }

    const sourceLanguage = flags.language ?? (await inquirer.select({choices: LANGUAGE_CHOICES, message: '请选择源语言:'}))

    let diarizationEnabled: boolean
    let speakerCount = 0
    if (flags.diarization !== undefined || flags['speaker-count'] !== undefined) {
      diarizationEnabled = flags.diarization ?? true
      speakerCount = flags['speaker-count'] ?? 0
    } else {
      diarizationEnabled = await inquirer.confirm({default: false, message: '是否开启说话人分离?'})
      if (diarizationEnabled) {
        const input = await inquirer.input({
          default: '0',
          message: '请输入说话人数量 (0 表示自动判断):',
          validate: (v) => /^\d+$/.test(v) || '请输入数字',
        })
        speakerCount = Number(input)
      }
    }
    // #endregion

    // #region 选择热词词表
    const manager = new TingwuManager()
    let phraseId: string | undefined = flags['phrase-id']
    if (!phraseId) {
      // phrase flag 显式指定时使用其值, 未指定 (undefined) 才交互式询问
      const usePhrase = flags.phrase ?? (await inquirer.confirm({default: false, message: '是否使用热词词表?'}))
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
    }
    // #endregion

    await manager.recognize({
      appKey,
      diarizationEnabled,
      enableParagraph: flags.paragraph,
      enableTxt: flags.txt,
      enableVtt: flags.vtt,
      fileUrl,
      phraseId,
      sourceLanguage,
      speakerCount,
    })
  }
}
