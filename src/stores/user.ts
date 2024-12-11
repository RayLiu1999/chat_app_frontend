import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, CSRFToken } from '@/types/auth'
import api from '@/api/axios'
import { generateRandomString } from '@/composables/utils'

export const useUserStore = defineStore('user', () => {
  const userData = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  /**
   * API Methods
   */

  // 登入
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post('/login', {
        email,
        password,
      })

      if (response.status !== 200) {
        throw new Error('Failed to login')
      }

      // const token = response.data.access_token
      // setAccessToken(token) // 設置 token
      // const userData = await fetchUser() // 取得 user
      // setUserData(userData) // 設置 user

      location.href = '/channels/@me'
    } catch (error) {
      console.error('Failed to login:', error)
    }
  }

  // 登出
  const logout = (): void => {
    api.post('/logout')
  }

  // 取得 user
  const fetchUser = async () => {
    try {
      const response = await api.get('/user')
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
    generateCSRFToken,
    refreshAccessToken,
    isAuthenticated,
  }
})
