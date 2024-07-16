<template>
  <div class="flex h-screen w-100%">
    <!-- Sidebar -->
    <div class="w-20 bg-gray-950 flex flex-col items-center py-4">
      <div class="mb-4">
        <div class="rounded-lg size-10 bg-gray-500">
          <img alt="Chat Logo" src="/public/images/logo.png" width="40" class="h-auto" />
        </div>
      </div>
      <div class="flex flex-col space-y-4">
        <!-- <img alt="User class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
        <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" /> -->
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex flex-1">
      <!-- Channels List -->
      <div class="w-60 bg-gray-900 p-4">
        <div class="mb-4">
          <input
            class="w-full bg-gray-700 text-white p-2 rounded"
            placeholder="搜尋或開始一個對話"
            type="text"
            @click="console.log(123)"
          />
        </div>
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <i class="fas fa-user-friends text-gray-400"> </i>
            <span> 好友 </span>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-3 mb-1">私人訊息</p>
          <div class="flex items-center space-x-2 mb-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <span> ホタル </span>
          </div>
        </div>
      </div>
      <!-- Chat Area -->
      <div class="flex-1 flex flex-col">
        <!-- Chat Header -->
        <div class="flex items-center justify-between bg-gray-950 p-4">
          <div class="flex items-center space-x-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <span> ホタル </span>
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
        <div class="flex-1 bg-gray-950 p-4 space-y-4 overflow-y-auto">
          <div class="flex items-start space-x-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <div>
              <div class="flex items-center space-x-2">
                <span> ホタル </span>
                <span class="text-gray-400"> 今天 21:06 </span>
              </div>
              <div>看來很糟</div>
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <div>
              <div class="flex items-center space-x-2">
                <span> 雷電將軍 </span>
                <span class="text-gray-400"> 今天 21:06 </span>
              </div>
              <div>笑死</div>
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <div>
              <div class="flex items-center space-x-2">
                <span> ホタル </span>
                <span class="text-gray-400"> 今天 21:14 </span>
              </div>
              <img alt="Screenshot of a chat" src="https://placehold.co/200x300" />
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <div>
              <div class="flex items-center space-x-2">
                <span> 雷電將軍 </span>
                <span class="text-gray-400"> 今天 21:15 </span>
              </div>
              <div>讚喔</div>
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <div>
              <div class="flex items-center space-x-2">
                <span> ホタル </span>
                <span class="text-gray-400"> 今天 21:15 </span>
              </div>
              <div>claude給的</div>
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <div>
              <div class="flex items-center space-x-2">
                <span> 雷電將軍 </span>
                <span class="text-gray-400"> 今天 21:15 </span>
              </div>
              <div>我取叫AI做一個</div>
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <div>
              <div class="flex items-center space-x-2">
                <span> ホタル </span>
                <span class="text-gray-400"> 今天 21:15 </span>
              </div>
              <div>好屌喔</div>
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user2.png" />
            <div>
              <div class="flex items-center space-x-2">
                <span> 雷電將軍 </span>
                <span class="text-gray-400"> 今天 21:15 </span>
              </div>
              <div>XD</div>
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <div>
              <div class="flex items-center space-x-2">
                <span> ホタル </span>
                <span class="text-gray-400"> 今天 21:15 </span>
              </div>
              <div>讚我有超頭</div>
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <img alt="User" class="rounded-full size-10" src="/public/images/user1.jpg" />
            <div>
              <div class="flex items-center space-x-2">
                <span> ホタル </span>
                <span class="text-gray-400"> 今天 21:15 </span>
              </div>
              <div>讚讚</div>
            </div>
          </div>
        </div>
        <!-- Chat Input -->
        <div class="bg-gray-950 p-4 flex items-center space-x-2">
          <input
            class="flex-1 bg-gray-700 text-white p-2 rounded"
            placeholder="傳送訊息給 @ホタル"
            type="text"
          />
          <i class="fas fa-gift text-gray-400"> </i>
          <i class="fas fa-image text-gray-400"> </i>
          <i class="fas fa-smile text-gray-400"> </i>
        </div>
      </div>
      <!-- Userfo -->
      <div class="w-60 bg-gray-950 p-4">
        <div class="flex flex-col items-center">
          <img alt="User" class="rounded-full size-10 mb-4" src="/public/images/user1.jpg" />
          <div class="text-center">
            <div>ホタル</div>
            <div class="text-gray-400">ho_ta_ru_firefly</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-gray-400">啟動日期</div>
          <div>2018年10月18日</div>
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
</template>

<script lang="ts">
  // import { defineComponent } from 'vue'
  // import ChatSidebar from '@/components/ChatSidebar.vue'
  // import ChatMessages from '@/components/ChatMessages.vue'
  // import ChatInput from '@/components/ChatInput.vue'

  // export default defineComponent({
  //   name: 'ChatView',
  //   components: {
  //     ChatSidebar,
  //     ChatMessages,
  //     ChatInput
  //   }
  // })
</script>

<style scoped>
  /* .chat-container {
  display: flex;
  height: 100vh;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
} */
</style>
