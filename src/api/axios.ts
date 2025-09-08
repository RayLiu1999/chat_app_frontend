import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useResMsgStore } from '@/stores/res_msg'
import type { APIResponse } from '@/types/api'
import { ElMessage } from 'element-plus'

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN
let API_URL = ''

if (import.meta.env.VITE_ONLINE === 'true') {
  API_URL = 'https://' + API_DOMAIN
} else {
  API_URL = 'http://' + API_DOMAIN
}

// 需要權限驗證的路徑
const needsAuthRoutes = ['/user', '/logout', '/channels', '/servers', '/friends', '/dm_rooms']
// 需要 cookie 的路徑
const needCookieRoutes = ['/login', '/logout', '/refresh_token']

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
    const needCookie = needCookieRoutes.some((path) => config.url?.startsWith(path))

    // 如果需要權限驗證，加入 access token
    if (needsAuth) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }

    // 如果需要 cookie，加入 withCredentials
    if (needCookie) {
      config.withCredentials = true
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 設置響應攔截器，處理回應和錯誤
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { config, response } = error
    const originalRequest = config
    const userStore = useUserStore()

    // 處理沒有響應的情況（如網絡錯誤）
    if (!response) {
      ElMessage.error('網絡連接失敗，請檢查您的網絡連接')
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
            userStore.fetchLogout() // 如果刷新失敗，登出
            ElMessage.error('登入過期，請重新登入')
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

    // 對於其他狀態碼（400、403、404、500等），直接返回 response
    if (response.status >= 400 && response.status < 600) {
      // 處理 API 錯誤響應
      if (response.data) {
        const apiResponse = response.data as APIResponse
        
        // 根據 API 回應處理錯誤
        if (apiResponse.status === 'error') {
          // 系統錯誤訊息(統一在這邊顯示)
          if (apiResponse.details) {
            console.error(`系統錯誤: ${apiResponse.details}`);
          }
        }
      }

      // 將 error 轉換為正常的 response 物件返回
      return Promise.resolve({
        ...response,
        data: response.data
      })
    }

    return Promise.reject(response)
  },
)

export default api
