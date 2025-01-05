// 这里使用一个简单的加密方法，实际项目中建议使用更安全的加密算法
export function encrypt(str: string): string {
  return window.btoa(encodeURIComponent(str))
}

export function decrypt(str: string): string {
  try {
    return decodeURIComponent(window.atob(str))
  } catch {
    return ''
  }
} 