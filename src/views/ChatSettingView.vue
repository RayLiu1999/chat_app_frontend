<template>
    <div class="flex">
      <!-- Sidebar -->
      <div class="w-1/4 bg-gray-800 p-4">
        <div class="text-gray-400 mb-4">Discord</div>
        <ul class="space-y-2">
          <li class="text-gray-400">使用者設定</li>
          <li class="text-white">我的帳號</li>
          <li class="text-white">個人資料</li>
          <li class="text-white">隱私 &amp; 安全</li>
          <li class="text-white">Family Center</li>
          <li class="text-white">已連結的應用程式</li>
          <li class="text-white">授權</li>
          <li class="text-white">建設</li>
          <li class="text-white">動態圖片</li>
          <li class="text-white">好友名單</li>
          <li class="text-gray-400">帳號設定</li>
          <li class="text-white">Nitro</li>
          <li class="text-white">伺服器加成</li>
          <li class="text-white">訂閱</li>
          <li class="text-white">儲物庫</li>
          <li class="text-white">帳單</li>
          <li class="text-gray-400">應用程式設定</li>
          <li class="text-white">外觀</li>
          <li class="text-white">輔助功能</li>
          <li class="text-white">語音 &amp; 視訊</li>
          <li class="text-white">聊天</li>
          <li class="text-white">通知</li>
          <li class="text-white">快捷鍵</li>
          <li class="text-white">語言</li>
          <li class="text-white">Windows 設定</li>
          <li class="text-white">直播模式</li>
          <li class="text-white">遊戲</li>
          <li class="text-white">遊戲活動</li>
          <li class="text-white">已連結遊戲</li>
          <li class="text-white">遊戲檢入介面</li>
          <li class="text-white">有什麼新功能？</li>
          <li class="text-white">迎接新會員</li>
          <li class="text-white">HypeSquad</li>
          <li class="text-white">登出</li>
        </ul>
        <div class="flex space-x-2 mt-4">
          <i class="fab fa-twitter text-gray-400"> </i>
          <i class="fab fa-facebook text-gray-400"> </i>
          <i class="fab fa-instagram text-gray-400"> </i>
        </div>
      </div>
      <!-- Main Content -->
      <div class="w-3/4 p-8">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl">個人資料</h1>
          <button class="text-gray-400">ESC</button>
        </div>
        <div class="bg-gray-700 p-4 rounded mb-4">
          <p class="text-white">使用者個人資料</p>
          <p class="text-gray-400">和應用程式個人資料</p>
        </div>
        <div class="bg-blue-600 p-4 rounded mb-4">
          <p class="text-white">幻獸的來襲！</p>
          <p class="text-white">
            幻想生物在這裡！快來看看我們的最新更新，讓您的伺服器變得更加有趣！
          </p>
          <button class="bg-white text-blue-600 px-4 py-2 rounded">查看更新</button>
        </div>
        <div class="mb-4">
          <label class="block text-gray-400 mb-2"> 使用者名稱 </label>
          <input class="w-full p-2 bg-gray-800 text-white rounded" type="text" value="ホタル" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-400 mb-2"> 人員標籤 </label>
          <input class="w-full p-2 bg-gray-800 text-white rounded" type="text" value="新導入標籤" />
        </div>
        <div class="flex space-x-4 mb-4">
          <button class="bg-blue-600 px-4 py-2 rounded">變更使用者名稱</button>
          <button class="bg-gray-600 px-4 py-2 rounded">移動標籤</button>
        </div>
        <div class="flex space-x-4 mb-4">
          <button class="bg-blue-600 px-4 py-2 rounded">變更密碼</button>
        </div>
        <div class="flex space-x-4 mb-4">
          <button class="bg-blue-600 px-4 py-2 rounded">變更個人資料</button>
        </div>
        <div class="mb-4">
          <label class="block text-gray-400 mb-2"> 個人資料顏色 </label>
          <input class="w-full p-2 bg-gray-800 text-white rounded" type="color" value="#ffffff" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-400 mb-2"> 個人資料 </label>
          <textarea class="w-full p-2 bg-gray-800 text-white rounded" rows="4">
如果需要，您可以使用 markdown 語法來編輯。</textarea
          >
        </div>
        <div class="flex items-center mb-4">
          <input class="mr-2" type="checkbox" />
          <label class="text-gray-400"> 顯示使用者名稱徽章 </label>
        </div>
        <div class="bg-gray-800 p-4 rounded">
          <div class="flex items-center">
            <img
              alt="User avatar"
              class="rounded-full mr-4"
              height="50"
              src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-uWFR54lIWVA7yRezzextf39j/user-AtGk5bMqB8NUGgpmjFHplPSj/img-mcU7JxVxoNeV26HEV7995CEI.png?st=2024-07-02T11%3A30%3A52Z&amp;se=2024-07-02T13%3A30%3A52Z&amp;sp=r&amp;sv=2023-11-03&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2024-07-02T02%3A09%3A55Z&amp;ske=2024-07-03T02%3A09%3A55Z&amp;sks=b&amp;skv=2023-11-03&amp;sig=qCT/y/H2Gp4WZn/IUI5/jF9TGEiqLQJ2thFt1YHgW4M%3D"
              width="50"
            />
            <div>
              <p class="text-white">ホタル</p>
              <p class="text-gray-400">ho_ta_ru_firefly</p>
            </div>
          </div>
          <button class="bg-gray-600 px-4 py-2 rounded mt-4">更換範例</button>
        </div>
      </div>
    </div>
</template>
