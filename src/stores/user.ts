import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth'
import type { APIResponse } from '@/types/api'
import api from '@/api/axios'

export const useUserStore = defineStore('user', () => {
  const userData = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  /**
   * API Methods
   */

  // 登入
  const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post('/login', {
      email,
      password,
    }) as APIResponse

    // 設置 token
    setAccessToken(response.data.access_token)

    // 成功就跳轉到個人頁
    if (response.status === 'success') {
      location.href = '/channels/@me'
    }
  }

  // 登出
  const logout = (): void => {
    api.post('/logout')
    location.href = '/login'
  }

  // 取得 user
  const fetchUser = async () => {
    try {
      const response = await api.get('/user') as APIResponse
      userData.value = response.data

      return response.data
    } catch (error) {
      // 登出
      clearUserData()
      clearAccessToken()
      console.error('Failed to fetch user:', error)
      logout()
    }
  }

  /**
   * Methods
   */
  // 刷新 access token
  const refreshAccessToken = async (): Promise<string> => {
    try {
      const response = await api.post('/refresh_token')
      const token = response.data.access_token
      const userStore = useUserStore()
      userStore.setAccessToken(token)

      return token
    } catch (error) {
      // console.error('Failed to refresh access token:', error)
      throw error
    }
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
      // console.error('Invalid access token:', error)
      return false
    }
  }

  /**
   * 操作資料 Methods
   */
  // 設置 user
  const setUserData = (user: User) => {
    userData.value = user
  }

  // 清除 user
  const clearUserData = () => {
    userData.value = null
  }

  // 設置 token
  const setAccessToken = (token: string) => {
    accessToken.value = token
  }

  // 清除 token
  const clearAccessToken = () => {
    accessToken.value = null
  }

  return {
    // Data
    userData,
    accessToken,
    // API
    login,
    logout,
    fetchUser,
    // Methods
    setUserData,
    clearUserData,
    setAccessToken,
    clearAccessToken,
    refreshAccessToken,
    isAuthenticated,
  }
})
