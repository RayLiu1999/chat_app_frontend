<template>
  <el-dialog
    v-model="visible"
    title="Notice"
    destroy-on-close
    center
    :fullscreen="true"
    class="custom-dialog"
  >
    <div class="flex">
      <!-- Sidebar -->
      <div class="w-1/4 bg-gray-900 p-4">
        <div class="relative mb-4">
          <input class="w-full rounded bg-gray-700 p-2 text-white" placeholder="搜尋" type="text" />
          <i class="fas fa-search absolute right-3 top-3 text-gray-400"> </i>
        </div>
        <ul class="space-y-2">
          <li class="text-gray-400">使用者設定</li>
          <li class="text-white">我的帳號</li>
          <li class="rounded bg-gray-700 p-2 text-white">個人資料</li>
          <li class="text-white">隱私 &amp; 安全</li>
          <li class="text-white">家庭中心</li>
          <li class="text-white">已連結的應用程式</li>
          <li class="text-white">裝置</li>
          <li class="text-white">連接</li>
          <li class="text-white">簡單影片</li>
          <li class="text-white">好友請求</li>
          <li class="text-gray-400">帳單設定</li>
          <li class="text-white">Nitro</li>
          <li class="text-white">伺服器加成</li>
          <li class="text-white">訂閱</li>
          <li class="text-white">禮物庫存</li>
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
        </ul>
      </div>
      <!-- Main Content -->
      <div class="flex-1 p-6">
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-2xl">個人資料</h1>
          <button class="text-gray-400">
            <i class="fas fa-times"> </i>
            ESC
          </button>
        </div>
        <div class="mb-4 flex space-x-4">
          <button class="text-white">使用者個人資料</button>
          <button class="text-gray-400">伺服器個人資料</button>
        </div>
        <div class="mb-4 rounded bg-gray-700 p-4">
          <p class="text-white">是誰住在深海的大鳳梨裡？</p>
          <button class="rounded bg-blue-500 px-4 py-2 text-white">新佳商店</button>
        </div>
        <div class="flex space-x-4">
          <div class="flex-1">
            <div class="mb-4">
              <label class="mb-2 block text-gray-400"> 顯示名稱 </label>
              <input class="w-full rounded bg-gray-600 p-2 text-white" type="text" value="育誠" />
            </div>
            <div class="mb-4">
              <label class="mb-2 block text-gray-400"> 人稱代詞 </label>
              <input
                class="w-full rounded bg-gray-600 p-2 text-white"
                placeholder="新增人稱代詞"
                type="text"
              />
            </div>
            <div class="mb-4 flex space-x-4">
              <button class="rounded bg-blue-500 px-4 py-2 text-white">變更頭像</button>
              <button class="rounded bg-gray-600 px-4 py-2 text-white">移除頭像</button>
            </div>
            <div class="mb-4">
              <button class="rounded bg-gray-600 px-4 py-2 text-white">變更橫幅</button>
            </div>
            <div class="mb-4">
              <button class="rounded bg-gray-600 px-4 py-2 text-white">變更效果</button>
            </div>
            <div class="mb-4">
              <label class="mb-2 block text-gray-400"> 編輯顏色 </label>
              <div class="flex items-center space-x-2">
                <div class="h-6 w-6 rounded bg-purple-500"></div>
                <button class="rounded bg-gray-600 px-4 py-2 text-white">
                  <i class="fas fa-pencil-alt"> </i>
                </button>
              </div>
            </div>
            <div>
              <p class="text-gray-400">如有需要，您可以使用 markdown 語法和連結。</p>
            </div>
          </div>
          <div class="w-1/3 rounded bg-gray-700 p-4">
            <div class="mb-4 flex items-center space-x-4">
              <img
                alt="User avatar"
                class="h-12 w-12 rounded-full"
                height="50"
                src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-vAaFUEWeIeWH4izd8MxGj3hc/user-F57VAVRUh0uiunULOrnYiX4d/img-ItYjsVNwxuqzIg2sdnVG8ypV.png?st=2024-08-06T07%3A18%3A21Z&amp;se=2024-08-06T09%3A18%3A21Z&amp;sp=r&amp;sv=2023-11-03&amp;sr=b&amp;rscd=inline&amp;rsct=image/png&amp;skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&amp;sktid=a48cca56-e6da-484e-a814-9c849652bcb3&amp;skt=2024-08-06T00%3A45%3A21Z&amp;ske=2024-08-07T00%3A45%3A21Z&amp;sks=b&amp;skv=2023-11-03&amp;sig=KS5Na5BxfVOxwoayq8UsPG9PGaDZWVEyGcvaY4GDpcQ%3D"
                width="50"
              />
              <div>
                <p class="text-white">育誠</p>
                <p class="text-gray-400">ray5039</p>
              </div>
            </div>
            <button class="w-full rounded bg-gray-600 px-4 py-2 text-white">按鈕範例</button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { defineProps, ref, watch, defineEmits } from 'vue'

  const visible = ref(false)

  const props = defineProps<{
    dialogVisible: boolean
  }>()

  const emit = defineEmits<{
    (event: 'updateVisible', value: boolean): void
  }>()

  watch(
    () => props.dialogVisible,
    (newValue) => {
      visible.value = newValue
    },
  )

  watch(
    () => visible.value,
    (value) => {
      emit('updateVisible', value)
    },
  )
</script>
