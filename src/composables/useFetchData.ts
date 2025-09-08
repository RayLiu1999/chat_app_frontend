// 在 composables 資料夾中建立 useFetchData.js
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 這個 composable 用來封裝「發送請求並處理結果與訊息」的通用邏輯
export function useFetchData(fetchFunction: (...args: any[]) => Promise<any>) {
    const isLoading = ref(false)
    const error = ref<Error | null>(null)

    const fetchData = async (...args: any[]) => {
        isLoading.value = true
        error.value = null
        try {
            await fetchFunction(...args)
            // 如果 fetchFunction 成功，則不顯示訊息
        } catch (err: any) {
            error.value = err
            console.error(err)
            // ElMessage.error(err.message || '操作失敗，請稍後再試')
        } finally {
            isLoading.value = false
        }
    }

    return { isLoading, error, fetchData }
}