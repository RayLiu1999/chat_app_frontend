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
        <button class="hover:bg-#4d4e65f7 hover:text weak-text rounded px-1" :class="{ 'bg-#434459f7 hover:bg-#4d4e65f7 text': selectedStatus === 'pending' }" @click="selectedStatus = 'pending'">等待中</button>
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
        <div v-if="selectedStatus !== 'addFriend'" class="weak-text mb-2">{{ selectedStatusList[selectedStatus] }} - {{ filteredFriends.length }}</div>
        
        <!-- 新增好友界面 -->
        <div v-if="selectedStatus === 'addFriend'" class="space-y-4">
          <div class="text-left mb-4">
            <div class="font-bold text-lg mb-2">新增好友</div>
            <div class="weak-text text-sm">您可以利用使用者名稱來新增好友。</div>
          </div>
          <div class="flex space-x-2">
            <input v-model="newFriendUsername" placeholder="請輸入使用者名稱" class="bg-#14175a text flex-1 rounded p-2" />
            <button @click="sendFriendRequest" :disabled="!newFriendUsername" class="bg-#513a9a hover:bg-#5f4d9c text rounded px-4 py-1">傳送好友邀請</button>
          </div>
        </div>
        
        <!-- 好友列表 -->
        <div v-else class="space-y-4">
          <!-- Friend Item -->
          <div
            v-for="friend in filteredFriends"
            :key="friend.id"
            class="flex items-center justify-between rounded p-2 transition hover:bg-#303457 dark:hover:bg-gray-700 cursor-pointer"
            @click="goToChat(friend)"
          >
            <div class="flex items-center space-x-4">
              <AvatarImage :src="friend.pic_url" alt="User" size="md" />
              <div>
                <div class="text">{{ friend.nickname }}</div>
                <div class="weak-text text-sm">{{ friend.status === 'online' ? '線上' : '離線' }}</div>
              </div>
            </div>

            <!-- 等待中好友請求的接受/拒絕按鈕 -->
            <div v-if="friend.status === 'pending'" class="flex space-x-2">
              <el-tooltip content="接受好友請求" placement="top" :show-after="300">
                <button @click="acceptFriendRequest(friend.id)" class="bg-green-600 hover:bg-green-700 text-white rounded-full p-1 w-7 h-7 flex items-center justify-center">
                  <i class="bi bi-check"></i>
                </button>
              </el-tooltip>
              <el-tooltip content="拒絕好友請求" placement="top" :show-after="300">
                <button @click="rejectFriendRequest(friend.id)" class="bg-red-600 hover:bg-red-700 text-white rounded-full p-1 w-7 h-7 flex items-center justify-center">
                  <i class="bi bi-x"></i>
                </button>
              </el-tooltip>
            </div>

            <!-- 好友功能按鈕（非等待中）-->
            <div v-else class="flex items-center space-x-2 transition">
              <!-- 傳送訊息按鈕 -->
              <el-tooltip content="傳送訊息" placement="top" :show-after="300">
                <button
                  @click.stop="goToChat(friend)"
                  class="bg-#080929 hover:bg-#080929 text rounded-full p-1 w-7 h-7 flex items-center justify-center group"
                >
                  <i class="bi bi-chat-fill group-hover:text-white transition-colors"></i>
                </button>
              </el-tooltip>
              <el-tooltip content="更多" placement="top" :show-after="300">
              <button 
                @click.stop="handleSelectClick($event)"
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
        <li @click="">開始語音通話</li>
        <li @click="">開始視訊通話</li>
        <li @click="" class="danger">移除好友</li>
      </template>
    </PositionMenu>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue'
  import { useFriendStore } from '@/stores/friend'
  import { useChatStore } from '@/stores/chat'
  import type { User } from '@/types/auth'
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router'
  import PositionMenu from './PositionMenu.vue'
  
  const router = useRouter()

  type StatusKey = 'all' | 'online' | 'pending' | 'blocked' | 'addFriend'
  
  const selectedStatusList: Record<StatusKey, string> = {
    "all" : "所有",
    "online" : "線上",
    "pending" : "等待回覆中",
    "blocked" : "已封鎖",
    "addFriend" : "新增好友"
  }

  const selectedStatus = ref<StatusKey>('online')
  const newFriendUsername = ref('')
  const friendStore = useFriendStore()
  const chatStore = useChatStore()
  const friends = computed(() => friendStore.friends)
  const filteredFriends = computed(() => {
    // 確保 friends.value 是陣列
    const friendsArray = Array.isArray(friends.value) ? friends.value : []
    
    // 根據選擇的狀態過濾好友列表
    if (selectedStatus.value === 'all') {
      // 全部狀態不包含等待中和已封鎖的好友
      return friendsArray.filter((friend: User) => 
        friend.status !== 'pending' && friend.status !== 'blocked'
      )
    } else if (selectedStatus.value === 'online') {
      // 線上狀態
      return friendsArray.filter((friend: User) => friend.status === 'online')
    } else if (selectedStatus.value === 'pending' || selectedStatus.value === 'blocked') {
      // 等待回覆中和已封鎖狀態獨立計算
      return friendsArray.filter((friend: User) => friend.status === selectedStatus.value)
    } else {
      // 其他狀態
      return friendsArray.filter((friend: User) => friend.status === selectedStatus.value)
    }
  })

  // 更多選單
  const tooltipDisable = ref(false)
  const menuRef = ref<InstanceType<typeof PositionMenu> | null>(null)

  onMounted(async () => {
    await friendStore.fetchFriends()
  })
  
  const sendFriendRequest = async () => {
    try {
      await friendStore.sendFriendRequest(newFriendUsername.value)
      newFriendUsername.value = ''
    } catch (error) {
      console.error('發送好友請求失敗:', error)
    }
  }
  
  // 接受好友請求
  const acceptFriendRequest = async (friendId: string) => {
    try {
      await friendStore.acceptFriendRequest(friendId)
    } catch (error) {
      console.error('接受好友請求失敗:', error)
    }
  }
  
  // 拒絕好友請求
  const rejectFriendRequest = async (friendId: string) => {
    try {
      await friendStore.rejectFriendRequest(friendId)
    } catch (error) {
      console.error('拒絕好友請求失敗:', error)
    }
  }

  const handleSelectClick = (event: MouseEvent) => {
    // 隱藏tooltip
    tooltipDisable.value = true

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
async function goToChat(friend: User) {
  // 建立DM聊天室
  const dmRoom = await chatStore.fetchCreateDMRoom({ chat_with_user_id: friend.id })

  // 跳轉到聊天室
  router.push({
    path: `/channels/@me/${dmRoom.room_id}`,
  })
}

/**
 * 處理更多下拉選單事件
 * @param command 選單指令
 * @param friend 好友物件
 */
function handleMoreCommand(command: string, friend: User) {
  switch (command) {
    case 'voice':
      startVoiceCall(friend);
      break;
    case 'video':
      startVideoCall(friend);
      break;
    case 'remove':
      removeFriend(friend);
      break;
  }
}

/**
 * 開始語音通話
 */
function startVoiceCall(friend: User) {
  ElMessage.success(`與「${friend.nickname}」開始語音通話（待實作）`);
}

/**
 * 開始視訊通話
 */
function startVideoCall(friend: User) {
  ElMessage.success(`與「${friend.nickname}」開始視訊通話（待實作）`);
}

/**
 * 移除好友
 */
function removeFriend(friend: User) {
  ElMessageBox.confirm(
    `確定要移除好友「${friend.nickname}」嗎？`,
    '移除好友',
    {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // TODO: 呼叫API實際移除好友
      ElMessage.success('已移除好友（待串接API）');
    })
    .catch(() => {
      ElMessage.info('已取消移除');
    });
}

// ...原有export等內容
</script>

<style scoped>
  .abc {
    color: #503a9a95;
  }
</style>
