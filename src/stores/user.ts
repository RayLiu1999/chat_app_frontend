import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, CSRFToken } from '@/types/auth'
import api from '@/api/axios'
import { generateRandomString } from '@/composables/utils'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  // 清除 user
  const clearUser = () => {
    user.value = null
  }

  // 設置 token
  const setAccessToken = (token: string) => {
    accessToken.value = token
  }

  // 清除 token
  const clearAccessToken = () => {
    accessToken.value = null
  }

  const fetchUser = async () => {
    try {
      const response = await api.get('/user')
      user.value = response.data
      console.log(user.value)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      throw error
    }
  }

  // 生成 CSRF token
  const generateCSRFToken = (): CSRFToken => {
    const csrfName: string = 'csrf_name_' + generateRandomString(10)
    const csrfValue: string = 'csrf_value_' + generateRandomString(50)

    document.cookie = `${csrfName}=${csrfValue}; path=/`

    return {
      name: csrfName,
      value: csrfValue,
    }
  }

  // 刷新 access token
  const refreshAccessToken = async (): Promise<string> => {
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

  const logout = (): void => {
    api.post('/logout')
  }

  // 判斷目前是否有權限
  const isAuthenticated = async (): Promise<boolean> => {
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

  return {
    user,
    clearUser,
    accessToken,
    setAccessToken,
    clearAccessToken,
    fetchUser,
    generateCSRFToken,
    refreshAccessToken,
    logout,
    isAuthenticated,
  }
})
