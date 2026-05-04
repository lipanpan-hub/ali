export function validateCidrBlock(cidr: string): boolean {
  if (!cidr) return false

  const pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/
  const match = pattern.exec(cidr)
  if (!match) return false

  const parts = [match[1], match[2], match[3], match[4]].map(Number)
  if (!parts.every((p) => p >= 0 && p <= 255)) return false

  const prefix = Number(match[5])
  return prefix >= 0 && prefix <= 32
}
