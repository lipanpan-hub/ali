import {CreateTaskRequest, CreateTranscriptionPhrasesRequest, UpdateTranscriptionPhrasesRequest} from '@alicloud/tingwu20230930'
import {existsSync, readFileSync, writeFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {join} from 'node:path'

import {createTingwuClient} from '../client/client.js'
import {createRuntime} from '../client/runtime.js'
import {wrap} from '../client/wrap.js'

const require = createRequire(import.meta.url)
const {$OpenApiUtil} = require('@alicloud/openapi-core')

export interface CreateTaskOptions {
  appKey: string
  diarizationEnabled: boolean
  fileUrl: string
  phraseId?: string
  sourceLanguage: string
  speakerCount: number
}

export interface CreatePhrasesOptions {
  description: string
  name: string
  wordWeights: Record<string, number>
}

export interface UpdatePhrasesOptions {
  name: string
  phraseId: string
  wordWeights: Record<string, number>
}

export interface PhraseItem {
  description?: string
  name?: string
  phraseId?: string
}

export interface PhraseDetail {
  description: string
  name: string
  wordWeights: Record<string, number>
}

// #region WebVTT 转换相关类型
interface TranscriptionWord {
  End: number
  SentenceId: number
  Start: number
  Text: string
}

interface TranscriptionParagraph {
  SpeakerId: number
  Words?: TranscriptionWord[]
}

interface TranscriptionJson {
  Transcription?: {Paragraphs?: TranscriptionParagraph[]}
}

interface VttCue {
  end: number
  speaker: number
  start: number
  words: TranscriptionWord[]
}
// #endregion

function buildTaskKey(): string {
  return `task_${Date.now()}`
}

export class TingwuManager {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any = null

  constructor() {
    const c = createTingwuClient()
    if (!c) return
    this.client = c.client
  }

  // #region 创建离线转写任务
  async createTask(options: CreateTaskOptions): Promise<void> {
    if (!this.client) return

    const transcription: Record<string, unknown> = {diarizationEnabled: options.diarizationEnabled}
    // speakerCount: 0 表示不定人数自动判断, 其它正整数表示固定人数
    if (options.diarizationEnabled) transcription.diarization = {speakerCount: options.speakerCount}
    // phraseId: 指定热词词表, 提升专有名词转写准确率
    if (options.phraseId) transcription.phraseId = options.phraseId

    const request = new CreateTaskRequest({
      appKey: options.appKey,
      input: {fileUrl: options.fileUrl, sourceLanguage: options.sourceLanguage, taskKey: buildTaskKey()},
      parameters: {transcription},
      type: 'offline',
    })

    const res = await wrap('创建听悟转写任务', async () => this.client.createTaskWithOptions(request, {}, createRuntime()))
    if (!res) return

    const data = res.body?.data
    if (!data?.taskId) {
      console.log(`创建失败: ${res.body?.message ?? '未知错误'}`)
      return
    }

    console.log('转写任务已提交')
    console.log(`任务ID: ${data.taskId}`)
    console.log(`任务标识: ${data.taskKey ?? '-'}`)
    console.log(`当前状态: ${data.taskStatus ?? '-'}`)
  }
  // #endregion

  // #region 查询任务信息
  async queryTask(taskId: string, download = false, poll = false, vtt = false): Promise<void> {
    if (!this.client) return

    // vtt 隐含 poll + download
    const shouldPoll = poll || vtt
    const shouldDownload = download || vtt

    const data = shouldPoll ? await this.pollTask(taskId) : await this.fetchTaskData(taskId)
    if (!data) return

    console.log(`任务状态: ${data.taskStatus ?? '-'}`)
    if (data.errorCode) console.log(`错误信息: ${data.errorCode} - ${data.errorMessage ?? ''}`)

    const transcriptionUrl = data.result?.transcription
    console.log(transcriptionUrl ? `转写结果 URL: ${transcriptionUrl}` : '结果尚未就绪 (任务可能还在进行中)')

    if (shouldDownload && transcriptionUrl) {
      if (data.taskStatus !== 'COMPLETED') {
        console.log('任务尚未完成, 跳过下载')
        return
      }

      const jsonPath = await this.downloadTranscription(transcriptionUrl, taskId)

      // --vtt: 下载完成后自动转换为 WebVTT 字幕文件
      if (vtt && jsonPath) {
        const {cueCount, outputPath} = this.convertToWebVtt(jsonPath)
        console.log(`WebVTT 字幕已生成: ${outputPath} (共 ${cueCount} 条字幕)`)
      }
    }
  }

  // 查询一次任务信息, 返回 data 或 null
  private async fetchTaskData(taskId: string) {
    const res = await wrap('查询听悟任务', async () => this.client.getTaskInfo(taskId))
    if (!res) return null

    const data = res.body?.data
    if (!data) {
      console.log(`查询失败: ${res.body?.message ?? '未知错误'}`)
      return null
    }

    return data
  }

  // 每 5 秒轮询一次, 直到任务状态为 COMPLETED 或 FAILED
  private async pollTask(taskId: string) {
    for (;;) {
      const data = await this.fetchTaskData(taskId)
      if (!data) return null

      console.log(`当前状态: ${data.taskStatus ?? '-'}`)
      if (data.taskStatus === 'COMPLETED' || data.taskStatus === 'FAILED') return data

      await new Promise((resolve) => {
        setTimeout(resolve, 5000)
      })
    }
  }

  private async downloadTranscription(url: string, taskId: string): Promise<null | string> {
    return wrap('下载转写结果', async () => {
      const resp = await fetch(url)
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`)

      const text = await resp.text()
      const filePath = join(process.cwd(), `${taskId}.json`)
      writeFileSync(filePath, text, 'utf8')
      console.log(`转写结果已保存到: ${filePath}`)
      return filePath
    })
  }

  // #region WebVTT 转换
  private formatVttTimestamp(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000)
    const millis = ms % 1000
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const pad = (n: number, w = 2) => String(n).padStart(w, '0')
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(millis, 3)}`
  }

  private buildVttCues(paragraphs: TranscriptionParagraph[]): VttCue[] {
    const cues: VttCue[] = []
    let current: VttCue | null = null
    let currentSentenceId: null | number = null

    for (const paragraph of paragraphs) {
      const speaker = paragraph.SpeakerId
      for (const word of paragraph.Words ?? []) {
        if (current && word.SentenceId === currentSentenceId) {
          current.words.push(word)
          current.end = word.End
        } else {
          if (current) cues.push(current)
          current = {end: word.End, speaker, start: word.Start, words: [word]}
          currentSentenceId = word.SentenceId
        }
      }
    }

    if (current) cues.push(current)
    return cues
  }

  private renderWebVtt(cues: VttCue[]): string {
    const blocks = cues.map((cue, index) => {
      const time = `${this.formatVttTimestamp(cue.start)} --> ${this.formatVttTimestamp(cue.end)}`
      const payload = cue.words.map((w) => `<${this.formatVttTimestamp(w.Start)}>${w.Text}`).join('')
      return `${index + 1}\n${time}\n<v 说话人${cue.speaker}>${payload}`
    })
    return `WEBVTT\n\n${blocks.join('\n\n')}\n`
  }

  convertToWebVtt(inputPath: string, outputPath?: string): {cueCount: number; outputPath: string} {
    if (!existsSync(inputPath)) throw new Error(`输入文件不存在: ${inputPath}`)

    const data = JSON.parse(readFileSync(inputPath, 'utf8')) as TranscriptionJson
    const paragraphs = data.Transcription?.Paragraphs ?? []
    if (paragraphs.length === 0) throw new Error('JSON 中未找到 Transcription.Paragraphs 数据')

    const cues = this.buildVttCues(paragraphs)
    const vtt = this.renderWebVtt(cues)

    const finalOutput = outputPath ?? inputPath.replace(/\.json$/i, '.vtt')
    writeFileSync(finalOutput, vtt, 'utf8')
    return {cueCount: cues.length, outputPath: finalOutput}
  }
  // #endregion
  // #endregion

  // #region 创建热词词表
  async createPhrases(options: CreatePhrasesOptions): Promise<void> {
    if (!this.client) return

    // wordWeights 需序列化为 JSON 字符串, 如 {"苹果":3,"西瓜":3}
    const request = new CreateTranscriptionPhrasesRequest({
      description: options.description,
      name: options.name,
      wordWeights: JSON.stringify(options.wordWeights),
    })

    const res = await wrap('创建热词词表', async () => this.client.createTranscriptionPhrases(request))
    if (!res) return

    const data = res.body?.data
    if (!data?.phraseId) {
      console.log(`创建失败: ${res.body?.message ?? '未知错误'}`)
      return
    }

    console.log('热词词表创建成功')
    console.log(`词表ID: ${data.phraseId}`)
    console.log(`当前状态: ${data.status ?? '-'}`)
  }
  // #endregion

  // #region 获取热词词表列表
  async getPhrases(): Promise<PhraseItem[]> {
    if (!this.client) return []

    const res = await wrap('列举热词词表', async () => this.client.listTranscriptionPhrases())
    return res?.body?.data?.phrases ?? []
  }
  // #endregion

  // #region 查询单个热词词表内容
  async fetchPhrase(phraseId: string): Promise<null | PhraseDetail> {
    if (!this.client) return null

    // 用底层 callApi 拿原始 body, 规避 SDK 对 wordWeights 的类型校验 bug
    const res = await wrap('查询热词词表', async () => {
      const req = new $OpenApiUtil.OpenApiRequest({headers: {}})
      const params = new $OpenApiUtil.Params({
        action: 'GetTranscriptionPhrases',
        authType: 'AK',
        bodyType: 'json',
        method: 'GET',
        pathname: `/openapi/tingwu/v2/resources/phrases/${encodeURIComponent(phraseId)}`,
        protocol: 'HTTPS',
        reqBodyType: 'json',
        style: 'ROA',
        version: '2023-09-30',
      })
      return this.client.callApi(params, req, createRuntime())
    })
    if (!res) return null

    const phrase = res.body?.Data?.Phrases?.[0]
    if (!phrase) return null

    return {
      description: phrase.Description ?? '',
      name: phrase.Name ?? '',
      wordWeights: (phrase.WordWeights ?? {}) as Record<string, number>,
    }
  }

  async getPhrase(phraseId: string): Promise<void> {
    if (!this.client) return

    const phrase = await this.fetchPhrase(phraseId)
    if (!phrase) {
      console.log(`未查询到词表 ${phraseId}`)
      return
    }

    console.log(`词表名称: ${phrase.name || '-'}`)
    console.log(`词表ID: ${phraseId}`)
    if (phrase.description) console.log(`描述: ${phrase.description}`)

    const entries = Object.entries(phrase.wordWeights)
    console.log(`热词 (共 ${entries.length} 个):`)
    for (const [word, weight] of entries) {
      console.log(`  - ${word}: ${weight}`)
    }
  }
  // #endregion

  // #region 列举热词词表
  async listPhrases(): Promise<void> {
    if (!this.client) return

    const phrases = await this.getPhrases()
    console.log(`共 ${phrases.length} 个词表:`)
    for (const p of phrases) {
      console.log(`  - ${p.name ?? '-'}  [id: ${p.phraseId ?? '-'}]  ${p.description ?? ''}`)
    }
  }
  // #endregion

  // #region 删除热词词表
  async deletePhrases(phraseId: string): Promise<void> {
    if (!this.client) return

    const res = await wrap('删除热词词表', async () => this.client.deleteTranscriptionPhrases(phraseId))
    if (!res) return

    console.log(`词表 ${phraseId} 已删除`)
  }
  // #endregion

  // #region 更新热词词表
  async updatePhrases(options: UpdatePhrasesOptions): Promise<void> {
    if (!this.client) return

    const request = new UpdateTranscriptionPhrasesRequest({
      name: options.name,
      wordWeights: JSON.stringify(options.wordWeights),
    })

    const res = await wrap('更新热词词表', async () => this.client.updateTranscriptionPhrases(options.phraseId, request))
    if (!res) return

    console.log(`词表 ${options.phraseId} 已更新`)
  }
  // #endregion
}
