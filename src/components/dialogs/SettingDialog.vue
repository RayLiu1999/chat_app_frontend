<template>
  <div class="dialog">
    <el-dialog
      v-model="visible"
      title="Notice"
      destroy-on-close
      center
      :fullscreen="true"
      class="custom-full-dialog"
      :show-close="false"
    >
      <template #header>
        <div></div>
      </template>
      <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="bg-#0c0c31 w-1/3 p-8">
          <div class="ml-auto w-1/3 justify-items-end h-full flex flex-col">
            <div class="mb-4 w-full">
              <input 
                v-model="searchQuery"
                class="bg-gray-8 text w-full rounded p-2" 
                placeholder="搜尋" 
                type="text" 
              />
              <i class="fas fa-search text-gray-4 absolute right-3 top-3"></i>
            </div>
            
            <!-- 可滾動的選單區域 -->
            <div class="flex-1 overflow-y-auto w-full space-y-2">
              <!-- 使用者設定 -->
              <div v-if="shouldShowSection('user')">
                <span class="text-size-xs text-gray-4 p-2">使用者設定</span>
                <ul class="w-full space-y-2">
                  <li 
                    v-for="item in userSettingItems"
                    :key="item.key"
                    v-show="shouldShowItem(item)"
                    :class="[
                      'text p-2 cursor-pointer',
                      currentTab === item.key ? 'button-current' : 'button-hover'
                    ]"
                    @click="currentTab = item.key"
                  >
                    {{ item.label }}
                  </li>
                </ul>
              </div>
              
              <!-- 應用程式設定 -->
              <div v-if="shouldShowSection('app')" class="mt-6">
                <span class="text-size-xs text-gray-4 p-2">應用程式設定</span>
                <ul class="w-full space-y-2">
                  <li 
                    v-for="item in appSettingItems"
                    :key="item.key"
                    v-show="shouldShowItem(item)"
                    :class="[
                      'text p-2 cursor-pointer',
                      currentTab === item.key ? 'button-current' : 'button-hover'
                    ]"
                    @click="currentTab = item.key"
                  >
                    {{ item.label }}
                  </li>
                </ul>
              </div>
              
              <!-- 系統 -->
              <div v-if="shouldShowSection('system')" class="mt-6">
                <span class="text-size-xs text-gray-4 p-2">系統</span>
                <ul class="w-full space-y-2">
                  <li 
                    v-for="item in systemItems"
                    :key="item.key"
                    v-show="shouldShowItem(item)"
                    class="button-hover text p-2 cursor-pointer"
                    @click="handleSystemAction(item.key)"
                  >
                    {{ item.label }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Main Content -->
        <div class="bg-#080a28 flex flex-1 p-8 relative">
          <!-- 內容區域參考DC設計 - 適中寬度 -->
          <div class="w-4/6 overflow-y-auto">
            <component :is="currentComponent" @edit-profile="switchToProfile" />
          </div>
          
          <!-- ESC按鈕緊貼內容區域右側 -->
          <div class="ml-8">
            <span
              class="text-gray-5 hover:text-gray-4 flex cursor-pointer flex-col items-center"
              @click="closeDialog"
            >
              <i class="bi bi-x-circle" style="font-size: 1.8rem"></i>
              ESC
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
    
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
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import ConfirmDialog from './ConfirmDialog.vue'
import UserProfileSetting from '@/components/UserProfileSetting.vue'
import AccountSetting from '@/components/AccountSetting.vue'
import { useUserStore } from '@/stores/user'

// 定義設定項目類型
interface SettingItem {
  key: string
  label: string
  component?: any
}

// Props
const props = defineProps<{
  dialogVisible: boolean
}>()

// Emits
const emit = defineEmits<{
  (event: 'updateVisible', value: boolean): void
}>()

// Stores
const userStore = useUserStore()

// Reactive data
const visible = ref(false)
const currentTab = ref('account')
const searchQuery = ref('')
const showConfirmDialog = ref(false)
const confirmData = ref<{
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  confirmText: string
  onConfirm: () => void
}>({
  title: '',
  message: '',
  type: 'info',
  confirmText: '確認',
  onConfirm: () => {}
})

// 設定選項
const userSettingItems: SettingItem[] = [
  {
    key: 'account',
    label: '我的帳號',
    component: AccountSetting
  },
  {
    key: 'profile',
    label: '個人資料',
    component: UserProfileSetting
  },
  {
    key: 'privacy',
    label: '隱私與安全'
  },
  {
    key: 'authorized-apps',
    label: '授權應用程式'
  },
  {
    key: 'connections',
    label: '連結'
  }
]

const appSettingItems: SettingItem[] = [
  {
    key: 'appearance',
    label: '外觀'
  },
  {
    key: 'accessibility',
    label: '無障礙功能'
  },
  {
    key: 'voice-video',
    label: '語音與視訊'
  },
  {
    key: 'chat',
    label: '聊天'
  },
  {
    key: 'notifications',
    label: '通知'
  },
  {
    key: 'keybinds',
    label: '快捷鍵'
  },
  {
    key: 'language',
    label: '語言'
  },
  {
    key: 'windows',
    label: '視窗設定'
  },
  {
    key: 'advanced',
    label: '進階'
  }
]

const systemItems: SettingItem[] = [
  {
    key: 'logout',
    label: '登出'
  }
]

// 當前元件
const currentComponent = computed(() => {
  const item = userSettingItems.find(item => item.key === currentTab.value)
  return item?.component || AccountSetting
})

// 搜尋過濾
const shouldShowItem = (item: SettingItem): boolean => {
  if (!searchQuery.value) return true
  return item.label.toLowerCase().includes(searchQuery.value.toLowerCase())
}

const shouldShowSection = (section: string): boolean => {
  if (!searchQuery.value) return true
  
  const items = section === 'user' ? userSettingItems : 
                section === 'app' ? appSettingItems : 
                systemItems
  
  return items.some(item => shouldShowItem(item))
}

// 切換到個人資料
const switchToProfile = () => {
  currentTab.value = 'profile'
}

// 處理系統操作
const handleSystemAction = async (action: string) => {
  switch (action) {
    case 'logout':
      confirmData.value = {
        title: '確認登出',
        message: '確定要登出嗎？',
        type: 'warning',
        confirmText: '登出',
        onConfirm: () => {
          userStore.logout()
          closeDialog()
          ElMessage.success('已登出')
        }
      }
      showConfirmDialog.value = true
      break
  }
}

// 關閉對話框
const closeDialog = () => {
  visible.value = false
}

// 鍵盤快捷鍵
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && visible.value) {
    closeDialog()
  }
}

// 監聽器
watch(
  () => props.dialogVisible,
  (newValue) => {
    visible.value = newValue
  }
)

watch(
  () => visible.value,
  (value) => {
    emit('updateVisible', value)
  }
)

// 生命週期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
.custom-textarea {
  background-color: #1f2937;
  border-radius: 4px;
  padding: 10px;
  min-height: 100px;
  overflow-y: auto;
  white-space: pre-wrap; /* 保持换行和空格 */
  color: #e8e3e3; /* 文本颜色 */
  font-family: Arial, sans-serif;
  font-size: 16px;
}

.custom-textarea:empty:before {
  color: #8e96a2;
}

/* 從父層覆蓋套件(子層)樣式 */
.dialog :deep(.el-dialog__header) {
  padding: 0;
}

/* 自定義全螢幕對話框樣式 */
.custom-full-dialog :deep(.el-dialog) {
  margin: 0;
  height: 100vh;
  width: 100vw;
  max-width: none;
  border-radius: 0;
}

.custom-full-dialog :deep(.el-dialog__body) {
  padding: 0;
  height: 100vh;
}

/* 滾動條樣式 - 針對不同區域的滾動條 */
/* 左側選單滾動條 */
.bg-\#0c0c31 .overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.bg-\#0c0c31 .overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.bg-\#0c0c31 .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.bg-\#0c0c31 .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 右側內容區域滾動條 - 緊貼視窗最右邊 */
.bg-\#080a28 .overflow-y-auto::-webkit-scrollbar {
  width: 12px;
}

.bg-\#080a28 .overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

.bg-\#080a28 .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.bg-\#080a28 .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
  background-clip: content-box;
}
</style>
