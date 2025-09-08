/**
 * 響應訊息處理 Store
 * #TODO: 暫時未使用
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 定義錯誤代碼對應的訊息
export interface ErrorCodeMap {
  [key: string]: string
}

// 預設錯誤訊息
const defaultErrorMessage = '發生未知錯誤，請稍後再試'

export const useResMsgStore = defineStore('response_message', () => {
  // 錯誤代碼映射表
  const errorCodeMap = ref<ErrorCodeMap>({
    // 通用錯誤
    OPERATION_FAILED: '操作失敗',
    INVALID_PARAMS: '請求參數錯誤',
    INTERNAL_SERVER: '伺服器內部錯誤',
    NOT_FOUND: '找不到資源',
    FORBIDDEN: '禁止訪問',

    // 認證相關錯誤
    UNAUTHORIZED: '未授權的請求',
    LOGIN_FAILED: '登入失敗',
    LOGIN_EXPIRED: '登入已過期',
    NO_PERMISSION: '無權限操作',
    INVALID_TOKEN: '無效的 Token',
    INVALID_ORIGIN: '無效的 Origin',

    // 使用者相關錯誤
    USER_NOT_FOUND: '使用者不存在',
    USERNAME_EXISTS: '用戶名已存在',
    EMAIL_EXISTS: '信箱已存在',

    // 好友相關錯誤
    FRIEND_EXISTS: '已是好友',
    FRIEND_REQUEST_EXISTS: '已有好友請求',
    FRIEND_REQUEST_NOT_FOUND: '好友請求不存在',
    NOT_FRIENDS: '不是好友',

    // 伺服器相關錯誤
    SERVER_NOT_FOUND: '伺服器不存在',
    NO_SERVER_PERMISSION: '無伺服器管理權限',
    CREATE_SERVER_FAILED: '創建伺服器失敗',

    // 頻道相關錯誤
    CHANNEL_NOT_FOUND: '頻道不存在',
    CREATE_CHANNEL_FAILED: '創建頻道失敗',

    // 訊息相關錯誤
    SEND_MESSAGE_FAILED: '訊息發送失敗',
    GET_MESSAGES_FAILED: '獲取訊息失敗',

    // 聊天室相關錯誤
    ROOM_NOT_FOUND: '聊天室不存在',
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
