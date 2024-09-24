import axios from 'axios'
import { useTokenStore } from '@/stores/token'
import type { CSRFToken } from '@/types/auth'
import { generateCSRFToken, refreshAccessToken, logout } from '@/composables/auth'

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN
let API_URL = ''
if (import.meta.env.ONLINE) {
  API_URL = 'https://' + API_DOMAIN
} else {
  API_URL = 'http://' + API_DOMAIN
}

const needsAuthRoutes = ['/auth']
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

// 用來發送失敗的請求
function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

// 添加失敗的請求到 refreshSubscribers 队列中
function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

// 創建 axios 實例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 設置請求攔截器，加入 access token
api.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore()
    const accessToken = tokenStore.accessToken

    // 判斷是否需要權限驗證的邏輯
    const needsAuth = needsAuthRoutes.some((path) => config.url?.startsWith(path))

    // get以外皆需要CSRF token
    if (config.method !== 'get') {
      const token = generateCSRFToken()
      const csrfToken: CSRFToken = {
        name: '',
        value: '',
      }
      csrfToken.name = token.name
      csrfToken.value = token.value
      config.headers['X-CSRF-Name'] = csrfToken.name
      config.headers['X-CSRF-Token'] = csrfToken.value
      config.withCredentials = true
    }

    // 如果需要權限驗證，加入 access token
    if (needsAuth) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 設置響應攔截器，處理 401 錯誤
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const originalRequest = config

    // 判斷是否需要權限驗證的邏輯
    const needsAuth = ['/login', '/register', '/profile'].some((path) =>
      config.url?.startsWith(path),
    )

    if (needsAuth && response.status === 401) {
      // 確保只針對特定路由重打刷新 token
      if (originalRequest.url !== '/auth/refresh') {
        if (!isRefreshing) {
          isRefreshing = true
          // 發送刷新 token 請求
          return refreshAccessToken()
            .then((newToken) => {
              isRefreshing = false
              onRefreshed(newToken) // 刷新後，通知其他等待的請求
              return api(originalRequest) // 重發失敗的請求
            })
            .catch(() => {
              isRefreshing = false
              logout() // 如果刷新失敗，登出
              return Promise.reject(error)
            })
        }

        // 如果已經在刷新過程中，等待 token 刷新
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken: string) => {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`
            resolve(api(originalRequest))
          })
        })
      }
    }

    return Promise.reject(error)
  },
)

export default api
