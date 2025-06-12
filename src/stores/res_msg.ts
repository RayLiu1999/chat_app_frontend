import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 定義錯誤代碼對應的訊息
export interface ErrorCodeMap {
  [key: number]: string
}

// 預設錯誤訊息
const defaultErrorMessage = '發生未知錯誤，請稍後再試'

export const useResMsgStore = defineStore('response_message', () => {
  // 錯誤代碼映射表
  const errorCodeMap = ref<ErrorCodeMap>({
    // 通用錯誤
    1000: '操作失敗',
    1001: '請求參數錯誤',
    1002: '伺服器內部錯誤',
    
    // 認證錯誤
    2000: '未授權的請求',
    2001: '登入失敗，請檢查信箱或密碼',
    2002: '您的登入已過期，請重新登入',
    2003: '您沒有權限進行此操作',
    2004: '無效的 Token',
    
    // 使用者相關錯誤
    3000: '使用者不存在',
    3001: '該用戶名已被使用',
    3002: '該信箱已被使用',
    
    // 伺服器相關錯誤
    4000: '伺服器不存在',
    4001: '您沒有權限管理此伺服器',
    4002: '無法創建伺服器',
    
    // 頻道相關錯誤
    5000: '頻道不存在',
    5001: '無法創建頻道',
    
    // 訊息相關錯誤
    6000: '訊息發送失敗',
    6001: '無法獲取訊息歷史記錄',
  })

  /**
   * 獲取錯誤訊息
   * @param code 錯誤代碼
   * @param fallbackMessage 備用訊息，如果沒有對應的錯誤代碼
   * @returns 對應的錯誤訊息
   */
  const getErrorMessage = (code: number, fallbackMessage?: string): string => {
    return errorCodeMap.value[code] || fallbackMessage || defaultErrorMessage
  }

  /**
   * 顯示錯誤訊息
   * @param code 錯誤代碼
   * @param message 可選的自定義訊息，如果後端已提供
   */
  const showError = (code: number, message?: string) => {
    const errorMessage = message || getErrorMessage(code)
    ElMessage.error(errorMessage)
  }

  /**
   * 顯示成功訊息
   * @param message 成功訊息
   */
  const showSuccess = (message: string) => {
    ElMessage.success(message)
  }

  /**
   * 顯示警告訊息
   * @param message 警告訊息
   */
  const showWarning = (message: string) => {
    ElMessage.warning(message)
  }

  /**
   * 顯示資訊訊息
   * @param message 資訊訊息
   */
  const showInfo = (message: string) => {
    ElMessage.info(message)
  }

  /**
   * 添加或更新錯誤代碼對應的訊息
   * @param code 錯誤代碼
   * @param message 錯誤訊息
   */
  const addErrorCode = (code: number, message: string) => {
    errorCodeMap.value[code] = message
  }

  return {
    errorCodeMap,
    getErrorMessage,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    addErrorCode
  }
})
