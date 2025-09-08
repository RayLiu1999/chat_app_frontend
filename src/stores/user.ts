import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth'
import type { APIResponse } from '@/types/api'
import api from '@/api/axios'
import { handleAPIResponse } from '@/api/utils'

export const useUserStore = defineStore('user', () => {
  const userData = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  /**
   * API Methods
   */

    // 登入
  const fetchLogin = async (userData: { email: string; password: string }): Promise<void> => {
    try {
      const { data: response } = await api.post<APIResponse<{ access_token: string }>>('/login', userData)
      const loginData = handleAPIResponse(response, '登入')
      
      setAccessToken(loginData.access_token)
    } catch (error) {
      throw error
    }
  }

  // 註冊
  const fetchRegister = async (userData: { username: string; nickname: string; password: string; email: string }): Promise<void> => {
    try {
      const { data: response } = await api.post<APIResponse<any>>('/register', userData)
      handleAPIResponse(response, '註冊')
    } catch (error) {
      throw error
    }
  }

  // 登出
  const fetchLogout = (): void => {
    api.post('/logout')
    location.href = '/login'
  }

  // 取得 user
  const fetchUser = async (): Promise<void> => {
    try {
      const { data: response } = await api.get<APIResponse<User>>('/user')
      const data = handleAPIResponse(response, '獲取使用者資料')
      userData.value = data
    } catch (error) {
      // 登出
      clearUserData()
      clearAccessToken()
      fetchLogout()
    }
  }

  /**
   * Methods
   */
  // 刷新 access token
  const refreshAccessToken = async (): Promise<string> => {
    try {
      const { data: response } = await api.post('/refresh_token')
      const token = response.data.access_token
      const userStore = useUserStore()
      userStore.setAccessToken(token)

      return token
    } catch (error) {
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
      console.error('無效的訪問令牌:', error)
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
    fetchLogin,
    fetchRegister,
    fetchLogout,
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
