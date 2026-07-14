import {writeFileSync} from 'node:fs'
import {join} from 'node:path'

import {createNlsClient} from '../client/client.js'
import {wrap} from '../client/wrap.js'
import {VttConverter} from './vtt.js'

export interface RecognizeOptions {
  appKey: string
  enableTxt: boolean
  enableVtt: boolean
  enableWords: boolean
  fileLink: string
}

interface Sentence {
  BeginTime?: number
  ChannelId?: number
  EndTime?: number
  Text?: string
}

interface Word {
  BeginTime?: number
  EndTime?: number
  Word?: string
}

const POLL_INTERVAL_MS = 10_000

export class NlsFileTransManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any = null

  constructor() {
    const c = createNlsClient()
    if (!c) return
    this.client = c.client
  }

  // #region 录音文件识别
  async recognize(options: RecognizeOptions): Promise<void> {
    if (!this.client) return

    const taskId = await this.submitTask(options)
    if (!taskId) return

    const result = await this.pollResult(taskId)
    if (!result) return

    this.saveResult(taskId, result, options.enableVtt, options.enableTxt)
  }

  // 每 10 秒轮询一次识别结果, 直到进入终态
  private async pollResult(taskId: string) {
    for (;;) {
      const res = await wrap('查询识别结果', async () => this.client.getTaskResult({TaskId: taskId}))
      if (!res) return null

      const status = res.StatusText
      console.log(`当前状态: ${status ?? '-'}`)

      if (status === 'RUNNING' || status === 'QUEUEING') {
        await new Promise((resolve) => {
          setTimeout(resolve, POLL_INTERVAL_MS)
        })
        continue
      }

      if (status === 'SUCCESS' || status === 'SUCCESS_WITH_NO_VALID_FRAGMENT') return res

      console.log(`识别失败: ${status ?? '未知错误'}`)
      return null
    }
  }

  // 将识别结果保存为 JSON 文件到当前目录, enableVtt 时额外生成逐词时间戳 VTT 字幕
  private saveResult(taskId: string, result: {Result?: {Sentences?: Sentence[]; Words?: Word[]}}, enableVtt: boolean, enableTxt: boolean): void {
    const sentences = result.Result?.Sentences ?? []
    const filePath = join(process.cwd(), `nls-${taskId}.json`)
    writeFileSync(filePath, JSON.stringify(result.Result ?? {}, null, 2), 'utf8')
    console.log(`识别成功 (共 ${sentences.length} 句), 结果已保存到: ${filePath}`)

    if (enableVtt) {
      const words = result.Result?.Words ?? []
      const vttPath = join(process.cwd(), `nls-${taskId}.vtt`)
      const count = VttConverter.convert(sentences, words, vttPath)
      console.log(`已生成 VTT 字幕 (共 ${count} 条), 保存到: ${vttPath}`)
    }

    if (enableTxt) {
      // 逐句抽取 Text 到纯文本, 每句一行
      const lines = sentences.map((s) => s.Text?.trim()).filter(Boolean)
      const txtPath = join(process.cwd(), `nls-${taskId}.txt`)
      writeFileSync(txtPath, lines.join('\n') + '\n', 'utf8')
      console.log(`已抽取纯文本 (共 ${lines.length} 句), 保存到: ${txtPath}`)
    }
  }

  // 提交识别请求, 成功返回 TaskId
  private async submitTask(options: RecognizeOptions): Promise<null | string> {
    /* eslint-disable camelcase */
    // task 内部字段为服务端约定的下划线命名, 需保持原样
    const task = JSON.stringify({
      appkey: options.appKey,
      enable_words: options.enableWords,
      file_link: options.fileLink,
      version: '4.0',
      enable_sample_rate_adaptive:true,
    })
    /* eslint-enable camelcase */

    const res = await wrap('提交录音文件识别请求', async () => this.client.submitTask({Task: task}, {method: 'POST'}))
    if (!res) return null

    if (res.StatusText !== 'SUCCESS') {
      console.log(`识别请求提交失败: ${res.StatusText ?? '未知错误'}`)
      return null
    }

    console.log('识别请求已提交')
    console.log(`任务ID: ${res.TaskId}`)
    return res.TaskId
  }
  // #endregion
}
