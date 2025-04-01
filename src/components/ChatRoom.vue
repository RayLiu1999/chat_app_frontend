<template>
  <!-- Chat Area -->
  <div class="flex flex-1 flex-col">
    <!-- Chat Header -->
    <div class="bg-#080a28 flex items-center justify-between p-4">
      <div class="flex items-center space-x-2">
        <div class="default-image size-6">
          <img alt="User" class="size-6" src="@/assets/images/user1.jpg" />
        </div>
        <span class="text cursor-pointer font-bold"> ホタル </span>
        <span class="weak-text"> | </span>
        <span class="weak-text cursor-pointer"> LaplusDRKNESS, LapLusX </span>
      </div>
    </div>
    <!-- Chat Messages -->
    <el-scrollbar ref="scrollbarRef" :always="true" class="custom-scrollbar">
      <div ref="innerRef" class="bg-#080a28 flex-1 space-y-4 overflow-y-auto p-4">
        <div
          v-for="message in messages"
          :key="message.timestamp"
          class="flex items-start space-x-2"
        >
          <div class="default-image mr-2 size-10">
            <img
              alt="User"
              class="size-10 cursor-pointer"
              src="@/assets/images/user1.jpg"
              @click="UserProfileVisible = true"
            />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text">{{ message.username }}</span>
              <span class="weak-text"></span>
              {{ new Date(message.timestamp).toLocaleTimeString() }}
            </div>
            <span class="text">{{ message.text }}</span>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!-- Chat Input -->
    <div class="bg-#080a28 flex items-center space-x-2 p-4">
      <input
        class="bg-#14175a text flex-1 rounded p-2"
        placeholder="傳送訊息給 @ホタル"
        type="text"
        @keydown.enter="sendMessage($event)"
      />
      <i class="fas fa-gift weak-text"> </i>
      <i class="fas fa-image weak-text"> </i>
      <i class="fas fa-smile weak-text"> </i>
    </div>
  </div>
  <UserProfileDialog :dialog-visible="UserProfileVisible" @update-visible="handleUpdate" />
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, nextTick } from 'vue'
  import { useChatStore } from '@/stores/chat'
  import { useUserStore } from '@/stores/user'
  import { ElScrollbar } from 'element-plus'

  // 使用 Pinia Store
  const chatStore = useChatStore()
  const userStore = useUserStore()

  // 使用 ref 來追蹤 UserProfileDialog 的顯示狀態
  const UserProfileVisible = ref(false)

  // 使用 ref 來追蹤 ElScrollbar 的實例
  const innerRef = ref<HTMLElement | null>(null)
  const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

  const messages = chatStore.messages

  // 更新 UserProfileDialog 的顯示狀態
  const handleUpdate = (value: boolean) => {
    UserProfileVisible.value = value
  }

  // 發送訊息
  const sendMessage = (event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement
    const message = input.value

    // 清空輸入框
    input.value = ''

    if (!message) {
      return
    }

    chatStore.sendMessage({
      type: 'dm',
      room_id: 'fdssd',
      user_id: userStore!.userData!.id,
      text: message,
      timestamp: Date.now(),
    })
  }

  // 卷軸捲到底部
  const scrollToBottom = async () => {
    scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
  }

  const delayedScrollToBottom = async () => {
    await nextTick()
    await scrollToBottom()
  }

  onMounted(async () => {
    await delayedScrollToBottom()
  })

  watch(messages, async (newMessages, oldMessages) => {
    delayedScrollToBottom()
  })
</script>

<style lang="scss">
  .custom-scrollbar {
    //background-color: #080a28;
  }
</style>
