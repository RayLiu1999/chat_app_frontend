import { generateRandomString } from './utils'
import type { CSRFToken } from '@/types/auth'
import api from '@/api/axios'
import { useUserStore } from '@/stores/user'

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

// 刷新 access token
export async function refreshAccessToken(): Promise<string> {
  try {
    const response = await api.post('/refresh_token')
    const token = response.data.access_token
    const userStore = useUserStore()
    userStore.setAccessToken(token)

    return token
  } catch (error) {
    console.error('Failed to refresh access token:', error)
    throw error
  }
}

export function logout(): void {
  api.post('/logout')
}

// 判斷目前是否有權限
export async function isAuthenticated(): Promise<boolean> {
  try {
    const userStore = useUserStore()
    const accessToken = userStore.accessToken

    // 判斷 token 是否過期
    if (accessToken) {
      const payload = accessToken.split('.')[1]
      const decodedPayload = JSON.parse(atob(payload))
      const expiresAt = decodedPayload.exp * 1000
      const now = Date.now()

      if (now < expiresAt) {
        return true
      }

      const token = await refreshAccessToken()
      if (token) {
        userStore.setAccessToken(token)
        return true
      } else {
        return false
      }
    } else {
      const token = await refreshAccessToken()
      if (token) {
        userStore.setAccessToken(token)
        return true
      } else {
        return false
      }
    }
  } catch (error) {
    // 如果解碼失敗，返回未驗證狀態
    console.error('Invalid access token:', error)
    return false
  }
}
