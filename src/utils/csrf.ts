import { generateRandomString } from '@/utils/string'
import type { CSRFToken } from '@/types/auth'

// 生成 CSRF token
const generateCSRFToken = (): CSRFToken => {
  const csrfName: string = 'csrf_name_' + generateRandomString(10)
  const csrfValue: string = 'csrf_value_' + generateRandomString(50)

  // 設定 cookie with 10 seconds expiry
  const expiryDate = new Date(Date.now() + 10 * 1000)
  document.cookie = `${csrfName}=${csrfValue}; path=/; expires=${expiryDate.toUTCString()}`

  return {
    name: csrfName,
    value: csrfValue,
  }
}

export { generateCSRFToken }
