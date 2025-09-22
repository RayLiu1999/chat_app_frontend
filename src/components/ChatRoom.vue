<template>
  <div class="flex flex-1 flex-col">
    <!-- Chat Header -->
    <div class="bg-#080a28 flex items-center justify-between p-4">
      <div class="flex items-center space-x-2">
        <!-- DM Header -->
        <template v-if="roomType === 'dm'">
          <AvatarImage :src="dmRoom?.picture_url || ''" alt="User" size="sm" />
          <span class="text cursor-pointer font-bold">{{ dmRoom?.nickname }}</span>
        </template>
        
        <!-- Channel Header -->
        <template v-else-if="roomType === 'channel'">
          <i 
            class="text-gray-400 mr-2" 
            :class="currentChannel?.type === 'voice' ? 'bi bi-volume-up' : 'bi bi-hash'"
          ></i>
          <span class="text cursor-pointer font-bold">{{ currentChannel?.name }}</span>
        </template>
      </div>
      
      <!-- Channel Header Actions -->
      <div v-if="roomType === 'channel'" class="flex items-center space-x-2">
        <button 
          v-if="currentChannel?.type === 'voice'"
          class="text-gray-400 hover:text-white p-2 rounded transition-colors"
          title="加入語音頻道"
        >
          <i class="bi bi-telephone"></i>
        </button>
        <button 
          class="text-gray-400 hover:text-white p-2 rounded transition-colors"
          title="搜尋"
        >
          <i class="bi bi-search"></i>
        </button>
      </div>
    </div>

    <!-- Chat Messages -->
    <div ref="scrollbarRef" class="custom-scrollbar">
      <div ref="messagesListRef" class="bg-#080a28 px-4 messages-list">
        <div
          v-for="(message, idx) in messages"
          :key="message.id"
          class="message-item"
        >
          <!-- 日期標籤 (僅 DM 顯示) -->
          <div 
            v-if="roomType === 'dm' && isNewDate(idx, message)" 
            class="my-2 flex justify-center"
          >
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
    </div>

    <!-- Chat Input -->
    <div class="bg-#080a28 flex items-center space-x-2 p-4">
      <input
        class="bg-#14175a text flex-1 rounded p-2"
        :placeholder="inputPlaceholder"
        type="text"
        @keydown.enter="sendMessage($event)"
      />
      <i class="fas fa-gift weak-text"></i>
      <i class="fas fa-image weak-text"></i>
      <i class="fas fa-smile weak-text"></i>
    </div>
  </div>
  
  <UserProfileDialog :dialog-visible="UserProfileVisible" @update-visible="handleUpdate" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useChannelStore } from '@/stores/channel'
import { useServerStore } from '@/stores/server'
import { useUserStore } from '@/stores/user'
import { formatTimestamp, ymd, ymdHm, formatDateHeader } from '@/utils/time'
import type { Message } from '@/types/chat'
import AvatarImage from '@/components/AvatarImage.vue'
import UserProfileDialog from '@/components/dialogs/UserProfileDialog.vue'

// Props
interface Props {
  roomType: 'dm' | 'channel'
  roomId: string
}

const props = defineProps<Props>()

// Stores
const chatStore = useChatStore()
const channelStore = useChannelStore()
const serverStore = useServerStore()
const userStore = useUserStore()

// Route
const route = useRoute()

// Refs
const UserProfileVisible = ref(false)
const messagesListRef = ref<HTMLElement | null>(null)
const scrollbarRef = ref<HTMLElement | null>(null)
const loadingMore = ref(false)

// Computed
const messages = computed(() => chatStore.messages)
const userData = computed(() => userStore.userData)

const dmRoom = computed(() => {
  if (props.roomType === 'dm') {
    return chatStore.dmRooms.find((room) => room.room_id === props.roomId)
  }
  return null
})

const currentChannel = computed(() => {
  if (props.roomType === 'channel') {
    return channelStore.currentChannel
  }
  return null
})

const inputPlaceholder = computed(() => {
  if (props.roomType === 'dm' && dmRoom.value) {
    return `傳送訊息給 @${dmRoom.value.nickname}`
  } else if (props.roomType === 'channel' && currentChannel.value) {
    return `傳送訊息到 #${currentChannel.value.name}`
  }
  return '傳送訊息...'
})

// Methods
const handleUpdate = (value: boolean) => {
  UserProfileVisible.value = value
}

const sendMessage = (event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement
  const message = input.value

  input.value = ''

  if (!message || !props.roomId) {
    return
  }

  chatStore.sendMessage({
    room_type: props.roomType,
    room_id: props.roomId,
    content: message,
  })
}

const getMessageProfile = (message: Message): { nickname: string; picture_url: string } => {
  if (message.sender_id === userData.value?.id) {
    return {
      nickname: userData.value?.nickname || '',
      picture_url: userData.value?.picture_url || '',
    }
  }

  if (props.roomType === 'dm' && dmRoom.value) {
    return {
      nickname: dmRoom.value.nickname,
      picture_url: dmRoom.value.picture_url,
    }
  }

  // 對於 channel，從伺服器成員列表獲取用戶資料
  if (props.roomType === 'channel') {
    const member = serverStore.getMemberByUserId(message.sender_id)
    if (member) {
      return {
        nickname: member.nickname || member.username,
        picture_url: member.picture_url,
      }
    }
  }

  return {
    nickname: '未知用戶',
    picture_url: '/default-avatar.png',
  }
}

// 檢查是否為區塊的第一條訊息
const isFirstOfBlock = (idx: number, message: Message): boolean => {
  if (idx === 0) return true
  const prev = messages.value[idx - 1]
  if (!prev) return true

  if (props.roomType === 'dm') {
    return (
      prev.sender_id !== message.sender_id ||
      ymdHm(prev.timestamp) !== ymdHm(message.timestamp)
    )
  } else {
    // Channel 使用分鐘級別的區塊
    return (
      prev.sender_id !== message.sender_id ||
      Math.floor(prev.timestamp / 60) !== Math.floor(message.timestamp / 60)
    )
  }
}

// 檢查是否為新日期 (僅 DM 顯示)
const isNewDate = (idx: number, message: Message): boolean => {
  if (idx === 0) return true
  const prev = messages.value[idx - 1]
  if (!prev) return true

  return ymd(prev.timestamp) !== ymd(message.timestamp)
}

// 滾動相關
const scrollToBottom = async () => {
  if (!scrollbarRef.value) {
    console.warn('ChatRoom: scrollbarRef is null, skipping scroll')
    return
  }
  scrollbarRef.value.scrollTop = scrollbarRef.value.scrollHeight
}

// 確保在 DOM 更新後滾動到底部
const delayedScrollToBottom = async () => {
  await nextTick()
  await scrollToBottom()
}

// 檢查使用者是否接近底部
const isUserNearBottom = (): boolean => {
  if (!scrollbarRef.value) return true
  const threshold = 20
  return scrollbarRef.value.scrollTop + scrollbarRef.value.clientHeight >= scrollbarRef.value.scrollHeight - threshold
}

// 載入更多訊息 (僅 DM 支援)
const loadMore = async () => {
  if (props.roomType !== 'dm') return // 目前只支援 DM 的載入更多
  
  if (messages.value.length === 0 || messages.value.length % 50 !== 0) return
  if (loadingMore.value) return
  
  if (!scrollbarRef.value) {
    console.warn('ChatRoom: scrollbarRef is null, skipping loadMore')
    return
  }
  
  try {
    loadingMore.value = true
    const prevHeight = scrollbarRef.value.scrollHeight
    const topMsgId = messages.value[0].id
    
    await chatStore.fetchDMMessages({
      room_id: props.roomId,
      message_id: topMsgId,
      limit: 50,
    })
    
    await nextTick(() => {
      if (scrollbarRef.value) {
        const newHeight = scrollbarRef.value.scrollHeight
        scrollbarRef.value.scrollTop = newHeight - prevHeight
      }
    })
  } catch (error) {
    console.error('載入更多訊息失敗:', error)
  } finally {
    loadingMore.value = false
  }
}

// 初始化房間
const initializeRoom = async () => {
  // 檢查 roomId 是否有效
  if (!props.roomId) {
    console.warn('ChatRoom: roomId is empty, skipping initialization')
    return
  }

  try {
    // 加入房間
    await chatStore.joinRoom({
      room_type: props.roomType,
      room_id: props.roomId,
    })

    // 載入訊息
    if (props.roomType === 'dm') {
      await chatStore.fetchDMMessages({
        room_id: props.roomId,
        limit: 50,
      })
    } else if (props.roomType === 'channel') {
      // 設定當前頻道
      await channelStore.fetchChannel(props.roomId)
      
      // 獲取伺服器ID並載入伺服器詳細資訊
      const channel = currentChannel.value
      if (channel?.server_id) {
        await serverStore.fetchServerDetail(channel.server_id)
      }
      
      // 載入頻道訊息
      await chatStore.fetchChannelMessages({
        room_id: props.roomId,
        limit: 50,
      })
    }

    await delayedScrollToBottom()
  } catch (error) {
    console.error(error)
  }
}

// Lifecycle
onMounted(async () => {
  if (props.roomId) {
    await initializeRoom()

    // 只為 DM 添加滾動監聽器
    if (props.roomType === 'dm') {
      if (scrollbarRef.value) {
        scrollbarRef.value.addEventListener('scroll', () => {
          if (scrollbarRef.value && scrollbarRef.value.scrollTop === 0) {
            loadMore()
          }
        })
      }
    }
  }
})

onUnmounted(() => {
  // 移除了 resize 監聽器
})

// Watchers
watch(() => messages.value.length, async () => {
  if (isUserNearBottom()) {
    await delayedScrollToBottom()
  }
})

watch(() => props.roomId, async (newRoomId) => {
  if (newRoomId) {
    await initializeRoom()
  }
})
</script>

<style lang="scss" scoped>
.custom-scrollbar {
  height: calc(100vh - 120px);
  overflow-y: auto;
  
  // Firefox 支援
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);

  // 自訂卷軸樣式
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
}

.messages-list {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 120px); // 確保至少填滿容器高度
  justify-content: flex-end; // 訊息貼底部
  padding-bottom: 4px; // 添加一點底部間距
}
</style>
