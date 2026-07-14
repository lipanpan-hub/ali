import {writeFileSync} from 'node:fs'

interface VttSentence {
  BeginTime?: number
  EndTime?: number
  Text?: string
}

interface VttWord {
  BeginTime?: number
  EndTime?: number
  Word?: string
}

export class VttConverter {
  // #region 将识别句子转换为带逐词时间戳的 VTT 字幕, 返回写入的字幕条数
  static convert(sentences: VttSentence[], words: VttWord[], outputPath: string): number {
    const blocks = sentences
      .filter((s) => typeof s.BeginTime === 'number' && typeof s.EndTime === 'number' && Boolean(s.Text))
      .map((s, index) => {
        const start = VttConverter.formatTime(s.BeginTime!)
        const end = VttConverter.formatTime(s.EndTime!)
        const payload = VttConverter.buildPayload(s, words)
        return `${index + 1}\n${start} --> ${end}\n${payload}`
      })

    const content = `WEBVTT\n\n${blocks.join('\n\n')}\n`
    writeFileSync(outputPath, content, 'utf8')
    return blocks.length
  }
  // #endregion

  // #region 为单句构造逐词时间戳内容, 无匹配词时回退为整句文本
  private static buildPayload(sentence: VttSentence, words: VttWord[]): string {
    const inRange = words.filter(
      (w) =>
        typeof w.BeginTime === 'number' &&
        Boolean(w.Word) &&
        w.BeginTime >= sentence.BeginTime! &&
        w.BeginTime < sentence.EndTime!,
    )
    if (inRange.length === 0) return sentence.Text!.trim()

    return inRange
      .map((w, index) => {
        const tag = `<${VttConverter.formatTime(w.BeginTime!)}>`
        const separator = index > 0 && VttConverter.startsWithAscii(w.Word!) ? ' ' : ''
        return `${separator}${tag}${w.Word}`
      })
      .join('')
  }
  // #endregion

  // #region 毫秒转 VTT 时间戳 HH:MM:SS.mmm
  private static formatTime(ms: number): string {
    const totalMs = Math.max(0, Math.floor(ms))
    const hours = Math.floor(totalMs / 3_600_000)
    const minutes = Math.floor((totalMs % 3_600_000) / 60_000)
    const seconds = Math.floor((totalMs % 60_000) / 1000)
    const millis = totalMs % 1000
    const pad = (value: number, length = 2): string => String(value).padStart(length, '0')
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(millis, 3)}`
  }
  // #endregion

  // #region 判断词是否以 ASCII 字母/数字开头 (用于英文单词间补空格)
  private static startsWithAscii(word: string): boolean {
    return /^[A-Za-z0-9]/.test(word)
  }
  // #endregion
}
