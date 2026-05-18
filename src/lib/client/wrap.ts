interface AliError {
  data?: {Recommend?: string}
  message?: string
}

export async function wrap<T>(action: string, fn: () => Promise<T>): Promise<null | T> {
  try {
    return await fn()
  } catch (error) {
    const e = error as AliError
    console.log(`${action}失败: ${e.message ?? '未知错误'}`)
    if (e.data?.Recommend) console.log(`诊断建议: ${e.data.Recommend}`)
    return null
  }
}
