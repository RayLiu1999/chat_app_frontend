<template>
  <div class="dialog">
    <el-dialog
      v-model="visible"
      :destroy-on-close="true"
      class="custom-dialog"
      :show-close="true"
      @closed="initDialogContent"
    >
      <div class="bg-#1d202f text relative rounded p-6">
        <span class="text absolute right-4 top-3 cursor-pointer text-lg" @click="visible = false">
          <i class="bi bi-x-lg"></i>
        </span>
        
        <div class="mb-6 flex flex-col text-left">
          <span class="text-xl font-medium mb-2">探索公開伺服器</span>
          <span class="text-sm text-gray-400">尋找有趣的社群並加入他們</span>
        </div>

        <!-- 搜尋框 -->
        <div class="mb-6">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="w-full rounded bg-[#111420] px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="搜尋社群..."
              @keydown.enter="handleSearch"
              @input="handleSearchInput"
            />
            <i class="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            
            <!-- 載入中指示器 -->
            <div v-if="isLoading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
          </div>
        </div>

        <!-- 搜尋結果 -->
        <div class="search-results max-h-96 overflow-y-auto">
          <!-- 載入中狀態 -->
          <div v-if="isLoading && searchResults.length === 0" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <span class="text-gray-400">搜尋中...</span>
          </div>

          <!-- 無結果狀態 -->
          <div v-else-if="!isLoading && searchResults.length === 0 && hasSearched" class="text-center py-8">
            <i class="bi bi-search text-4xl text-gray-500 mb-4"></i>
            <p class="text-gray-400">找不到相符的伺服器</p>
            <p class="text-sm text-gray-500 mt-2">嘗試調整您的搜尋關鍵字</p>
          </div>

          <!-- 預設推薦（未搜尋時） -->
          <!-- <div v-else-if="!hasSearched" class="py-4">
            <h3 class="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">推薦伺服器</h3>
            <div class="grid grid-cols-1 gap-3">
              <div
                v-for="server in featuredServers"
                :key="server.id"
                class="flex items-center p-3 rounded bg-[#111420] hover:bg-[#1a1d2d] transition-colors cursor-pointer"
                @click="joinServer(server)"
              >
                <AvatarImage :src="server.picture_url" alt="Server Image" size="lg" class="mr-4" />
                <div class="flex-1">
                  <h4 class="font-medium text-white">{{ server.name }}</h4>
                  <p class="text-sm text-gray-400 line-clamp-2">{{ server.description }}</p>
                  <div class="flex items-center mt-2 text-xs text-gray-500">
                    <i class="bi bi-people mr-1"></i>
                    <span>{{ server.member_count }} 位成員</span>
                    <span class="mx-2">•</span>
                    <i class="bi bi-circle-fill text-green-400 mr-1"></i>
                    <span>{{ server.online_count }} 人在線</span>
                  </div>
                </div>
                <button
                  class="ml-4 px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] rounded text-sm font-medium transition-colors"
                  @click.stop="joinServer(server)"
                >
                  加入
                </button>
              </div>
            </div>
          </div> -->

          <!-- 搜尋結果列表 -->
          <div v-else class="py-4">
            <h3 class="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wide">
              搜尋結果 ({{ searchResults.length }})
            </h3>
            <div class="grid grid-cols-1 gap-3">
              <div
                v-for="server in searchResults"
                :key="server.id"
                class="flex items-center p-3 rounded bg-[#111420] hover:bg-[#1a1d2d] transition-colors cursor-pointer"
                @click="joinServer(server)"
              >
                <AvatarImage :src="server.picture_url" alt="Server Image" size="lg" class="mr-4" />
                <div class="flex-1">
                  <h4 class="font-medium text-white">{{ server.name }}</h4>
                  <p class="text-sm text-gray-400 line-clamp-2">{{ server.description }}</p>
                  <div class="flex items-center mt-2 text-xs text-gray-500">
                    <i class="bi bi-people mr-1"></i>
                    <span>{{ server.member_count }} 位成員</span>
                    <span class="mx-2">•</span>
                    <i class="bi bi-circle-fill text-green-400 mr-1"></i>
                    <span>{{ server.online_count }} 人在線</span>
                  </div>
                  
                  <!-- 標籤 -->
                  <div v-if="server.tags && server.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                    <span
                      v-for="tag in server.tags.slice(0, 3)"
                      :key="tag"
                      class="px-2 py-1 bg-[#2b2d31] text-xs rounded"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
                <button
                  class="ml-4 px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] rounded text-sm font-medium transition-colors"
                  @click.stop="joinServer(server)"
                  :disabled="server.is_joined"
                >
                  {{ server.is_joined ? '已加入' : '加入' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useServerStore } from '@/stores/server'
import { ElMessage } from 'element-plus'
import AvatarImage from '@/components/AvatarImage.vue'
import { useRouter } from 'vue-router'

interface PublicServer {
  id: string
  name: string
  description: string
  picture_url: string
  member_count: number
  is_joined: boolean
  owner_name: string
  online_count?: number
  tags?: string[]
  created_at: number
}

const serverStore = useServerStore()
const router = useRouter()
const visible = ref(false)
const searchQuery = ref('')
const isLoading = ref(false)
const searchResults = ref<PublicServer[]>([])
const featuredServers = ref<PublicServer[]>([])
const hasSearched = ref(false)

// 搜尋防抖計時器
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const props = defineProps<{
  dialogVisible: boolean
}>()

const emit = defineEmits<{
  (event: 'updateVisible', value: boolean): void
}>()

// 初始化對話框內容
const initDialogContent = () => {
  searchQuery.value = ''
  searchResults.value = []
  hasSearched.value = false
  isLoading.value = false
}

// 搜尋伺服器
const searchServers = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    hasSearched.value = false
    return
  }
  
  try {
    isLoading.value = true
    hasSearched.value = true

    const response = await serverStore.fetchSearchPublicServers(query)
    if (response.servers) {
      searchResults.value = response.servers as PublicServer[]
    } else {
      searchResults.value = []
    }
  } catch (error) {
    searchResults.value = []
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// 處理搜尋輸入（防抖）
const handleSearchInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    searchServers(searchQuery.value)
  }, 500) // 500ms 防抖
}

// 處理搜尋提交
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchServers(searchQuery.value)
}

// 加入伺服器
const joinServer = async (server: PublicServer) => {
  try {
    await serverStore.fetchJoinPublicServer(server.id)

    // 更新伺服器狀態
    server.is_joined = true

    // 關閉對話框
    visible.value = false

    // 跳轉到新加入的伺服器
    router.push(`/channels/${server.id}`)
  } catch (error) {
    console.error(error)
  }
}

// 監聽 props 變化
watch(
  () => props.dialogVisible,
  (newValue) => {
    visible.value = newValue
    if (newValue) {
      initDialogContent()
    }
  }
)

// 監聽內部狀態變化
watch(
  () => visible.value,
  (value) => {
    emit('updateVisible', value)
  }
)
</script>

<style lang="scss" scoped>
.dialog :deep(.el-dialog__header) {
  padding: 0;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.search-results {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #2b2d31;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #3c3f41;
  }
}
</style>
