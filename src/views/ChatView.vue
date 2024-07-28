<template>
  <div class="flex h-screen w-100%">
    <!-- Sidebar -->
    <div class="w-16 bg-#161f73 flex flex-col items-center py-4 relative">
      <div>
        <div class="flex items-center">
          <div class="absolute w-3px h-30px bg-white rounded left-0"></div>
          <el-tooltip effect="dark" content="私人訊息" placement="left-start">
            <div class="rounded-lg size-10 bg-#5865f2 cursor-pointer">
              <img alt="Chat Logo" src="/public/images/logo.png" width="40" class="h-auto" />
            </div>
          </el-tooltip>
        </div>
        <hr class="my-2 border-t border-white-300" />
      </div>
      <div class="flex flex-col space-y-4">
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex flex-1">
      <!-- Channels List -->
      <div class="w-60 bg-#0d1245 p-4">
        <div class="mb-4">
          <input
            class="w-full bg-#14175a text-white p-2 rounded"
            placeholder="搜尋或開始一個對話"
            type="text"
            @click="console.log(123)"
          />
        </div>
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <i class="fas fa-user-friends text-gray-400"> </i>
            <span class="text-gray-400"> 好友 </span>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-gray-400 text-3 mb-1">私人訊息</p>
          <div class="flex items-center space-x-2 mb-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <span class="text-gray-400"> ホタル </span>
          </div>
        </div>
      </div>
      <!-- Chat Area -->
      <div class="flex-1 flex flex-col">
        <!-- Chat Header -->
        <div class="flex items-center justify-between bg-#080a28 p-4">
          <div class="flex items-center space-x-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <span class="text-gray-200 font-bold"> ホタル </span>
            <span class="text-gray-400"> | </span>
            <span class="text-gray-400"> LaplusDRKNESS, LapLusX </span>
          </div>
          <div class="flex items-center space-x-4">
            <i class="fas fa-phone text-gray-400"> </i>
            <i class="fas fa-video text-gray-400"> </i>
            <i class="fas fa-user-plus text-gray-400"> </i>
            <i class="fas fa-cog text-gray-400"> </i>
          </div>
        </div>
        <!-- Chat Messages -->
        <el-scrollbar ref="scrollbarRef" :always="true" class="custom-scrollbar">
          <div ref="innerRef" class="flex-1 bg-#080a28 p-4 space-y-4 overflow-y-auto">
            <div v-for="item in 20" :key="item" class="flex items-start space-x-2">
              <img
                alt="User"
                class="rounded-full size-10"
                src="/public/images/user1.jpg"
                @click="UserProfileVisible = true"
              />
              <div>
                <div class="flex items-center space-x-2">
                  <span> ホタル </span>
                  <span class="text-gray-400"> 今天 21:15 </span>
                </div>
                <div>讚讚</div>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <!-- Chat Input -->
        <div class="bg-#080a28 p-4 flex items-center space-x-2">
          <input
            class="flex-1 bg-#14175a text-white p-2 rounded"
            placeholder="傳送訊息給 @ホタル"
            type="text"
            @keydown.enter="sendMessage($event)"
          />
          <i class="fas fa-gift text-gray-400"> </i>
          <i class="fas fa-image text-gray-400"> </i>
          <i class="fas fa-smile text-gray-400"> </i>
        </div>
      </div>
      <!-- Userfo -->
      <div class="w-60 bg-#080a28 p-4">
        <div class="flex flex-col items-center">
          <img alt="User" class="rounded-full size-10 mb-4" src="/public/images/user1.jpg" />
          <div class="text-center">
            <div class="text-gray-400">ホタル</div>
            <div class="text-gray-400">ho_ta_ru_firefly</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-gray-400">啟動日期</div>
          <div class="text-gray-400">2018年10月18日</div>
        </div>
        <div class="mt-4">
          <div class="text-gray-400">10 個共同伺服器</div>
        </div>
        <div class="mt-4">
          <div class="text-gray-400">5 位共同好友</div>
        </div>
      </div>
    </div>
  </div>
  <UserProfileModal :modal-visible="UserProfileVisible" @update-visible="handleUpdate" />
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, nextTick } from 'vue'
  import { useChatStore } from '@/stores/chat'
  import { ElScrollbar } from 'element-plus'
  // import ChatSidebar from '@/components/ChatSidebar.vue'
  // import ChatMessages from '@/components/ChatMessages.vue'
  // import ChatInput from '@/components/ChatInput.vue'
  import UserProfileModal from '@/components/UserProfileModal.vue'

  // 使用 ref 來追蹤 ElScrollbar 的實例
  const innerRef = ref<HTMLElement | null>(null)
  const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

  // 使用 ref 來追蹤 UserProfileModal 的顯示狀態
  const UserProfileVisible = ref(false)
  // 使用 Pinia Store
  const chatStore = useChatStore()

  // 訊息列表
  const messages = ref([
    { id: 1, text: 'Hello' },
    { id: 2, text: 'How are you?' },
    { id: 3, text: 'I am fine, thank you!' },
    // 更多消息...
  ])

  // 卷軸捲到底部
  const scrollToBottom = async () => {
    scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
  }

  const delayedScrollToBottom = async () => {
    await nextTick()
    await scrollToBottom()
  }

  // 更新 UserProfileModal 的顯示狀態
  const handleUpdate = (value: boolean) => {
    UserProfileVisible.value = value
  }

  // 發送訊息
  const sendMessage = (event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement
    const message = input.value

    if (!message) {
      return
    }

    chatStore.addMessage({
      id: 1,
      content: message,
      userId: 'abc',
      timestamp: new Date(),
    })
  }

  onMounted(async () => {
    await delayedScrollToBottom()
  })

  watch(messages, async (newMessages, oldMessages) => {
    delayedScrollToBottom()
  })
</script>

<style>
  .custom-scrollbar {
    background-color: #080a28;
  }
</style>
