<template>
  <div class="bg-#0c0c31 relative w-60" @contextmenu="handleRightClick">
    <div>
      <ChannelDropdownMenu :server-id="currentServerId" />
      <div class="mt-4">
        <ChannelVerticalMenu />
      </div>
    </div>
    <BottomBar />
  </div>
  <PositionMenu ref="menuRef">
    <template #item>
      <li @click="openCreateChannelDialog('text')">
        <i class="bi bi-hash mr-2"></i>建立文字頻道
      </li>
      <li @click="openCreateChannelDialog('voice')">
        <i class="bi bi-mic mr-2"></i>建立語音頻道
      </li>
      <li @click="createCategory">
        <i class="bi bi-folder-plus mr-2"></i>建立類別
      </li>
    </template>
  </PositionMenu>
  <!-- 建立頻道對話框 -->
  <AddChannelDialog
    :dialog-visible="addChannelDialogVisible"
    :channel-type="selectedChannelType"
    @update-visible="handleAddChannelDialog"
    @create-channel="handleCreateChannel"
  />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PositionMenu from './PositionMenu.vue'
import type { ChannelAPI } from '@/types/api'
import { useChannelStore } from '@/stores/channel'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const channelStore = useChannelStore()
const menuRef = ref<InstanceType<typeof PositionMenu> | null>(null)
const addChannelDialogVisible = ref(false)
const selectedChannelType = ref<'text' | 'voice'>('text')

// 計算當前伺服器 ID
const currentServerId = computed(() => route.params.server_id as string)

// 右鍵點擊處理
const handleRightClick = (event: MouseEvent) => {
  event.preventDefault()
  menuRef.value?.showMenu({
    x: event.clientX,
    y: event.clientY
  })
}

// 處理建立頻道對話框顯示狀態
const handleAddChannelDialog = (value: boolean) => {
  addChannelDialogVisible.value = value
}

// 開啟建立頻道對話框
const openCreateChannelDialog = (type: 'text' | 'voice') => {
  selectedChannelType.value = type
  addChannelDialogVisible.value = true
  menuRef.value?.hideMenu()
}

// 處理建立頻道
const handleCreateChannel = async (channelData: ChannelAPI.Request.Create) => {
  if (!currentServerId.value) return
  
  try {
    const newChannel = await channelStore.fetchCreateChannel(currentServerId.value, channelData)
    if (newChannel) {
      addChannelDialogVisible.value = false
      // 自動跳轉到新建的頻道
      channelStore.setCurrentChannel(newChannel)
      router.push(`/channels/${newChannel.server_id}/${newChannel.id}`)
    }
  } catch (error) {
    console.error('建立頻道失敗:', error)
  }
}

const createCategory = () => {
  ElMessage.info('敬請期待此功能！')
  menuRef.value?.hideMenu()
}
</script>

<style lang="scss" scoped>
.danger {
  color: #ed4245 !important;

  &:hover {
    background-color: #ed4245 !important;
    color: white !important;
  }
}
</style>
