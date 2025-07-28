<template>
  <div class="bg-#080924 w-60 p-4">
    <!-- 載入中狀態 -->
    <div v-if="isLoading" class="flex items-center justify-center py-8">
      <el-icon class="is-loading text-gray-400">
        <Loading />
      </el-icon>
      <span class="ml-2 text-gray-400">載入中...</span>
    </div>

    <!-- 伺服器成員列表 -->
    <div v-else-if="currentServerDetail">
      <!-- 線上成員 -->
      <div v-if="onlineMembers.length > 0" class="mb-6">
        <div class="mb-3 flex items-center">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            線上 — {{ onlineMembers.length }}
          </span>
        </div>
        <div class="space-y-1">
          <div
            v-for="member in onlineMembers"
            :key="member.user_id"
            class="button-hover flex cursor-pointer items-center p-2 rounded transition-colors"
            @click="handleMemberClick(member)"
          >
            <div class="relative mr-3">
              <AvatarImage
                :src="member.picture || '/default-avatar.png'"
                :alt="member.nickname || member.username"
                size="sm"
              />
              <!-- 線上狀態指示器 -->
              <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-#080924"></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center">
                <span class="text-sm font-medium text-white truncate">
                  {{ member.nickname || member.username }}
                </span>
                <!-- 身分標識 -->
                <span
                  v-if="member.role === 'owner'"
                  class="ml-2 text-xs px-1 py-0.5 bg-yellow-600 text-yellow-100 rounded"
                >
                  擁有者
                </span>
                <span
                  v-else-if="member.role === 'admin'"
                  class="ml-2 text-xs px-1 py-0.5 bg-red-600 text-red-100 rounded"
                >
                  管理員
                </span>
              </div>
              <div v-if="member.username !== member.nickname" class="text-xs text-gray-400 truncate">
                {{ member.username }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 離線成員 -->
      <div v-if="offlineMembers.length > 0">
        <div class="mb-3 flex items-center">
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            離線 — {{ offlineMembers.length }}
          </span>
        </div>
        <div class="space-y-1">
          <div
            v-for="member in offlineMembers"
            :key="member.user_id"
            class="button-hover flex cursor-pointer items-center p-2 rounded transition-colors"
            @click="handleMemberClick(member)"
          >
            <div class="relative mr-3">
              <AvatarImage
                :src="member.picture || '/default-avatar.png'"
                :alt="member.nickname || member.username"
                size="sm"
              />
              <!-- 離線狀態指示器 -->
              <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-500 rounded-full border-2 border-#080924"></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-300 truncate">
                  {{ member.nickname || member.username }}
                </span>
                <!-- 身分標識 -->
                <span
                  v-if="member.role === 'owner'"
                  class="ml-2 text-xs px-1 py-0.5 bg-yellow-600 text-yellow-100 rounded"
                >
                  擁有者
                </span>
                <span
                  v-else-if="member.role === 'admin'"
                  class="ml-2 text-xs px-1 py-0.5 bg-red-600 text-red-100 rounded"
                >
                  管理員
                </span>
              </div>
              <div v-if="member.username !== member.nickname" class="text-xs text-gray-500 truncate">
                {{ member.username }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 沒有成員時的顯示 -->
      <div v-if="!onlineMembers.length && !offlineMembers.length" class="text-center py-8">
        <span class="text-gray-400">目前沒有成員</span>
      </div>
    </div>

    <!-- 非伺服器頁面時的顯示 -->
    <div v-else class="text-center py-8">
      <span class="text-gray-400">請選擇一個伺服器</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useServerStore } from '@/stores/server'
import type { ServerMember } from '@/types/chat'
import AvatarImage from './AvatarImage.vue'
import { Loading } from '@element-plus/icons-vue'

const route = useRoute()
const serverStore = useServerStore()

const isLoading = ref(false)

// 計算屬性
const currentServerId = computed(() => route.params.server_id as string)
const currentServerDetail = computed(() => serverStore.currentServerDetail)
const onlineMembers = computed(() => serverStore.getOnlineMembers())
const offlineMembers = computed(() => serverStore.getOfflineMembers())

// 載入伺服器詳細資訊
const loadServerDetail = async (serverId: string) => {
  if (!serverId || serverId === '@me') return
  
  isLoading.value = true
  try {
    await serverStore.fetchServerDetail(serverId)
  } catch (error) {
    console.error('載入伺服器詳細資訊失敗:', error)
  } finally {
    isLoading.value = false
  }
}

// 處理成員點擊事件
const handleMemberClick = (member: ServerMember) => {
  console.log('點擊成員:', member.nickname || member.username)
  // TODO: 實現成員詳細資訊模態框或其他互動
}

// 監聽路由變化
watch(
  () => currentServerId.value,
  async (newServerId) => {
    if (newServerId && newServerId !== '@me') {
      await loadServerDetail(newServerId)
    }
  },
  { immediate: true }
)

// 元件掛載時載入資料
onMounted(() => {
  if (currentServerId.value && currentServerId.value !== '@me') {
    loadServerDetail(currentServerId.value)
  }
})
</script>

<style scoped>
.button-hover:hover {
  background-color: rgba(79, 84, 92, 0.16);
}
</style>
