<template>
  <!-- Chat Area -->
  <div class="flex flex-1 flex-col">
    <!-- Chat Header -->
    <div class="bg-#080a28 flex items-center justify-between p-4">
      <div class="flex items-center space-x-2">
        <div class="default-image w-40px h-40px">
          <img alt="User" class="size-10 rounded-full" src="@/assets/images/user1.jpg" />
        </div>
        <span class="font-bold text-gray-200"> ホタル </span>
        <span class="text-gray-400"> | </span>
        <span class="text-gray-400"> LaplusDRKNESS, LapLusX </span>
      </div>
    </div>
    <!-- Chat Messages -->
    <el-scrollbar ref="scrollbarRef" :always="true" class="custom-scrollbar">
      <div ref="innerRef" class="bg-#080a28 flex-1 space-y-4 overflow-y-auto p-4">
        <div v-for="item in 10" :key="item" class="flex items-start space-x-2">
          <div class="default-image w-40px h-40px mr-2">
            <img
              alt="User"
              class="size-10 cursor-pointer rounded-full"
              src="@/assets/images/user1.jpg"
              @click="UserProfileVisible = true"
            />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-gray-300"> ホタル </span>
              <span class="text-gray-500"> 今天 21:15 </span>
            </div>
            <span class="text-gray-300">讚讚</span>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!-- Chat Input -->
    <div class="bg-#080a28 flex items-center space-x-2 p-4">
      <input
        class="bg-#14175a flex-1 rounded p-2 text-white"
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
  <div class="bg-#080a28 w-60 p-4">
    <div class="flex flex-col items-center">
      <div class="default-image w-40px h-40px">
        <img alt="User" class="mb-4 size-10 rounded-full" src="@/assets/images/user1.jpg" />
      </div>
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
  <UserProfileModal :modal-visible="UserProfileVisible" @update-visible="handleUpdate" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useChatStore } from '@/stores/chat'
  import UserProfileModal from '@/components/UserProfileModal.vue'

  // 使用 ref 來追蹤 UserProfileModal 的顯示狀態
  const UserProfileVisible = ref(false)

  // 使用 Pinia Store
  const chatStore = useChatStore()

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
</script>

<style scoped></style>
