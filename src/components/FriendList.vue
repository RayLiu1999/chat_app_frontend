<template>
  <div class="bg-#080a28 text flex h-screen flex-1 flex-col">
    <!-- Top Navigation Bar -->
    <div class="bg-#080a28 flex items-center p-4">
      <div class="mr-2 flex space-x-2">
        <div class="flex items-center">
          <span class="weak-text mr-1">
            <i class="bi bi-person-fill" style="font-size: 1.4rem"></i>
          </span>
          <span class="text-whit font-bold">好友</span>
        </div>
        <div class="border-r border-gray-500 pl-2"></div>
      </div>
      <div class="flex space-x-4">
        <button class="hover:bg-#4d4e65f7 hover:text weak-text rounded px-1" :class="{ 'bg-#434459f7 hover:bg-#4d4e65f7 text': selectedStatus === 'online' }" @click="selectedStatus = 'online'">線上</button>
        <button class="hover:bg-#4d4e65f7 hover:text weak-text rounded px-1" :class="{ 'bg-#434459f7 hover:bg-#4d4e65f7 text': selectedStatus === 'all' }" @click="selectedStatus = 'all'">所有</button>
        <button class="hover:bg-#4d4e65f7 hover:text weak-text rounded px-1" :class="{ 'bg-#434459f7 hover:bg-#4d4e65f7 text': selectedStatus === 'pendingReceived' }" @click="selectedStatus = 'pendingReceived'">
          待接收請求
          <span v-if="friendStore.pendingFriends.received?.length > 0" class="ml-1 bg-red-500 text-white text-xs rounded-full px-1">
            {{ friendStore.pendingFriends.received.length }}
          </span>
        </button>
        <button class="hover:bg-#4d4e65f7 hover:text weak-text rounded px-1" :class="{ 'bg-#434459f7 hover:bg-#4d4e65f7 text': selectedStatus === 'pendingSent' }" @click="selectedStatus = 'pendingSent'">已寄出請求</button>
        <button class="hover:bg-#4d4e65f7 hover:text weak-text rounded px-1" :class="{ 'bg-#434459f7 hover:bg-#4d4e65f7 text': selectedStatus === 'blocked' }" @click="selectedStatus = 'blocked'">已封鎖</button>
        <button class="bg-#513a9a hover:bg-#5f4d9c text ml-auto rounded px-4 py-1" @click="selectedStatus = 'addFriend'">{{ selectedStatusList['addFriend'] }}</button>
      </div>
    </div>
    <!-- Search Bar -->
    <div v-if="selectedStatus !== 'addFriend'" class="flex items-center p-2">
      <input
        class="bg-#14175a text w-full rounded p-2"
        placeholder="搜尋"
        type="text"
        @contextmenu.stop
      />
    </div>
    <!-- Friends List -->
    <el-scrollbar :always="true">
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="selectedStatus !== 'addFriend'" class="weak-text mb-2">
          {{ selectedStatusList[selectedStatus] }} - {{ getStatusCount(selectedStatus) }}
        </div>
        
        <!-- 新增好友界面 -->
        <div v-if="selectedStatus === 'addFriend'" class="space-y-4">
          <div class="text-left mb-4">
            <div class="font-bold text-lg mb-2">新增好友</div>
            <div class="weak-text text-sm">您可以利用使用者名稱來新增好友。</div>
          </div>
          <el-form
            ref="addFriendFormRef"
            :model="addFriendForm"
            :rules="addFriendRules"
            class="flex space-x-2"
          >
            <el-form-item prop="username" class="flex-1 mb-0">
              <el-input
                v-model="addFriendForm.username"
                placeholder="請輸入使用者名稱"
                class="custom-input"
                @keydown.enter="sendFriendRequest"
              />
            </el-form-item>
            <el-button
              type="primary"
              class="add-friend-btn"
              :disabled="!addFriendForm.username.trim()"
              :loading="isAddingFriend"
              @click="sendFriendRequest"
            >
              傳送好友邀請
            </el-button>
          </el-form>
        </div>
        
        <!-- 好友列表 -->
        <div v-else class="space-y-4">
          <!-- Friend Item -->
          <div
            v-for="item in filteredFriends"
            :key="getItemKey(item)"
            class="flex items-center justify-between rounded p-2 transition hover:bg-#303457 dark:hover:bg-gray-700 cursor-pointer"
            @click="handleItemClick(item)"
          >
            <div class="flex items-center space-x-4">
              <AvatarImage 
                :src="item.picture_url" 
                alt="User" 
                size="md" 
                :status="getItemStatus(item)" 
              />
              <div>
                <div class="text">{{ item.nickname }}</div>
                <div class="weak-text text-sm">{{ getItemSubtext(item) }}</div>
              </div>
            </div>

            <!-- 待處理好友請求的按鈕 -->
            <div v-if="isFriendRequest(item)" class="flex space-x-2">
              <!-- 接收到的請求顯示接受/拒絕按鈕 -->
              <template v-if="item.requestType === 'received'">
                <el-tooltip content="接受好友請求" placement="top" :show-after="300">
                  <button @click.stop="acceptFriendRequest(item.request_id)" class="bg-green-600 hover:bg-green-700 text-white rounded-full p-1 w-7 h-7 flex items-center justify-center">
                    <i class="bi bi-check"></i>
                  </button>
                </el-tooltip>
                <el-tooltip content="拒絕好友請求" placement="top" :show-after="300">
                  <button @click.stop="rejectFriendRequest(item.request_id)" class="bg-red-600 hover:bg-red-700 text-white rounded-full p-1 w-7 h-7 flex items-center justify-center">
                    <i class="bi bi-x"></i>
                  </button>
                </el-tooltip>
              </template>
              <!-- 發送的請求顯示取消按鈕 -->
              <template v-else>
                <el-tooltip content="取消好友請求" placement="top" :show-after="300">
                  <button @click.stop="cancelFriendRequest(item.request_id)" class="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-1 w-7 h-7 flex items-center justify-center">
                    <i class="bi bi-x"></i>
                  </button>
                </el-tooltip>
              </template>
            </div>

            <!-- 封鎖用戶的解除封鎖按鈕 -->
            <div v-else-if="isBlockedUser(item)" class="flex space-x-2">
              <el-tooltip content="解除封鎖" placement="top" :show-after="300">
                <button @click.stop="unblockUser()" class="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 w-7 h-7 flex items-center justify-center">
                  <i class="bi bi-unlock"></i>
                </button>
              </el-tooltip>
            </div>

            <!-- 好友功能按鈕 -->
            <div v-else-if="isFriend(item)" class="flex items-center space-x-2 transition">
              <!-- 傳送訊息按鈕 -->
              <el-tooltip content="傳送訊息" placement="top" :show-after="300">
                <button
                  @click.stop="goToChat(item)"
                  class="bg-#080929 hover:bg-#080929 text rounded-full p-1 w-7 h-7 flex items-center justify-center group"
                >
                  <i class="bi bi-chat-fill group-hover:text-white transition-colors"></i>
                </button>
              </el-tooltip>
              <el-tooltip content="更多" placement="top" :show-after="300">
              <button 
                @click.stop="handleSelectClick($event, item)"
                class="bg-#080929 hover:bg-#080929 text rounded-full p-1 w-7 h-7 flex items-center justify-center group"
              >
                <i class="bi bi-three-dots-vertical group-hover:text-white transition-colors"></i>
              </button>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <PositionMenu ref="menuRef">
      <template #item>
        <li v-if="selectedFriend && isFriend(selectedFriend)" @click="startVoiceCall(selectedFriend)">開始語音通話</li>
        <li v-if="selectedFriend && isFriend(selectedFriend)" @click="startVideoCall(selectedFriend)">開始視訊通話</li>
        <li v-if="selectedFriend && isFriend(selectedFriend)" @click="blockUser()" class="danger">封鎖用戶</li>
        <li v-if="selectedFriend && isFriend(selectedFriend)" @click="removeFriend()" class="danger">移除好友</li>
      </template>
    </PositionMenu>
    
    <!-- 確認對話框 -->
    <ConfirmDialog
      v-model:visible="showConfirmDialog"
      :title="confirmData.title"
      :message="confirmData.message"
      :type="confirmData.type"
      :confirm-text="confirmData.confirmText"
      @confirm="confirmData.onConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted, reactive } from 'vue'
  import { useFriendStore } from '@/stores/friend'
  import { useChatStore } from '@/stores/chat'
  import type { Friend, FriendRequest, BlockedUser } from '@/types/auth'
  import { ElMessage, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  import { createValidationRules } from '@/utils/validate'
  import ConfirmDialog from './dialogs/ConfirmDialog.vue'
  import { useRouter } from 'vue-router'
  import PositionMenu from './PositionMenu.vue'
  import { ymd } from '@/utils/time'

  const router = useRouter()

  type StatusKey = 'all' | 'online' | 'pendingSent' | 'pendingReceived' | 'blocked' | 'addFriend'
  
  const selectedStatusList: Record<StatusKey, string> = {
    "all" : "所有",
    "online" : "線上",
    "pendingSent" : "已寄出請求",
    "pendingReceived" : "待接收請求",
    "blocked" : "已封鎖",
    "addFriend" : "新增好友"
  }

  const selectedStatus = ref<StatusKey>('online')
  const newFriendUsername = ref('')
  const addFriendFormRef = ref<FormInstance>()
  const isAddingFriend = ref(false)
  
  // 新增好友表單
  const addFriendForm = reactive({
    username: ''
  })
  
  // 新增好友驗證規則
  const addFriendRules = reactive({
    username: [
      createValidationRules.required('請輸入使用者名稱'),
      createValidationRules.username()
    ]
  })
  
  const showConfirmDialog = ref(false)
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
  
  // 選中的好友項目（用於更多選單）
  const selectedFriend = ref<Friend | FriendRequest | BlockedUser | null>(null)
  
  const friendStore = useFriendStore()
  const chatStore = useChatStore()
  
  // 根據選擇的狀態返回對應的資料
  const filteredFriends = computed(() => {
    switch (selectedStatus.value) {
      case 'all':
        // 所有已接受的好友
        return friendStore.friends || []
      case 'online':
        // 線上好友
        return friendStore.friends?.filter(friend => friend.is_online) || []
      case 'pendingReceived':
        // 接收到的好友請求
        return friendStore.pendingFriends.received?.map(req => ({ ...req, requestType: 'received' as const })) || []
      case 'pendingSent':
        // 發送的好友請求
        return friendStore.pendingFriends.sent?.map(req => ({ ...req, requestType: 'sent' as const })) || []
      case 'blocked':
        // 已封鎖用戶
        return friendStore.blockedUsers || []
      default:
        return []
    }
  })

  // 更多選單
  const tooltipDisable = ref(false)
  const menuRef = ref<InstanceType<typeof PositionMenu> | null>(null)

  onMounted(async () => {
    try {
      // 載入所有相關資料
      await Promise.all([
        friendStore.fetchFriends(),
        friendStore.fetchPendingFriends(),
        friendStore.fetchBlockedUsers()
      ])
    } catch (error) {
      console.error('載入好友資料失敗:', error)
    }
  })

  // 發送好友請求
  const sendFriendRequest = async () => {
    if (!addFriendFormRef.value) return
    
    try {
      // 驗證表單
      const isValid = await addFriendFormRef.value.validate()
      if (!isValid) return
      
      isAddingFriend.value = true
      await friendStore.fetchSendFriendRequest(addFriendForm.username)
      
      // 成功後重置表單
      addFriendForm.username = ''
      addFriendFormRef.value.resetFields()
      ElMessage.success('好友邀請已發送')
    } catch (error) {
      console.error('發送好友請求失敗:', error)
    } finally {
      isAddingFriend.value = false
    }
  }
  
  // 接受好友請求
  const acceptFriendRequest = async (requestId: string) => {
    try {
      await friendStore.fetchAcceptFriendRequest(requestId)
      ElMessage.success('已接受好友請求')
    } catch (error) {
      console.error('接受好友請求失敗:', error)
    }
  }
  
  // 拒絕好友請求
  const rejectFriendRequest = async (requestId: string) => {
    try {
      await friendStore.fetchRejectFriendRequest(requestId)
      ElMessage.success('已拒絕好友請求')
    } catch (error) {
      console.error('拒絕好友請求失敗:', error)
    }
  }

  // 取消好友請求
  const cancelFriendRequest = async (requestId: string) => {
    try {
      await friendStore.fetchCancelFriendRequest(requestId)
      ElMessage.success('已取消好友請求')
    } catch (error) {
      console.error('取消好友請求失敗:', error)
    }
  }

  const handleSelectClick = (event: MouseEvent, item: Friend | FriendRequest | BlockedUser) => {
    // 隱藏tooltip
    tooltipDisable.value = true
    
    // 記住選中的項目
    selectedFriend.value = item

    // 阻止事件冒泡
    event.stopPropagation()

    menuRef.value?.showMenu({
      x: event.clientX,
      y: event.clientY
    })
  }

/**
 * 開始聊天
 * @param friend 好友物件
 */
async function goToChat(friend: Friend) {
  try {
    // 建立DM聊天室
    const dmRoom = await chatStore.fetchCreateDMRoom({ chat_with_user_id: friend.id })

    // 跳轉到聊天室
    router.push({
      path: `/channels/@me/${dmRoom.room_id}`,
    })
  } catch (error) {
    console.error('開始聊天失敗:', error)
  }
}

/**
 * 開始語音通話
 */
function startVoiceCall(friend: Friend) {
  ElMessage.success(`與「${friend.nickname}」開始語音通話（待實作）`);
}

/**
 * 開始視訊通話
 */
function startVideoCall(friend: Friend) {
  ElMessage.success(`與「${friend.nickname}」開始視訊通話（待實作）`);
}

/**
 * 移除好友
 */
function removeFriend() {
  if (!selectedFriend.value || !('id' in selectedFriend.value)) return
  
  const friend = selectedFriend.value as Friend
  confirmData.value = {
    title: '移除好友',
    message: `確定要移除好友「${friend.nickname}」嗎？`,
    type: 'warning',
    confirmText: '確定',
    onConfirm: async () => {
      try {
        await friendStore.fetchRemoveFriend(friend.id)
        ElMessage.success('好友已移除')
      } catch (error) {
        console.error('移除好友失敗:', error)
      }
    }
  }
  showConfirmDialog.value = true
}

/**
 * 封鎖用戶
 */
function blockUser() {
  if (!selectedFriend.value) return
  
  const userId = 'id' in selectedFriend.value ? selectedFriend.value.id : selectedFriend.value.user_id
  const nickname = selectedFriend.value.nickname
  
  confirmData.value = {
    title: '封鎖用戶',
    message: `確定要封鎖用戶「${nickname}」嗎？`,
    type: 'warning',
    confirmText: '封鎖',
    onConfirm: async () => {
      try {
        await friendStore.fetchBlockUser(userId)
        ElMessage.success('用戶已封鎖')
      } catch (error) {
        console.error('封鎖用戶失敗:', error)
      }
    }
  }
  showConfirmDialog.value = true
}

/**
 * 解除封鎖
 */
function unblockUser() {
  if (!selectedFriend.value || !('user_id' in selectedFriend.value)) return
  
  const blockedUser = selectedFriend.value as BlockedUser
  confirmData.value = {
    title: '解除封鎖',
    message: `確定要解除封鎖用戶「${blockedUser.nickname}」嗎？`,
    type: 'info',
    confirmText: '解除封鎖',
    onConfirm: async () => {
      try {
        await friendStore.fetchUnblockUser(blockedUser.user_id)
        ElMessage.success('已解除封鎖')
      } catch (error) {
        console.error('解除封鎖失敗:', error)
      }
    }
  }
  showConfirmDialog.value = true
}

// 判斷是否為好友請求項目
function isFriendRequest(item: any): item is FriendRequest & { requestType: 'sent' | 'received' } {
  return 'request_id' in item && 'requestType' in item
}

// 判斷是否為封鎖用戶項目
function isBlockedUser(item: any): item is BlockedUser {
  return 'user_id' in item && 'blocked_at' in item
}

// 判斷是否為好友項目
function isFriend(item: any): item is Friend {
  return 'id' in item && 'status' in item && item.status === 'accepted'
}

// 獲取項目的唯一鍵值
function getItemKey(item: Friend | FriendRequest | BlockedUser | any): string {
  if (isFriendRequest(item)) {
    return `request-${item.request_id}`
  } else if (isBlockedUser(item)) {
    return `blocked-${item.user_id}`
  } else if (isFriend(item)) {
    return `friend-${item.id}`
  } else {
    return `unknown-${Math.random()}`
  }
}

// 獲取項目的線上狀態
function getItemStatus(item: Friend | FriendRequest | BlockedUser | any): string {
  if (isFriend(item)) {
    return item.is_online ? 'online' : 'offline'
  }
  return 'offline'
}

// 獲取項目的子文字
function getItemSubtext(item: Friend | FriendRequest | BlockedUser | any): string {
  if (isFriend(item)) {
    return item.is_online ? '線上' : '離線'
  } else if (isFriendRequest(item)) {
    if (item.requestType === 'sent') {
      return `發送於 ${ymd(item.sent_at)}`
    } else {
      return `接收於 ${ymd(item.sent_at)}`
    }
  } else if (isBlockedUser(item)) {
    return `封鎖於 ${ymd(item.blocked_at)}`
  }
  return ''
}

// 處理項目點擊事件
function handleItemClick(item: Friend | FriendRequest | BlockedUser | any) {
  if (isFriend(item)) {
    goToChat(item)
  }
  // 其他類型的項目不做任何動作
}

// 獲取狀態對應的數量
function getStatusCount(status: StatusKey): number {
  switch (status) {
    case 'all':
      return friendStore.friends?.length || 0
    case 'online':
      return friendStore.friends?.filter(friend => friend.is_online).length || 0
    case 'pendingReceived':
      return friendStore.pendingFriends.received?.length || 0
    case 'pendingSent':
      return friendStore.pendingFriends.sent?.length || 0
    case 'blocked':
      return friendStore.blockedUsers?.length || 0
    default:
      return 0
  }
}
</script>

<style lang="scss" scoped>
/* 自定義輸入框樣式 */
:deep(.custom-input .el-input__wrapper) {
  background-color: #14175a !important;
  border: none !important;
  
  .el-input__inner {
    color: white !important;
    
    &::placeholder {
      color: #9ca3af !important;
    }
  }
}

/* 自定義按鈕樣式 */
:deep(.add-friend-btn) {
  background-color: #513a9a !important;
  border-color: #513a9a !important;
  
  &:hover {
    background-color: #5f4d9c !important;
    border-color: #5f4d9c !important;
  }
}

/* 表單項目樣式調整 */
:deep(.el-form-item) {
  margin-bottom: 8px !important;
}

:deep(.el-form-item__error) {
  color: #f56565;
  font-size: 12px;
  margin-top: 4px;
  line-height: 1.4;
  padding-bottom: 2px;
}
</style>

<style scoped>
  .abc {
    color: #503a9a95;
  }
</style>
