<template>
  <div class="bg-#0c0c31 flex h-screen w-screen items-center justify-center">
    <RouterLink class="text-white" to="/channels">
      <div class="absolute left-8 top-8 flex items-center">
        <span class="mr-1">
          <i class="bi bi-chat-dots-fill" style="font-size: 1.5rem; color: white"></i>
        </span>
        <span class="text-2xl">Chat App</span>
      </div>
    </RouterLink>
    <div class="rounded-lg bg-gray-800 p-8 shadow-lg">
      <div class="w-100 mr-auto">
        <h2 class="mb-4 text-2xl font-bold text-white">建立新帳號</h2>
        <form>
          <div v-for="(item, index) in columns" :key="index" class="mb-4">
            <label
              class="mb-1 block flex items-center"
              :for="item.name"
              :class="item.error ? 'text-red-400' : 'text-gray-400'"
            >
              {{ item.label }}
              <i
                v-if="item.required && !item.error"
                class="bi bi-asterisk"
                style="font-size: 0.4rem; margin-left: 0.25rem; color: red"
              ></i>
              <span v-if="item.error" class="font-italic ml-1 text-red-400"
                >- {{ item.errorMessage }}</span
              >
            </label>
            <input
              :id="item.name"
              v-model="item.value"
              class="w-full rounded bg-gray-700 p-2 text-white"
              :name="item.name"
              :type="item.type"
              :placeholder="item.placeholder"
            />
            <p class="text mt-1 text-sm text-gray-400">{{ item.remark }}</p>
          </div>
          <button
            class="hover-bg-blue-700 mt-2 w-full rounded bg-blue-600 p-2 text-white"
            @click="handleSubmit"
          >
            註冊
          </button>
        </form>
        <div class="mt-4 text-gray-400">
          <RouterLink class="text-blue-400" to="/login"> 已經有一個帳號？ </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import api from '@/api/axios'
  import { useResMsgStore } from '@/stores/res_msg'

  const router = useRouter()
  const resMsgStore = useResMsgStore()

  interface Column {
    label: string
    name: string
    type: string
    required: boolean
    value: string
    error: boolean
    errorMessage: string
    remark: string
    placeholder: string
  }

  const columns = ref<Record<string, Column>>({
    email: {
      label: '電子郵件',
      name: 'email',
      type: 'email',
      required: true,
      value: '',
      error: false,
      errorMessage: '必要',
      remark: '',
      placeholder: '請輸入電子信箱',
    },
    nick_name: {
      label: '顯示名稱',
      name: 'nick_name',
      type: 'text',
      required: false,
      value: '',
      error: false,
      errorMessage: '',
      remark: '其他人會看見您的顯示名稱，可使用特殊字元和表情符號。',
      placeholder: '請輸入顯示名稱（可選）',
    },
    username: {
      label: '使用者名稱',
      name: 'username',
      type: 'text',
      required: true,
      value: '',
      error: false,
      errorMessage: '必要',
      remark: '請只使用數字、字母、底線 _，或英文句號 (.)。',
      placeholder: '請輸入使用者名稱',
    },
    password: {
      label: '密碼',
      name: 'password',
      type: 'password',
      required: true,
      value: '',
      error: false,
      errorMessage: '必要',
      remark: '密碼需包含至少6個字元。',
      placeholder: '請輸入大於6位的密碼',
    },
  })

  const handleSubmit = async (event: Event) => {
    event.preventDefault()

    // 重置錯誤訊息
    for (const key in columns.value) {
      columns.value[key].error = false
      columns.value[key].errorMessage = ''
    }

    let error = false

    // 檢查必填欄位
    for (const key in columns.value) {
      if (columns.value[key].required && !columns.value[key].value) {
        columns.value[key].error = true
        columns.value[key].errorMessage = '此欄位為必填'
        error = true
      }
    }

    if (error) return

    // 驗證email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (columns.value.email.value && !emailRegex.test(columns.value.email.value)) {
      columns.value.email.error = true
      columns.value.email.errorMessage = '請輸入有效的電子郵件'
      return
    }

    // 驗證密碼
    if (columns.value.password.value && columns.value.password.value.length < 6) {
      columns.value.password.error = true
      columns.value.password.errorMessage = '密碼長度需大於6位'
      return
    }

    // 驗證使用者名稱
    const usernameRegex = /^[a-zA-Z0-9_.]+$/
    if (columns.value.username.value && !usernameRegex.test(columns.value.username.value)) {
      columns.value.username.error = true
      columns.value.username.errorMessage = '只能使用字母、數字、底線或句點'
      return
    }

    try {
      // 註冊請求
      await api
        .post('/register', {
          email: columns.value.email.value,
          nick_name: columns.value.nick_name.value || columns.value.username.value, // 如果沒有填寫顯示名稱，使用使用者名稱
          username: columns.value.username.value,
          password: columns.value.password.value,
        })
        .then(() => {
          // 註冊成功後，顯示成功訊息並導向登入頁
          resMsgStore.showSuccess('註冊成功！請使用新帳號登入')
          router.push({ path: '/login' })
        })
    } catch (error: any) {
      // 錯誤處理由 axios 攔截器處理，這裡處理特定業務邏輯錯誤
      if (error.response?.data) {
        const apiResponse = error.response.data

        // 檢查特定錯誤並更新對應欄位的錯誤訊息
        if (apiResponse.code === 3001) {
          // 使用者名稱已存在
          columns.value.username.error = true
          columns.value.username.errorMessage = '此使用者名稱已被使用'
        } else if (apiResponse.code === 3002) {
          // 電子郵件已存在
          columns.value.email.error = true
          columns.value.email.errorMessage = '此電子郵件已被使用'
        }
      }
    }
  }
</script>
