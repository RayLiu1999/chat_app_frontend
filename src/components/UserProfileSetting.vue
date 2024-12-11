<template>
  <div class="mb-4 flex items-center justify-between">
    <h2 class="text text-2xl font-bold">個人資料</h2>
  </div>
  <!-- <div class="border-b-1 mb-4 flex space-x-4">
              <button class="text">使用者個人資料</button>
              <button class="text-gray-4">伺服器個人資料</button>
            </div> -->
  <div class="flex space-x-4">
    <div class="flex-1">
      <div class="border-b-1 border-gray-5 py-6">
        <label class="font-size-3 text-gray-4 mb-2 block"> 顯示名稱 </label>
        <input class="bg-gray-8 text w-full rounded p-2" type="text" value="育誠" />
      </div>
      <div class="border-b-1 border-b-1 border-gray-5 py-6">
        <label class="font-size-3 text-gray-4 mb-2 block"> 人稱代詞 </label>
        <input class="bg-gray-8 text w-full rounded p-2" placeholder="新增人稱代詞" type="text" />
      </div>
      <div class="border-b-1 border-gray-5 flex flex-col py-6">
        <label class="font-size-3 text-gray-4 mb-2 block"> 頭像 </label>
        <div class="space-x-3">
          <button class="bg-#513a9a hover:bg-#5f4d9c text rounded px-4 py-1.5">變更頭像</button>
          <a class="text px-4 py-1.5 hover:underline">移除頭像</a>
        </div>
      </div>
      <div class="border-b-1 border-gray-5 py-6">
        <label class="font-size-3 text-gray-4 mb-2 block">變更橫幅 </label>
        <button class="bg-#513a9a hover:bg-#5f4d9c text rounded px-4 py-1.5">變更橫幅</button>
      </div>
      <div class="py-6">
        <label class="font-size-3 text-gray-4 mb-2 block">變更橫幅 </label>
        <p class="text-gray-4">如有需要，您可以使用 markdown 語法和連結。</p>
        <div class="custom-textarea mt-3" contenteditable="true"></div>
      </div>
    </div>
    <div class="w-1/3">
      <label class="font-size-3 text-gray-4 mb-2 block">預覽</label>
      <div class="bg-#01013b h-60 rounded-lg border-2 border-white">
        <div class="relative">
          <div class="default-banner aspect-ratio-16/7 w-full">
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
        <div class="ml-2 pb-2 pl-2 pt-12">
          <div class="flex items-center">
            <span class="text mr-2 text-xl font-bold">ホタル</span>
            <span class="text"> laplus </span>
          </div>
          <p class="text mt-2">1234</p>
        </div>
      </div>
    </div>
  </div>
</template>
