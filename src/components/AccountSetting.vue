<template>
  <div class="mb-4 flex items-center justify-between">
    <h2 class="text text-2xl font-bold">我的帳號</h2>
  </div>
  <div class="bg-#01013b rounded-lg border-2 border-white pb-3">
    <div class="relative">
      <div class="default-banner aspect-ratio-16/3 w-full">
        <img
          alt="Background image with hands and a claw"
          class="h-full w-full rounded-t-lg object-cover"
          src="@/assets/images/GTFy9B3aQAAz2JI.jpg"
        />
      </div>
      <div class="bottom--48px absolute left-4 flex items-center space-x-2">
        <img
          alt="Profile picture"
          class="w-80px h-80px border-#0e0b17 rounded-full border-4"
          src="@/assets/images/user1.jpg"
        />
      </div>
    </div>
    <div class="px-4 pb-2 pt-12">
      <div class="flex items-center justify-between">
        <span class="text mr-2 text-xl font-bold">ホタル</span>
        <button class="bg-#513a9a hover:bg-#5f4d9c text rounded px-4 py-1.5">
          編輯使用者個人資料
        </button>
      </div>
      <div class="bg-#333354 mt-4 rounded-lg p-4">
        <div class="pb-2">
          <label class="font-size-3 text-gray-4 block">顯示名稱</label>
          <div class="flex items-center justify-between">
            <span class="text text-gray-3">ホタル</span>
            <button class="bg-gray-6 hover:bg-gray-5 text rounded px-4 py-1.5">編輯</button>
          </div>
        </div>
        <div class="pb-2">
          <label class="font-size-3 text-gray-4 block">使用者名稱</label>
          <div class="flex items-center justify-between">
            <span class="text text-gray-3">ho_ta_ru_firefly</span>
            <button class="bg-gray-6 hover:bg-gray-5 text rounded px-4 py-1.5">編輯</button>
          </div>
        </div>
        <div class="pb-2">
          <label class="font-size-3 text-gray-4 block">電子郵件</label>
          <div class="flex items-center justify-between">
            <span class="text text-gray-3">123qwe@gmail.com</span>
            <button class="bg-gray-6 hover:bg-gray-5 text rounded px-4 py-1.5">編輯</button>
          </div>
        </div>
        <div class="pb-2">
          <label class="font-size-3 text-gray-4 block">電話號碼</label>
          <div class="flex items-center justify-between">
            <span class="text text-gray-3">0912345678</span>
            <button class="bg-gray-6 hover:bg-gray-5 text rounded px-4 py-1.5">編輯</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-4 flex-1">
    <h3 class="text text-xl font-bold">密碼</h3>
    <div class="flex flex-col py-4">
      <div class="space-x-3">
        <button class="bg-#513a9a hover:bg-#5f4d9c text rounded px-4 py-1.5">更改密碼</button>
      </div>
    </div>
    <div class="py-4">
      <h3 class="font-size-3 text-gray-4 mb-2 block">移除帳號</h3>
      <span class="text text-gray-4">停用帳號表示您在採取此動作後可以隨時恢復帳號。</span>
      <div class="flex space-x-3 pt-3">
        <button class="bg-red-6 hover:bg-red-8 text rounded px-4 py-1.5">停用帳號</button>
        <button class="outline-red-6 hover:bg-red-6 text rounded px-4 py-1.5 outline outline-1">
          刪除帳號
        </button>
      </div>
    </div>
  </div>
</template>
