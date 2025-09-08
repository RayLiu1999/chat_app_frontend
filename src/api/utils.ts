import type { APIResponse } from '@/types/api'
import { ElMessage } from 'element-plus'

/**
 * 檢查 API 回應是否為成功狀態
 */
export const isSuccessResponse = <T>(response: APIResponse<T>): response is APIResponse<T> & { status: 'success' } => {
    return response.status === 'success'
}

/**
 * 檢查 API 回應是否為錯誤狀態
 */
export const isErrorResponse = <T>(response: APIResponse<T>): response is APIResponse<T> & { status: 'error' } => {
    return response.status === 'error'
}

/**
 * 統一的 API 回應處理函數
 */
export const handleAPIResponse = <T>(response: APIResponse<T>, operation: string, showMessage: boolean = true): T => {
    if (isSuccessResponse(response)) {
        if (response.data !== undefined && response.data !== null) {
            return response.data
        }
        return {} as T // 如果沒有 data，返回一個空物件
    } else if (isErrorResponse(response)) {
        const errorMessage = response.message || `${operation}時發生未知錯誤`
        if (showMessage) {
            ElMessage.error(errorMessage)
        }
        throw new Error(errorMessage)
    } else {
        console.error(`${operation}: API 回應了非預期的狀態:`, (response as any).status)
        throw new Error('伺服器回應格式異常，請稍後再試')
    }
}

/**
 * 處理刪除操作的 API 回應
 */
export const handleDeleteResponse = <T>(response: APIResponse<T>, operation: string): void => {
    if (isSuccessResponse(response)) {
        // 刪除操作成功，不需要返回資料
        return
    } else if (isErrorResponse(response)) {
        const errorMessage = response.message || `${operation}時發生未知錯誤`
        throw new Error(errorMessage)
    } else {
        console.error(`${operation}: API 回應了非預期的狀態:`, (response as any).status)
        throw new Error('伺服器回應格式異常，請稍後再試')
    }
}