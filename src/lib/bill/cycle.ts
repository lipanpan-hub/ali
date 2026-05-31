// 账期工具: 默认账期为上个月, 并校验 YYYY-MM 格式

export function defaultBillingCycle(): string {
  const now = new Date()
  now.setDate(1)
  now.setMonth(now.getMonth() - 1)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function isValidBillingCycle(cycle: string): boolean {
  const match = /^(\d{4})-(\d{2})$/.exec(cycle)
  if (!match) return false
  const month = Number(match[2])
  return month >= 1 && month <= 12
}
