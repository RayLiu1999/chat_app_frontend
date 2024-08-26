<template>
  <!-- Sidebar -->
  <div class="w-1/4 bg-gray-900 p-4">
    <div class="mb-4 text-gray-400">Discord</div>
    <ul class="space-y-2">
      <li class="font-size-m text-gray-400">使用者設定</li>
      <li class="text-white">我的帳號</li>
      <li class="text-white">個人資料</li>
      <li class="text-white">隱私 &amp; 安全</li>
      <li class="text-white">動態圖片</li>
      <li class="text-white">好友名單</li>
      <li class="text-gray-400">帳號設定</li>
      <li class="text-white">外觀</li>
      <li class="text-white">語音 &amp; 視訊</li>
      <li class="text-white">聊天</li>
      <li class="text-white">通知</li>
      <li class="text-white">快捷鍵</li>
      <li class="text-white">語言</li>
      <li class="text-white">Windows 設定</li>
      <li class="text-white">登出</li>
    </ul>
    <div class="mt-4 flex space-x-2">
      <i class="fab fa-twitter text-gray-400"> </i>
      <i class="fab fa-facebook text-gray-400"> </i>
      <i class="fab fa-instagram text-gray-400"> </i>
    </div>
  </div>
  <!-- Main Content -->
  <div class="w-100% w-3/4 bg-gray-950 p-8">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl text-white">個人資料</h1>
      <button class="text-gray-400">ESC</button>
    </div>
    <div class="mb-4 rounded bg-gray-700 p-4">
      <p class="text-white">使用者個人資料</p>
      <p class="text-gray-400">和應用程式個人資料</p>
    </div>
    <div class="mb-4 rounded bg-blue-600 p-4">
      <p class="text-white">幻獸的來襲！</p>
      <p class="text-white">幻想生物在這裡！快來看看我們的最新更新，讓您的伺服器變得更加有趣！</p>
      <button class="rounded bg-white px-4 py-2 text-blue-600">查看更新</button>
    </div>
    <div class="mb-4">
      <label class="mb-2 block text-gray-400"> 使用者名稱 </label>
      <input class="w-full rounded bg-gray-800 p-2 text-white" type="text" value="ホタル" />
    </div>
    <div class="mb-4">
      <label class="mb-2 block text-gray-400"> 人員標籤 </label>
      <input class="w-full rounded bg-gray-800 p-2 text-white" type="text" value="新導入標籤" />
    </div>
    <div class="mb-4 flex space-x-4">
      <button class="rounded bg-blue-600 px-4 py-2">變更使用者名稱</button>
      <button class="rounded bg-gray-600 px-4 py-2">移動標籤</button>
    </div>
    <div class="mb-4 flex space-x-4">
      <button class="rounded bg-blue-600 px-4 py-2">變更密碼</button>
    </div>
    <div class="mb-4 flex space-x-4">
      <button class="rounded bg-blue-600 px-4 py-2">變更個人資料</button>
    </div>
    <div class="mb-4">
      <label class="mb-2 block text-gray-400"> 個人資料顏色 </label>
      <input class="w-full rounded bg-gray-800 p-2 text-white" type="color" value="#ffffff" />
    </div>
    <div class="mb-4">
      <label class="mb-2 block text-gray-400"> 個人資料 </label>
      <textarea class="w-full rounded bg-gray-800 p-2 text-white" rows="4">
如果需要，您可以使用 markdown 語法來編輯。</textarea
      >
    </div>
    <div class="mb-4 flex items-center">
      <input class="mr-2" type="checkbox" />
      <label class="text-gray-400"> 顯示使用者名稱徽章 </label>
    </div>
    <div class="rounded bg-gray-800 p-4">
      <div class="flex items-center">
        <img
          alt="User avatar"
          class="mr-4 rounded-full"
          height="50"
          src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-uWFR54lIWVA7yRezzextf39j/user-AtGk5bMqB8NUGgpmjFHplPSj/img-mcU7JxVxoNeV26HEV7995CEI.png?st=2024-07-02T11%3A30%3A52Z&amp;se=2024-07-02T13%3A30%3A52Z&amp;sp=r&amp;sv=2023-11-03&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2024-07-02T02%3A09%3A55Z&amp;ske=2024-07-03T02%3A09%3A55Z&amp;sks=b&amp;skv=2023-11-03&amp;sig=qCT/y/H2Gp4WZn/IUI5/jF9TGEiqLQJ2thFt1YHgW4M%3D"
          width="50"
        />
        <div>
          <p class="text-white">ホタル</p>
          <p class="text-gray-400">ho_ta_ru_firefly</p>
        </div>
      </div>
      <button class="mt-4 rounded bg-gray-600 px-4 py-2">更換範例</button>
    </div>
  </div>
</template>
