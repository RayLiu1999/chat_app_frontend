<template>
  <!-- Chat Area -->
  <div class="flex flex-1 flex-col">
    <!-- Chat Header -->
    <div class="bg-#080a28 flex items-center justify-between p-4">
      <div class="flex items-center space-x-2">
        <div class="default-image w-40px h-40px">
          <img alt="User" class="h-full w-full" src="@/assets/images/user1.jpg" />
        </div>
        <span class="text cursor-pointer font-bold"> ホタル </span>
        <span class="weak-text"> | </span>
        <span class="weak-text cursor-pointer"> LaplusDRKNESS, LapLusX </span>
      </div>
    </div>
    <!-- Chat Messages -->
    <el-scrollbar ref="scrollbarRef" :always="true" class="custom-scrollbar">
      <div ref="innerRef" class="bg-#080a28 flex-1 space-y-4 overflow-y-auto p-4">
        <div v-for="item in 20" :key="item" class="flex items-start space-x-2">
          <div class="default-image w-40px h-40px mr-2">
            <img
              alt="User"
              class="h-full w-full cursor-pointer"
              src="@/assets/images/user1.jpg"
              @click="UserProfileVisible = true"
            />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text"> ホタル </span>
              <span class="weak-text"> 今天 21:15 </span>
            </div>
            <span class="text">讚讚</span>
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
  <!-- Userfo -->
  <div class="bg-#080a28 w-60 p-4">
    <div class="flex flex-col items-center">
      <div class="default-image w-40px h-40px">
        <img alt="User" class="mb-4 h-full w-full" src="@/assets/images/user1.jpg" />
      </div>
      <div class="text-center">
        <div class="weak-text">ホタル</div>
        <div class="weak-text">ho_ta_ru_firefly</div>
      </div>
    </div>
    <div class="mt-4">
      <div class="weak-text">啟動日期</div>
      <div class="weak-text">2018年10月18日</div>
    </div>
    <div class="mt-4">
      <div class="weak-text">10 個共同伺服器</div>
    </div>
    <div class="mt-4">
      <div class="weak-text">5 位共同好友</div>
    </div>
  </div>
  <UserProfileDialog :dialog-visible="UserProfileVisible" @update-visible="handleUpdate" />
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, nextTick } from 'vue'
  import { useChatStore } from '@/stores/chat'
  import { ElScrollbar } from 'element-plus'

  // 使用 Pinia Store
  const chatStore = useChatStore()

  // 使用 ref 來追蹤 UserProfileDialog 的顯示狀態
  const UserProfileVisible = ref(false)

  // 使用 ref 來追蹤 ElScrollbar 的實例
  const innerRef = ref<HTMLElement | null>(null)
  const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

  // 訊息列表
  const messages = ref([
    { id: 1, text: 'Hello' },
    { id: 2, text: 'How are you?' },
    { id: 3, text: 'I am fine, thank you!' },
    // 更多消息...
  ])

  // 更新 UserProfileDialog 的顯示狀態
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

    console.log(message)

    chatStore.addMessage({
      content: message,
      // userId: 'abc',
      timestamp: new Date().toISOString(),
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
    // background-color: #080a28;
  }
</style>
