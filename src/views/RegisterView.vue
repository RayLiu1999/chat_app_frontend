<template>
  <div class="bg-#0d1245 flex h-screen w-screen items-center justify-center">
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
          <div class="mb-4" v-for="(item, index) in columns" :key="index">
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
              <span v-if="item.error" class="font-italic ml-1 text-red-400">- 必要</span>
            </label>
            <input
              :id="item.name"
              class="w-full rounded bg-gray-700 p-2 text-white"
              :name="item.name"
              :type="item.type"
              v-model="item.value"
            />
            <p class="text mt-1 text-sm">{{ item.remark }}</p>
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

  const router = useRouter()

  interface Column {
    label: string
    name: string
    type: string
    required: boolean
    value: string
    error: boolean
    remark: string
  }

  const columns = ref<Record<string, Column>>({
    email: {
      label: '電子郵件',
      name: 'email',
      type: 'email',
      required: true,
      value: '',
      error: false,
      remark: '',
    },
    display_name: {
      label: '顯示名稱',
      name: 'display_name',
      type: 'text',
      required: false,
      value: '',
      error: false,
      remark: '其他人會看見您的顯示名稱，可使用特殊字元和表情符號。',
    },
    username: {
      label: '使用者名稱',
      name: 'username',
      type: 'text',
      required: true,
      value: '',
      error: false,
      remark: '請只使用數字、字母、底線 _，或英文句號 (.)。',
    },
    password: {
      label: '密碼',
      name: 'password',
      type: 'password',
      required: true,
      value: '',
      error: false,
      remark: '',
    },
  })

  const handleSubmit = async (event: Event) => {
    event.preventDefault()

    let error = false

    // 檢查必填欄位
    for (const key in columns.value) {
      if (columns.value[key].required && !columns.value[key].value) {
        columns.value[key].error = true
        error = true
      } else {
        columns.value[key].error = false
      }
    }

    if (error) {
      return
    }

    try {
      api
        .post('/register', {
          email: columns.value.email.value,
          display_name: columns.value.display_name.value,
          username: columns.value.username.value,
          password: columns.value.password.value,
        })
        .then((response) => {
          console.log(response.data)
          // 註冊成功後，導向登入頁
          alert('註冊成功！')
          router.push({ path: '/login' })
        })
        .catch((error) => {
          console.error(error.response.data)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }
</script>
