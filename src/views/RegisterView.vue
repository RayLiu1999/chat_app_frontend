<template>
  <div class="flex h-screen w-screen items-center justify-center">
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
          <div class="mb-4">
            <label class="mb-1 block text-gray-400" for="email"> 名稱 </label>
            <input
              id="email"
              class="w-full rounded bg-gray-700 p-2 text-white"
              name="email"
              type="text"
            />
          </div>
          <div class="mb-4">
            <label class="mb-1 block text-gray-400" for="email"> 電子郵件 </label>
            <input
              id="email"
              class="w-full rounded bg-gray-700 p-2 text-white"
              name="email"
              type="text"
            />
          </div>
          <div class="mb-4">
            <label class="mb-1 block text-gray-400" for="password"> 密碼 </label>
            <input
              id="password"
              class="w-full rounded bg-gray-700 p-2 text-white"
              name="password"
              type="password"
            />
          </div>
          <div class="mb-8">
            <label class="mb-1 block text-gray-400" for="confirm_password"> 密碼確認 </label>
            <input
              id="confirm_password"
              class="w-full rounded bg-gray-700 p-2 text-white"
              name="confirm_password"
              type="confirm_password"
            />
          </div>
          <button class="hover-bg-blue-700 w-full rounded bg-blue-600 p-2 text-white">註冊</button>
        </form>
      </div>
    </div>
  </div>
</template>
