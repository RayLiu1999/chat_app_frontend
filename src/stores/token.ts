import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token', () => {
  const accessToken = ref<string | null>(null)

  // 設置 token
  const setAccessToken = (token: string) => {
    accessToken.value = token
  }

  // 清除 token
  const clearAccessToken = () => {
    accessToken.value = null
  }

  // 判斷是否已經登入
  const isAuthenticated = computed((): boolean => {
    // 先判斷是否有 token
    if (!accessToken.value) {
      return false
    }

    try {
      // 判斷 token 是否過期
      const payload = accessToken.value.split('.')[1]
      const decodedPayload = JSON.parse(atob(payload))
      const expiresAt = decodedPayload.exp * 1000
      const now = Date.now()

      return now < expiresAt
    } catch (error) {
      // 如果解碼失敗，返回未驗證狀態
      console.error('Invalid access token:', error)
      return false
    }
  })

  return {
    accessToken,
    setAccessToken,
    clearAccessToken,
    isAuthenticated,
  }
})
