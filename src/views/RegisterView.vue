<template>
  <RouterLink class="text-white" to="/chat">
    <div class="absolute top-8 left-8 flex items-center">
      <img alt="Chat Logo" src="/public/images/logo.png" width="48" class="h-auto" />
      <span class="text-2xl">Chat App</span>
    </div>
  </RouterLink>
  <div class="bg-gray-800 p-8 rounded-lg shadow-lg flex m-auto">
    <div class="mr-auto w-100">
      <h2 class="text-white text-2xl font-bold mb-4">建立新帳號</h2>
      <form>
        <div class="mb-4">
          <label class="block text-gray-400 mb-1" for="email"> 名稱 </label>
          <input
            id="email"
            class="w-full p-2 bg-gray-700 text-white rounded"
            name="email"
            type="text"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-400 mb-1" for="email"> 電子郵件 </label>
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
        <div class="mb-8">
          <label class="block text-gray-400 mb-1" for="confirm_password"> 密碼確認 </label>
          <input
            id="confirm_password"
            class="w-full p-2 bg-gray-700 text-white rounded"
            name="confirm_password"
            type="confirm_password"
          />
        </div>
        <button class="w-full bg-blue-600 text-white p-2 rounded hover-bg-blue-700">註冊</button>
      </form>
    </div>
  </div>
</template>

<script></script>
