import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  // 設置 user
  const setUser = (user: string) => {
    user.value = user
  }

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

  return {
    user,
    setUser,
    clearUser,
    accessToken,
    setAccessToken,
    clearAccessToken,
  }
})
