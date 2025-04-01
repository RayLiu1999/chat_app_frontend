import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores/user'
import { useResMsgStore } from '@/stores/res_msg'
import type { CSRFToken } from '@/types/auth'
import type { APIResponse } from '@/types/api'

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN
let API_URL = ''
if (import.meta.env.ONLINE) {
  API_URL = 'https://' + API_DOMAIN
} else {
  API_URL = 'http://' + API_DOMAIN
}

const needsAuthRoutes = ['/user', '/logout', '/channels', '/servers']
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
})

// 設置請求攔截器，加入 access token
api.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const accessToken = userStore.accessToken
    const isFormData = config.data instanceof FormData// 檢查數據是否為 FormData

    // 如果不是 FormData，才手動設置 Content-Type
    if (!isFormData) {
      config.headers['Content-Type'] = 'application/json'
    }

    // 判斷是否需要權限驗證的邏輯
    const needsAuth = needsAuthRoutes.some((path) => config.url?.startsWith(path))

    // get以外皆需要CSRF token
    if (config.method !== 'get') {
      const token = userStore.generateCSRFToken()
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

// 設置響應攔截器，處理回應和錯誤
api.interceptors.response.use(
  (response) => {
    // 處理成功的回應
    const apiResponse = response.data as APIResponse
    
    // 如果是成功狀態且有消息，顯示成功消息
    if (apiResponse.status === 'success' && apiResponse.message && apiResponse.displayable) {
      const resMsgStore = useResMsgStore()
      resMsgStore.showSuccess(apiResponse.message)
    }
    
    // 直接返回 response.data，而不是整個 response 對象
    return response.data
  },
  async (error) => {
    const { config, response } = error
    const originalRequest = config
    const userStore = useUserStore()
    const resMsgStore = useResMsgStore()

    // 處理沒有響應的情況（如網絡錯誤）
    if (!response) {
      resMsgStore.showError(1002, '網絡連接失敗，請檢查您的網絡連接')
      return Promise.reject(error)
    }

    // 判斷是否需要權限驗證的邏輯
    const needsAuth = needsAuthRoutes.some((path) => config.url?.startsWith(path))

    // 處理 401 未授權錯誤
    if (needsAuth && response.status === 401 && originalRequest.url !== '/refresh_token') {
      // 如果不是正在刷新 token，嘗試刷新 token
      if (!isRefreshing) {
        isRefreshing = true
        // 發送刷新 token 請求
        return userStore
          .refreshAccessToken()
          .then((newToken) => {
            isRefreshing = false
            onRefreshed(newToken) // 刷新後，通知其他等待的請求
            return api(originalRequest) // 重發失敗的請求
          })
          .catch(() => {
            isRefreshing = false
            userStore.logout() // 如果刷新失敗，登出
            resMsgStore.showError(2002) // 顯示登入過期錯誤
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

    // 處理 API 錯誤響應
    if (response.data) {
      const apiResponse = response.data as APIResponse
      
      // 根據 API 回應處理錯誤
      if (apiResponse.status === 'error') {
        // 顯示對應錯誤訊息

        if (apiResponse.displayable) {
          resMsgStore.showError(apiResponse.code)
        }

        // 系統錯誤訊息
        console.error(`系統錯誤: ${apiResponse.message}`);
        
        // 特殊狀態碼處理
        if (apiResponse.code === 2002) { // Token 過期
          userStore.logout()
        }
      }
    } else {
      // 其他 HTTP 錯誤
      let errorCode = 1000 // 默認錯誤碼
      if (response.status === 403) errorCode = 2003 // 無權限
      else if (response.status === 404) errorCode = 1001 // 資源不存在
      else if (response.status >= 500) errorCode = 1002 // 伺服器錯誤
      
      resMsgStore.showError(errorCode)
    }

    return Promise.reject(error)
  },
)

export default api
