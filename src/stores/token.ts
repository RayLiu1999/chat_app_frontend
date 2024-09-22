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

  return {
    accessToken,
    setAccessToken,
    clearAccessToken,
  }
})
