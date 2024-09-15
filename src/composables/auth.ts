import { generateRandomString } from './utils'
import type { CSRFToken } from '@/types/auth'

// 生成 CSRF token
export function generateCSRFToken(): CSRFToken {
  const csrfName: string = 'csrf_name_' + generateRandomString(10)
  const csrfValue: string = 'csrf_value_' + generateRandomString(50)

  document.cookie = `${csrfName}=${csrfValue}; path=/`

  return {
    name: csrfName,
    value: csrfValue,
  }
}
