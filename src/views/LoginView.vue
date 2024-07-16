<template>
  <RouterLink class="text-white" to="/chat">
    <div class="absolute top-8 left-8 flex items-center">
      <img alt="Chat Logo" src="/public/images/logo.png" width="48" class="h-auto" />
      <span class="text-2xl">Chat App</span>
    </div>
  </RouterLink>
  <div class="bg-gray-800 p-8 rounded-lg shadow-lg flex m-auto">
    <div class="mr-auto w-100">
      <h2 class="text-white text-2xl font-bold mb-2">歡迎回來！</h2>
      <p class="text-gray-400 mb-6">我們很高興又見到您了！</p>
      <form>
        <div class="mb-4">
          <label class="block text-gray-400 mb-1" for="email"> 電子郵件或電話號碼 </label>
          <input
            id="email"
            class="w-full p-2 bg-gray-700 text-white rounded"
            name="email"
            type="text"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-400 mb-1" for="password"> 密碼 </label>
          <input
            id="password"
            class="w-full p-2 bg-gray-700 text-white rounded"
            name="password"
            type="password"
          />
        </div>
        <div class="mb-4">
          <a class="text-blue-400" href="#"> 忘記您的密碼？ </a>
        </div>
        <button class="w-full bg-blue-600 text-white p-2 rounded hover-bg-blue-700">登入</button>
      </form>
      <div class="mt-4 text-gray-400">
        需要一個帳號？
        <RouterLink class="text-blue-400" to="/register">註冊</RouterLink>
      </div>
    </div>
  </div>
</template>
