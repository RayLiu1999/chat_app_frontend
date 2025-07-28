<template>
  <div class="channel-menu p-2">
    <!-- 文字頻道區塊 -->
    <div class="channel-category mb-4">
      <div class="category-header flex items-center justify-between px-2 py-1 hover:bg-#14175a rounded">
        <button 
          class="flex items-center text-xs font-semibold text-gray-400 hover:text-gray-300 transition-colors"
          @click="toggleTextChannels"
        >
          <i 
            class="bi mr-1 transition-transform duration-200" 
            :class="showTextChannels ? 'bi-chevron-down' : 'bi-chevron-right'"
          ></i>
          文字頻道
        </button>
        <button 
          class="text-gray-400 hover:text -white p-1 rounded transition-colors"
          @click="openCreateChannelDialog('text')"
          title="建立頻道"
        >
          <i class="bi bi-plus text-sm"></i>
        </button>
      </div>
      
      <div v-show="showTextChannels" class="channel-list mt-1">
        <div
          v-for="channel in textChannels"
          :key="channel.id"
          class="channel-item flex items-center px-2 py-1.5 mx-1 rounded cursor-pointer transition-all duration-200"
          :class="isCurrentChannel(channel.id) ? 'bg-#14175a text-white' : 'text-gray-300 hover:bg-#14175a hover:text-gray-100'"
          @click="selectChannel(channel)"
          @contextmenu.prevent="(event) => handleChannelRightClick(event, channel)"
        >
          <i class="bi bi-hash text-gray-400 mr-2 text-sm"></i>
          <span class="text-sm truncate">{{ channel.name }}</span>
        </div>
      </div>
    </div>

    <!-- 語音頻道區塊 -->
    <div class="channel-category">
      <div class="category-header flex items-center justify-between px-2 py-1 hover:bg-#14175a rounded">
        <button 
          class="flex items-center text-xs font-semibold text-gray-400 hover:text-gray-300 transition-colors"
          @click="toggleVoiceChannels"
        >
          <i 
            class="bi mr-1 transition-transform duration-200" 
            :class="showVoiceChannels ? 'bi-chevron-down' : 'bi-chevron-right'"
          ></i>
          語音頻道
        </button>
        <button 
          class="text-gray-400 hover:text-white p-1 rounded transition-colors"
          @click="openCreateChannelDialog('voice')"
          title="建立語音頻道"
        >
          <i class="bi bi-plus text-sm"></i>
        </button>
      </div>
      
      <div v-show="showVoiceChannels" class="channel-list mt-1">
        <div
          v-for="channel in voiceChannels"
          :key="channel.id"
          class="channel-item flex items-center px-2 py-1.5 mx-1 rounded cursor-pointer transition-all duration-200"
          :class="isCurrentChannel(channel.id) ? 'bg-#14175a text-white' : 'text-gray-300 hover:bg-#14175a hover:text-gray-100'"
          @click="selectChannel(channel)"
          @contextmenu.prevent="(event) => handleChannelRightClick(event, channel)"
        >
          <i class="bi bi-volume-up text-gray-400 mr-2 text-sm"></i>
          <span class="text-sm truncate">{{ channel.name }}</span>
        </div>
      </div>
    </div>

    <!-- 右鍵選單 -->
    <PositionMenu ref="menuRef">
      <template #item>
        <li @click="editChannel">
          <i class="bi bi-pencil mr-2"></i>編輯頻道
        </li>
        <li @click="deleteChannel" class="danger">
          <i class="bi bi-trash mr-2"></i>刪除頻道
        </li>
      </template>
    </PositionMenu>
  </div>

  <!-- 建立頻道對話框 -->
  <AddChannelDialog
    :dialog-visible="addChannelDialogVisible"
    :channel-type="selectedChannelType"
    @update-visible="handleAddChannelDialog"
    @create-channel="handleCreateChannel"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChannelStore } from '@/stores/channel'
import { useChatStore } from '@/stores/chat'
import type { Channel } from '@/types/chat'
import type { ChannelAPI } from '@/types/api'
import PositionMenu from './PositionMenu.vue'
import AddChannelDialog from './dialogs/AddChannelDialog.vue'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const channelStore = useChannelStore()
const chatStore = useChatStore()

// 響應式狀態
const showTextChannels = ref(true)
const showVoiceChannels = ref(true)
const addChannelDialogVisible = ref(false)
const selectedChannelType = ref<'text' | 'voice'>('text')
const selectedChannel = ref<Channel | null>(null)

// 右鍵選單引用
const menuRef = ref<InstanceType<typeof PositionMenu> | null>(null)

// 計算屬性
const textChannels = computed(() => channelStore.getGroupedChannels().text)
const voiceChannels = computed(() => channelStore.getGroupedChannels().voice)
const currentServerId = computed(() => route.params.server_id as string)
const currentChannelId = computed(() => route.params.channel_id as string)

// 判斷是否為當前頻道
const isCurrentChannel = (channelId: string): boolean => {
  return currentChannelId.value === channelId
}

// 切換頻道分類顯示
const toggleTextChannels = () => {
  showTextChannels.value = !showTextChannels.value
}

const toggleVoiceChannels = () => {
  showVoiceChannels.value = !showVoiceChannels.value
}

// 選擇頻道
const selectChannel = (channel: Channel) => {
  channelStore.setCurrentChannel(channel)
  router.push(`/channels/${channel.server_id}/${channel.id}`)
}

// 開啟建立頻道對話框
const openCreateChannelDialog = (type: 'text' | 'voice') => {
  selectedChannelType.value = type
  addChannelDialogVisible.value = true
}

// 處理建立頻道對話框顯示狀態
const handleAddChannelDialog = (value: boolean) => {
  addChannelDialogVisible.value = value
}

// 處理建立頻道
const handleCreateChannel = async (channelData: ChannelAPI.Request.Create) => {
  if (!currentServerId.value) return
  
  const newChannel = await channelStore.createChannel(currentServerId.value, channelData)
  if (newChannel) {
    addChannelDialogVisible.value = false
    // 自動跳轉到新建的頻道
    selectChannel(newChannel)
  }
}

// 處理頻道右鍵選單
const handleChannelRightClick = (event: MouseEvent, channel: Channel) => {
  event.stopPropagation()
  selectedChannel.value = channel
  
  menuRef.value?.showMenu({
    x: event.clientX,
    y: event.clientY
  })
}

// 編輯頻道
const editChannel = () => {
  if (!selectedChannel.value) return
  
  // TODO: 開啟編輯頻道對話框
  console.log('編輯頻道:', selectedChannel.value.name)
  menuRef.value?.hideMenu()
}

// 刪除頻道
const deleteChannel = async () => {
  if (!selectedChannel.value) return
  
  try {
    await ElMessageBox.confirm(
      `確定要刪除頻道「${selectedChannel.value.name}」嗎？此動作無法復原。`,
      '刪除頻道',
      {
        confirmButtonText: '刪除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    const success = await channelStore.deleteChannel(selectedChannel.value.id)
    if (success) {
      // 如果刪除的是當前頻道，跳轉到伺服器首頁
      if (isCurrentChannel(selectedChannel.value.id)) {
        router.push(`/channels/${currentServerId.value}`)
      }
    }
  } catch {
    // 使用者取消操作
  }
  
  menuRef.value?.hideMenu()
}

// 載入頻道列表
const loadChannels = async () => {
  if (currentServerId.value) {
    await channelStore.fetchServerChannels(currentServerId.value)
  }
}

// 監聽路由變化，載入對應伺服器的頻道
watch(
  () => currentServerId.value,
  async (newServerId) => {
    if (newServerId) {
      await loadChannels()
    } else {
      channelStore.clearChannels()
    }
  },
  { immediate: true }
)

// 元件掛載時載入頻道
// onMounted(() => {
//   loadChannels()
// })
</script>

<style lang="scss" scoped>
.channel-menu {
  .category-header {
    button {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      font-weight: 600;
    }
  }

  .channel-item {
    &:hover {
      .bi {
        color: #dcddde !important;
      }
    }

    &.bg-\#14175a {
      .bi {
        color: #dcddde;
      }
    }
  }

  .danger {
    color: #ed4245 !important;

    &:hover {
      background-color: #ed4245 !important;
      color: white !important;
    }
  }
}
</style>
