<template>
  <!-- Chat Area -->
  <div class="flex flex-1 flex-col">
    <!-- Chat Header -->
    <div class="bg-#080a28 flex items-center justify-between p-4">
      <div class="flex items-center space-x-2">
        <AvatarImage :src="dmRoom?.picture_url" alt="User" size="sm" />
        <span class="text cursor-pointer font-bold"> {{ dmRoom?.nickname }} </span>
      </div>
    </div>
    <!-- Chat Messages -->
    <el-scrollbar ref="scrollbarRef" :always="true" class="custom-scrollbar">
      <div ref="innerRef" class="bg-#080a28 flex-1 overflow-y-auto px-4">
        <div
          v-for="(message, idx) in messages"
          :key="message.id"
          class="message-item"
        >
          <!-- 日期標籤 -->
          <div v-if="isNewDate(idx, message)" class="my-2 flex justify-center">
            <span class="weak-text text-xs">{{ formatDateHeader(message.timestamp) }}</span>
          </div>

          <div
            class="flex items-start space-x-1"
            :class="{ 'mt-3': isFirstOfBlock(idx, message) }"
          >
            <div class="mr-2 w-10 flex-shrink-0 cursor-pointer">
              <AvatarImage
                v-if="isFirstOfBlock(idx, message)"
                :src="getMessageProfile(message).picture_url"
                alt="User"
                size="md"
                @click="UserProfileVisible = true"
              />
            </div>
            <div>
              <div v-if="isFirstOfBlock(idx, message)" class="flex items-center space-x-2">
                <span class="text">{{ getMessageProfile(message).nickname }}</span>
                <span class="weak-text text-xs">{{ formatTimestamp(message.timestamp) }}</span>
              </div>
              <span class="text">{{ message.content }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!-- Chat Input -->
    <div class="bg-#080a28 flex items-center space-x-2 p-4">
      <input
        class="bg-#14175a text flex-1 rounded p-2"
        :placeholder="`傳送訊息給 @${dmRoom?.nickname}`"
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
  import { ref, onMounted, watch, computed, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import { useChatStore } from '@/stores/chat'
  import { useUserStore } from '@/stores/user'
  import { ElScrollbar } from 'element-plus'
  import { formatTimestamp, ymd, ymdHm, formatDateHeader } from '@/utils/time'
  import type { Message } from '@/types/chat'

  // 使用 Pinia Store
  const chatStore = useChatStore()
  const userStore = useUserStore()

  // 獲取當前路由信息
  const route = useRoute()
  const dmRoomId = route.params.dm_room_id as string

  // 使用 ref 來追蹤 UserProfileDialog 的顯示狀態
  const UserProfileVisible = ref(false)

  // 使用 ref 來追蹤 ElScrollbar 的實例
  const innerRef = ref<HTMLElement | null>(null)
  const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

  // 資料
  const messages = computed(() => chatStore.messages)

  // DM聊天室
  const dmRoom = computed(() => chatStore.dm_rooms.find((room) => room.room_id === dmRoomId))

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
      room_type: 'dm',
      room_id: dmRoomId,
      content: message,
    })
  }

  // 取得訊息個人資料
  const getMessageProfile = (message: Message): { nickname: string; picture_url: string } => {
    if (message.sender_id === userStore.userData?.id) {
      return {
        nickname: userStore.userData?.nickname || '',
        picture_url: userStore.userData?.pic_url || '',
      }
    }
    return {
      nickname: dmRoom.value?.nickname || '',
      picture_url: dmRoom.value?.picture_url || '',
    }
  }

  // 判斷是否為同一分鐘區塊的首條訊息
  const isFirstOfBlock = (idx: number, message: Message): boolean => {
    if (idx === 0) return true
    const prev = messages.value[idx - 1]
    if (!prev) return true

    return (
      prev.sender_id !== message.sender_id ||
      ymdHm(prev.timestamp) !== ymdHm(message.timestamp)
    )
  }

  // 是否為新日期
  const isNewDate = (idx: number, message: Message): boolean => {
    if (idx === 0) return true
    const prev = messages.value[idx - 1]
    if (!prev) return true

    return ymd(prev.timestamp) !== ymd(message.timestamp)
  }

  // 卷軸捲到底部
  const scrollToBottom = async () => {
    scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
  }

  // 延遲捲到底部
  const delayedScrollToBottom = async () => {
    await nextTick()
    await scrollToBottom()
  }

  const loadingMore = ref(false)

  const loadMore = async () => {
    // 僅當訊息數為 50 的倍數時才繼續請求（代表前一次抓取滿 50 筆）
    if (messages.value.length === 0 || messages.value.length % 50 !== 0) return
    if (loadingMore.value) return
    loadingMore.value = true
    const wrapper = scrollbarRef.value?.wrapRef as HTMLElement
    const prevHeight = wrapper.scrollHeight
    const topMsgId = messages.value[0].id // 假設 Message 裡有 id
    await chatStore.fetchDMMessages({
      room_id: dmRoomId,
      message_id: topMsgId,
      limit: 50,
    })
    // 保持卷軸位置不跳動
    await nextTick(() => {
      const newHeight = wrapper.scrollHeight
      wrapper.scrollTop = newHeight - prevHeight
    })
    loadingMore.value = false
  }

  onMounted(async () => {
    await chatStore.joinRoom({
      room_type: 'dm',
      room_id: dmRoomId,
    })
    await chatStore.fetchDMMessages({
      room_id: dmRoomId,
      limit: 50,
    })
    await delayedScrollToBottom()

    const wrapper = scrollbarRef.value?.wrapRef as HTMLElement
    wrapper.addEventListener('scroll', () => {
      if (wrapper.scrollTop === 0) {
        loadMore()
      }
    })
  })

  // 允許 20px 誤差
  const isUserNearBottom = (): boolean => {
    const wrapper = scrollbarRef.value?.wrapRef as HTMLElement | undefined
    if (!wrapper) return true // 尚未掛載前就直接回 true
    const threshold = 20
    return wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight - threshold
  }

  // 監聽訊息列表
  watch(
    () => messages.value.length,
    async () => {
      if (isUserNearBottom()) {
        await delayedScrollToBottom()
      }
    },
  )
</script>

<style lang="scss">
  .custom-scrollbar {
    //background-color: #080a28;
  }
</style>
