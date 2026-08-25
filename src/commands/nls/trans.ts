import * as inquirer from '@inquirer/prompts'
import {Command, Flags} from '@oclif/core'
import Fuse from 'fuse.js'

import {ConfigManager} from '../../lib/config/config.js'
import {NlsFileTransManager} from '../../lib/nls/nls.js'

export default class NlsTrans extends Command {
  static aliases = ['nls:t']
  static description = '录音文件识别 (提交音频/视频文件 URL, 轮询并输出识别文本)'
  static examples = [
    '<%= config.bin %> <%= command.id %> -u https://example.com/a.wav',
    '<%= config.bin %> <%= command.id %> -u https://example.com/a.wav -k myAppKey --words',
  ]
  static flags = {
    'app-key': Flags.string({char: 'k', description: 'NLS 项目 AppKey'}),
    'file-link': Flags.string({char: 'u', description: '录音文件 URL'}),
    txt: Flags.boolean({default: true, description: '将识别出的所有句子额外抽取为纯文本文件'}),
    vtt: Flags.boolean({default: true, description: '将识别结果额外转换为 VTT 字幕文件'}),
    words: Flags.boolean({default: true, description: '输出词级别信息 (enable_words)'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(NlsTrans)

    const appKey = await this.resolveAppKey(flags['app-key'])
    if (!appKey) return

    const fileLink = flags['file-link']
      ? flags['file-link'].trim()
      : (await inquirer.input({message: '请输入录音文件 URL:'})).trim()
    if (!fileLink) {
      this.log('录音文件 URL 不能为空')
      return
    }

    await new NlsFileTransManager().recognize({appKey, enableTxt: flags.txt, enableVtt: flags.vtt, enableWords: flags.words, fileLink})
  }

  // #region 采集 AppKey (flag 优先, 否则从配置模糊选择或新增)
  private async resolveAppKey(fromFlag?: string): Promise<string> {
    const configManager = new ConfigManager(ConfigManager.resolveConfigPath())
    const appKeys = configManager.getCurrentProfile()?.nls_app_keys ?? []

    let appKey: string
    if (fromFlag) {
      appKey = fromFlag.trim()
    } else if (appKeys.length > 0) {
      const fuse = new Fuse(appKeys, {threshold: 0.4})
      const selected = await inquirer.search({
        message: '请选择或输入 NLS 项目 AppKey:',
        source(term) {
          const keyword = term?.trim() ?? ''
          const matched = keyword ? fuse.search(keyword).map((r) => r.item) : appKeys
          const choices = matched.map((k) => ({name: k, value: k}))
          if (keyword && !appKeys.includes(keyword)) choices.unshift({name: `使用新 AppKey: ${keyword}`, value: keyword})
          return choices
        },
      })
      appKey = selected.trim()
    } else {
      appKey = (await inquirer.input({message: '请输入 NLS 项目 AppKey:'})).trim()
    }

    if (!appKey) {
      this.log('AppKey 不能为空')
      return ''
    }

    // 新 AppKey 落盘: flag 模式自动保存, 交互模式询问后保存
    if (!appKeys.includes(appKey)) {
      const save = Boolean(fromFlag) || (await inquirer.confirm({default: true, message: '该 AppKey 不在配置中, 是否保存到配置文件?'}))
      if (save) {
        const ok = configManager.updateCurrentProfile({nls_app_keys: [...appKeys, appKey]}) // eslint-disable-line camelcase
        this.log(ok ? 'AppKey 已保存到配置' : '当前无可用配置, AppKey 未保存')
      }
    }

    return appKey
  }
  // #endregion
}
