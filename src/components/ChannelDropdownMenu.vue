<template>
  <div ref="dropdown" class="dropdown">
    <div
      class="dropdown-btn text flex items-center justify-between font-semibold cursor-pointer"
      @click="toggleDropdown"
    >
      <span class="truncate">{{ displayServerName }}</span>
      <i 
        class="bi transition-transform duration-200 flex-shrink-0"
        :class="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"
      ></i>
    </div>
    <ul v-if="isOpen" class="dropdown-content text">
      <li 
        v-for="option in computedOptions" 
        :key="option.id"
        class="dropdown-item"
        :class="{ 'dangerous': option.isDangerous }"
        @click="handleOptionClick(option)"
      >
        <i v-if="option.icon" :class="option.icon" class="mr-2"></i>
        {{ option.label }}
      </li>
    </ul>
  </div>
  
  <!-- 建立頻道對話框 -->
  <AddChannelDialog
    :dialog-visible="showAddChannelDialog"
    @update-visible="handleAddChannelDialog"
    @create-channel="handleCreateChannel"
  />
  
  <!-- 確認對話框 -->
  <ConfirmDialog
    v-model:visible="showLeaveConfirmDialog"
    :title="confirmData.title"
    :message="confirmData.message"
    :type="confirmData.type"
    :confirm-text="confirmData.confirmText"
    @confirm="confirmData.onConfirm"
  />
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useServerStore } from '@/stores/server'
  import { useChannelStore } from '@/stores/channel'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import type { ChannelAPI } from '@/types/api'

  // 定義選項類型
  interface DropdownOption {
    id: string
    label: string
    icon?: string
    action?: () => void
    isDangerous?: boolean
  }

  // Props
  interface Props {
    serverId?: string
    serverName?: string
    options?: DropdownOption[]
  }

  const props = withDefaults(defineProps<Props>(), {
    serverName: 'Server Name',
    options: () => []
  })

  // Emits
  const emit = defineEmits<{
    optionClick: [option: DropdownOption]
  }>()

  // Stores and Router
  const serverStore = useServerStore()
  const channelStore = useChannelStore()
  const route = useRoute()
  const router = useRouter()

  // 響應式狀態
  const isOpen = ref(false)
  const showAddChannelDialog = ref(false)
  const showLeaveConfirmDialog = ref(false)
  const confirmData = ref<{
    title: string
    message: string
    type: 'info' | 'warning' | 'danger' | 'success'
    confirmText: string
    onConfirm: () => void
  }>({
    title: '',
    message: '',
    type: 'info',
    confirmText: '確認',
    onConfirm: () => {}
  })

  // 參考下拉選單 DOM 節點
  const dropdown = ref<HTMLDivElement | null>(null)

  // 計算當前伺服器 ID
  const currentServerId = computed(() => {
    return props.serverId || (route.params.server_id as string)
  })

  // 計算顯示的伺服器名稱
  const displayServerName = computed(() => {
    if (props.serverName && props.serverName !== 'Server Name') {
      return props.serverName
    }
    
    // 從 store 中獲取伺服器名稱
    const serverDetail = serverStore.currentServerDetail
    if (serverDetail) {
      return serverDetail.name
    }
    
    // 從伺服器列表中查找
    const server = serverStore.servers.find(s => s.id === currentServerId.value)
    return server?.name || 'Server Name'
  })

  // 預設選項
  const defaultOptions: DropdownOption[] = [
    {
      id: 'server-settings',
      label: '伺服器設定',
      icon: 'bi bi-gear-fill',
      action: () => handleServerSettings()
    },
    {
      id: 'invite-people',
      label: '邀請好友',
      icon: 'bi bi-person-plus-fill',
      action: () => handleInvitePeople()
    },
    {
      id: 'create-channel',
      label: '建立頻道',
      icon: 'bi bi-plus-circle-fill',
      action: () => handleAddChannelDialog()
    },
    {
      id: 'leave-server',
      label: '離開伺服器',
      icon: 'bi bi-box-arrow-right',
      action: () => handleLeaveServer(),
      isDangerous: true
    }
  ]

  // 計算選項列表
  const computedOptions = computed(() => {
    return props.options.length > 0 ? props.options : defaultOptions
  })

  // 切換下拉選單顯示與隱藏
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }

  // 關閉下拉選單
  const closeDropdown = () => {
    isOpen.value = false
  }

  // 處理選項點擊
  const handleOptionClick = (option: DropdownOption) => {
    // 執行選項的 action
    if (option.action) {
      option.action()
    }
    
    // 發送事件給父元件
    emit('optionClick', option)
    
    // 關閉下拉選單
    closeDropdown()
  }

  // 處理伺服器設定
  const handleServerSettings = () => {
    ElMessage.info('敬請期待此功能！')
  }

  // 處理邀請好友
  const handleInvitePeople = () => {
    ElMessage.info('敬請期待此功能！')
  }

  // 處理建立頻道
  const handleAddChannelDialog = () => {
    showAddChannelDialog.value = true
  }

  // 處理離開伺服器
  const handleLeaveServer = () => {
    confirmData.value = {
      title: '離開伺服器',
      message: '確定要離開此伺服器嗎？',
      type: 'danger',
      confirmText: '離開',
      onConfirm: confirmLeaveServer
    }
    showLeaveConfirmDialog.value = true
  }

  // 處理建立頻道
  const handleCreateChannel = async (channelData: ChannelAPI.Request.Create) => {
    if (!currentServerId.value) return

    try {
      const newChannel = await channelStore.fetchCreateChannel(currentServerId.value, channelData)
      showAddChannelDialog.value = false
      
      // 設為當前頻道並跳轉
      channelStore.setCurrentChannel(newChannel)
      router.push(`/channels/${newChannel.server_id}/${newChannel.id}`)
      
      ElMessage.success(`頻道 "${newChannel.name}" 建立成功`)
    } catch (error) {
      console.error('建立頻道失敗:', error)
    }
  }

  // 確認離開伺服器
  const confirmLeaveServer = async () => {
    try {
      if (!currentServerId.value) {
        ElMessage.error('無法取得伺服器 ID')
        return
      }

      await serverStore.fetchLeaveServer(currentServerId.value)
      ElMessage.success('已離開伺服器')
      
      // 跳轉到私人訊息頁面
      router.push('/channels/@me')
    } catch (error: any) {
      console.error('離開伺服器失敗:', error)
      ElMessage.error(error.message || '離開伺服器失敗')
    } finally {
      showLeaveConfirmDialog.value = false
    }
  }

  // 點擊外部時關閉下拉選單
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
      closeDropdown()
    }
  }

  // 按下 ESC 鍵關閉下拉選單
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeDropdown()
    }
  }

  // 掛載和卸載全域事件
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscapeKey)
  })
</script>

<style lang="scss" scoped>
  /* 下拉選單容器 */
  .dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  /* 下拉按鈕樣式 */
  .dropdown-btn {
    background-color: #0c0c31;
    padding: 12px 16px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.307);
    transition: all 0.2s ease;
    user-select: none;

    &:hover {
      background-color: #181d52;
      transform: translateY(-1px);
      box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.4);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
    }

    i {
      font-size: 14px;
      opacity: 0.8;
    }
  }

  /* 下拉內容樣式 */
  .dropdown-content {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #090c17;
    border-radius: 8px;
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    z-index: 1000;
    margin-top: 8px;
    padding: 8px 0;
    list-style: none;
    animation: dropdownFade 0.2s ease-out;

    /* 添加邊框和背景漸層 */
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(135deg, #090c17 0%, #0f1123 100%);
  }

  /* 下拉選項樣式 */
  .dropdown-item {
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      background-color: #363da2;
      color: #ffffff;
      transform: translateX(4px);
    }

    &:active {
      background-color: #2c3284;
      transform: translateX(2px);
    }

    /* 圖示樣式 */
    i {
      font-size: 16px;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }

    &:hover i {
      opacity: 1;
    }

    /* 危險選項樣式 */
    &.dangerous {
      color: #ff6b6b;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: 4px;
      
      &:hover {
        background-color: #dc3545;
        color: #ffffff;
        
        i {
          color: #ffffff;
        }
      }

      &:active {
        background-color: #c82333;
      }
    }
  }

  /* 動畫效果 */
  @keyframes dropdownFade {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* 響應式設計 */
  @media (max-width: 768px) {
    .dropdown-content {
      position: fixed;
      left: 16px;
      right: 16px;
      top: auto;
      bottom: 16px;
      margin-top: 0;
    }
  }

  /* 無障礙設計 */
  @media (prefers-reduced-motion: reduce) {
    .dropdown-content {
      animation: none;
    }
    
    .dropdown-btn,
    .dropdown-item {
      transition: none;
    }
  }

  /* 焦點樣式 */
  .dropdown-btn:focus-visible {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }

  .dropdown-item:focus-visible {
    outline: 2px solid #4f46e5;
    outline-offset: -2px;
  }
</style>
