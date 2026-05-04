// 验证 CIDR 块格式
export function validateCidrBlock(cidr: string): boolean {
  if (!cidr) {
    return false
  }

  // 匹配 x.x.x.x/x 格式
  const pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/
  const match = cidr.match(pattern)

  if (!match) {
    return false
  }

  // 验证 IP 地址的每个部分是否在 0-255 范围内
  const ipParts = [1, 2, 3, 4].map((i) => Number.parseInt(match[i], 10))
  if (!ipParts.every((part) => part >= 0 && part <= 255)) {
    return false
  }

  // 验证子网掩码是否在 0-32 范围内
  const prefixLength = Number.parseInt(match[5], 10)
  if (prefixLength < 0 || prefixLength > 32) {
    return false
  }

  return true
}
