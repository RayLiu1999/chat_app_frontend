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
        <h2 class="mb-2 text-2xl font-bold text-white">歡迎回來！</h2>
        <p class="mb-6 text-gray-400">我們很高興又見到您了！</p>
        <form>
          <div class="mb-4">
            <label class="mb-1 block text-gray-400" for="email"> 電子郵件或電話號碼 </label>
            <input
              id="email"
              v-model="email"
              class="w-full rounded bg-gray-700 p-2 text-white"
              name="email"
              type="text"
            />
          </div>
          <div class="mb-4">
            <label class="mb-1 block text-gray-400" for="password"> 密碼 </label>
            <input
              id="password"
              v-model="password"
              class="w-full rounded bg-gray-700 p-2 text-white"
              name="password"
              type="password"
            />
          </div>
          <div class="mb-4">
            <a class="text-blue-400" href="#"> 忘記您的密碼？ </a>
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
          <RouterLink class="text-blue-400" to="/register">註冊</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, inject } from 'vue'
  import { RouterLink } from 'vue-router'
  import type { CSRFToken } from '@/types/auth'
  import { generateCSRFToken } from '@/composables/auth'
  import axios from 'axios'

  const email = ref('')
  const password = ref('')
  const csrfToken: CSRFToken = {
    name: '',
    value: '',
  }

  const token = generateCSRFToken()
  csrfToken.name = token.name
  csrfToken.value = token.value

  const handleSubmit = async (event: Event) => {
    event.preventDefault()
    try {
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/login`,
          {
            username: email.value,
            password: password.value,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-NAME': csrfToken.name,
              'X-CSRF-TOKEN': csrfToken.value,
            },
            withCredentials: true,
          },
        )
        .then((response) => {
          console.log(response)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }
</script>
