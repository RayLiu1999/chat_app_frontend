// src/api/axios.ts
import axios from 'axios'
import { useTokenStore } from '@/stores/token'
import type { CSRFToken } from '@/types/auth'
import { generateCSRFToken } from '@/composables/auth'

const API_URL = import.meta.env.VITE_API_URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 設置請求攔截器
api.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore()
    const accessToken = tokenStore.accessToken

    // 判斷是否需要權限驗證的邏輯
    const needsAuth = ['/login', '/register', '/profile'].some((path) =>
      config.url?.startsWith(path),
    )

    if (needsAuth) {
      const token = generateCSRFToken()
      const csrfToken: CSRFToken = {
        name: '',
        value: '',
      }
      csrfToken.name = token.name
      csrfToken.value = token.value

      config.headers['X-CSRF-Name'] = csrfToken.name
      config.headers['X-CSRF-Token'] = csrfToken.value
      config.headers['Authorization'] = `Bearer ${accessToken}`
      config.withCredentials = true
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 設置回應攔截器來處理 401 錯誤
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const tokenStore = useTokenStore()
    const accessToken = tokenStore.accessToken

    // if (error.response.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true
    //   try {
    //     const response = await axios.post(
    //       API_URL + '/refresh-token',
    //       {},
    //       {
    //         withCredentials: true,
    //       },
    //     )
    //     tokenStore.setAccessToken(response.data.access_token)

    //     originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
    //     return api(originalRequest)
    //   } catch (refreshError) {
    //     window.location.href = '/login'
    //   }
    // }
    return Promise.reject(error)
  },
)

export default api
