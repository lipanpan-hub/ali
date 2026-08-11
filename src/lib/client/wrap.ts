interface AliError {
  data?: {Recommend?: string}
  message?: string
}

export async function wrap<T>(action: string, fn: () => Promise<T>): Promise<null | T> {
  // 统一包装阿里云 API 调用，捕获异常并打印友好的错误提示
  // action: 操作名称，用于错误信息前缀；fn: 实际执行的异步操作
  // 成功时返回 fn 的结果，失败时打印错误(含阿里云返回的诊断建议)并返回 null
  try {
    return await fn()
  } catch (error) {
    const e = error as AliError
    console.log(`${action}失败: ${e.message ?? '未知错误'}`)
    if (e.data?.Recommend) console.log(`诊断建议: ${e.data.Recommend}`)
    return null
  }
}
