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
        <h2 class="mb-2 text-2xl font-bold text-white">歡迎回來！</h2>
        <p class="mb-6 text-gray-400">我們很高興又見到您了！</p>
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
              <span v-if="item.error" class="font-italic ml-1 text-red-400">- {{ item.errorMessage }}</span>
            </label>
            <input
              :id="item.name"
              v-model="item.value"
              class="w-full rounded bg-gray-700 p-2 text-white"
              :name="item.name"
              :type="item.type"
              :placeholder="item.placeholder"
            />
          </div>
          <button
            class="hover-bg-blue-700 w-full rounded bg-blue-600 p-2 text-white"
            @click="handleSubmit"
          >
            登入
          </button>
        </form>
        <div class="mt-4 text-gray-400">
          需要一個帳號？
          <RouterLink class="text-blue-400" to="/register"> 註冊 </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'

  const router = useRouter()

  interface Column {
    label: string
    name: string
    type: string
    required: boolean
    value: string
    error: boolean
    errorMessage: string
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
      placeholder: '請輸入電子信箱'
    },
    password: {
      label: '密碼',
      name: 'password',
      type: 'password',
      required: true,
      value: '',
      error: false,
      errorMessage: '必要',
      placeholder: '請輸入大於6位的密碼'
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
      } else {
        columns.value[key].error = false
      }
    }

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

    if (error) {
      return
    }

    // 登入
    const userStore = useUserStore()
    const res = await userStore.login(columns.value.email.value, columns.value.password.value)
    console.log(res)
  }
</script>
