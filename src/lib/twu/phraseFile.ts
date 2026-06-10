import {readFileSync, writeFileSync} from 'node:fs'

export interface PhraseFile {
  description: string
  name: string
  wordWeights: Record<string, number>
}

// #region 解析热词词表文件 (校验失败抛 Error 由命令层捕获)
export function parsePhraseFile(file: string): PhraseFile {
  const raw: unknown = JSON.parse(readFileSync(file, 'utf8'))
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('文件格式错误, 应为 JSON 对象')
  }

  const obj = raw as Record<string, unknown>
  const weightsRaw = obj.wordWeights
  if (typeof weightsRaw !== 'object' || weightsRaw === null || Array.isArray(weightsRaw)) {
    throw new Error('缺少 wordWeights 字段或其格式错误')
  }

  const wordWeights: Record<string, number> = {}
  for (const [word, weight] of Object.entries(weightsRaw)) {
    if (!/^[1-5]$/.test(String(weight))) throw new Error(`热词「${word}」的权重无效 (需为 1-5 的整数)`)
    wordWeights[word] = Number(weight)
  }

  if (Object.keys(wordWeights).length === 0) throw new Error('wordWeights 不能为空')

  return {
    description: typeof obj.description === 'string' ? obj.description : '',
    name: typeof obj.name === 'string' ? obj.name : '',
    wordWeights,
  }
}
// #endregion

// #region 写入热词词表文件
export function writePhraseFile(file: string, data: PhraseFile): void {
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
}
// #endregion
