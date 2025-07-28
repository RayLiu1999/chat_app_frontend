<template>
  <div class="account-setting">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text text-2xl font-bold">我的帳號</h2>
    </div>
    
    <!-- 個人資料卡片 -->
    <div class="bg-#01013b rounded-lg border-2 border-gray-6 pb-3">
      <div class="relative">
        <!-- 橫幅 -->
        <div class="default-banner aspect-ratio-16/3 w-full">
          <img
            v-if="userData?.banner_url"
            :src="userData.banner_url"
            alt="個人橫幅"
            class="h-full w-full rounded-t-lg object-cover"
          />
          <div
            v-else
            class="h-full w-full rounded-t-lg bg-gradient-to-br from-purple-500 to-blue-600"
          ></div>
        </div>
        
        <!-- 頭像 -->
        <div class="absolute left-4" style="bottom: -40px;">
          <AvatarImage
            :src="userData?.pic_url || ''"
            :alt="userData?.username || 'User'"
            size="custom"
            custom-size="w-20 h-20 border-4 border-#0e0b17"
          />
        </div>
      </div>
      
      <!-- 用戶資訊 -->
      <div class="px-4 pb-2 pt-14">
        <div class="flex items-center justify-between">
          <span class="text mr-2 text-xl font-bold">
            {{ userData?.nickname || userData?.username || '載入中...' }}
          </span>
          <button 
            @click="$emit('edit-profile')"
            class="bg-#513a9a hover:bg-#5f4d9c text rounded px-4 py-1.5"
          >
            編輯使用者個人資料
          </button>
        </div>
        
        <!-- 詳細資訊 -->
        <div class="bg-#333354 mt-4 rounded-lg p-4">
          <!-- 顯示名稱 -->
          <div class="pb-3 border-b border-gray-6 last:border-b-0">
            <label class="font-size-3 text-gray-4 block mb-1">顯示名稱</label>
            <div class="flex items-center justify-between">
              <span class="text text-gray-3">{{ userData?.nickname || '未設置' }}</span>
              <button 
                @click="editField('nickname')"
                class="bg-gray-6 hover:bg-gray-5 text rounded px-3 py-1 text-sm"
              >
                編輯
              </button>
            </div>
          </div>
          
          <!-- 使用者名稱 -->
          <div class="pb-3 border-b border-gray-6 last:border-b-0">
            <label class="font-size-3 text-gray-4 block mb-1">使用者名稱</label>
            <div class="flex items-center justify-between">
              <span class="text text-gray-3">{{ userData?.username || '載入中...' }}</span>
              <button 
                @click="editField('username')"
                class="bg-gray-6 hover:bg-gray-5 text rounded px-3 py-1 text-sm"
              >
                編輯
              </button>
            </div>
          </div>
          
          <!-- 電子郵件 -->
          <div class="pb-3 border-b border-gray-6 last:border-b-0">
            <label class="font-size-3 text-gray-4 block mb-1">電子郵件</label>
            <div class="flex items-center justify-between">
              <span class="text text-gray-3">{{ userData?.email || '未設置' }}</span>
              <button 
                @click="editField('email')"
                class="bg-gray-6 hover:bg-gray-5 text rounded px-3 py-1 text-sm"
              >
                編輯
              </button>
            </div>
          </div>
          
          <!-- 電話號碼 -->
          <div class="pb-3 border-b border-gray-6 last:border-b-0">
            <label class="font-size-3 text-gray-4 block mb-1">電話號碼</label>
            <div class="flex items-center justify-between">
              <span class="text text-gray-3">{{ userData?.phone || '未設置' }}</span>
              <button 
                @click="editField('phone')"
                class="bg-gray-6 hover:bg-gray-5 text rounded px-3 py-1 text-sm"
              >
                編輯
              </button>
            </div>
          </div>
          
          <!-- 個人狀態 -->
          <div class="pb-3">
            <label class="font-size-3 text-gray-4 block mb-1">個人狀態</label>
            <div class="flex items-center justify-between">
              <span class="text text-gray-3">{{ userData?.status || '未設置' }}</span>
              <button 
                @click="editField('status')"
                class="bg-gray-6 hover:bg-gray-5 text rounded px-3 py-1 text-sm"
              >
                編輯
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 密碼設定 -->
    <div class="mt-6">
      <h3 class="text text-xl font-bold mb-4">密碼與安全</h3>
      <div class="bg-#333354 rounded-lg p-4">
        <div class="pb-3 border-b border-gray-6">
          <label class="font-size-3 text-gray-4 block mb-1">密碼</label>
          <div class="flex items-center justify-between">
            <span class="text text-gray-3">••••••••••••</span>
            <button 
              @click="changePassword"
              class="bg-#513a9a hover:bg-#5f4d9c text rounded px-4 py-1.5"
            >
              更改密碼
            </button>
          </div>
        </div>
        
        <div class="pt-3">
          <label class="font-size-3 text-gray-4 block mb-1">兩步驟驗證</label>
          <div class="flex items-center justify-between">
            <span class="text text-gray-3">{{ twoFactorEnabled ? '已啟用' : '未啟用' }}</span>
            <button 
              @click="toggleTwoFactor"
              :class="twoFactorEnabled ? 'bg-red-6 hover:bg-red-7' : 'bg-green-6 hover:bg-green-7'"
              class="text rounded px-4 py-1.5"
            >
              {{ twoFactorEnabled ? '停用' : '啟用' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 帳號管理 -->
    <div class="mt-6">
      <h3 class="text text-xl font-bold mb-4">帳號管理</h3>
      <div class="bg-#333354 rounded-lg p-4">
        <div class="pb-4 border-b border-gray-6">
          <h4 class="font-size-3 text-gray-4 mb-2">停用帳號</h4>
          <p class="text text-gray-4 text-sm mb-3">
            停用帳號表示您在採取此動作後可以隨時恢復帳號。您的資料會被保留，但帳號將暫時無法使用。
          </p>
          <button 
            @click="deactivateAccount"
            class="bg-yellow-6 hover:bg-yellow-7 text rounded px-4 py-1.5"
          >
            停用帳號
          </button>
        </div>
        
        <div class="pt-4">
          <h4 class="font-size-3 text-red-400 mb-2">刪除帳號</h4>
          <p class="text text-gray-4 text-sm mb-3">
            ⚠️ 警告：刪除帳號是不可逆的操作。您的所有資料、訊息和檔案都會被永久刪除。
          </p>
          <button 
            @click="deleteAccount"
            class="bg-red-6 hover:bg-red-7 text rounded px-4 py-1.5 mr-3"
          >
            刪除帳號
          </button>
        </div>
      </div>
    </div>
    
    <!-- 編輯對話框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="`編輯${fieldLabels[editingField]}`"
      width="400px"
      class="discord-dialog"
    >
      <div class="space-y-4">
        <div>
          <label class="font-size-3 text-gray-4 block mb-2">{{ fieldLabels[editingField] }}</label>
          <input
            v-if="editingField !== 'status'"
            v-model="editValue"
            :type="getInputType(editingField)"
            class="bg-gray-8 text w-full rounded p-3 border border-transparent focus:border-#513a9a focus:outline-none"
            :placeholder="`輸入新的${fieldLabels[editingField]}`"
          />
          <textarea
            v-else
            v-model="editValue"
            class="bg-gray-8 text w-full rounded p-3 border border-transparent focus:border-#513a9a focus:outline-none resize-none"
            rows="3"
            :placeholder="`輸入新的${fieldLabels[editingField]}`"
          ></textarea>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <button 
            @click="editDialogVisible = false"
            class="bg-gray-6 hover:bg-gray-5 text rounded px-4 py-2"
          >
            取消
          </button>
          <button 
            @click="saveField"
            :disabled="isSaving"
            class="bg-#513a9a hover:bg-#5f4d9c text rounded px-4 py-2 disabled:bg-gray-7 disabled:text-gray-5"
          >
            {{ isSaving ? '儲存中...' : '儲存' }}
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElDialog, ElMessage, ElMessageBox } from 'element-plus'
import AvatarImage from '@/components/AvatarImage.vue'
import { useUserStore } from '@/stores/user'
import axiosInstance from '@/api/axios'
import type { User } from '@/types/auth'

// Emits
const emit = defineEmits<{
  'edit-profile': []
}>()

// Stores
const userStore = useUserStore()

// Reactive data
const editDialogVisible = ref(false)
const editingField = ref('')
const editValue = ref('')
const isSaving = ref(false)
const twoFactorEnabled = ref(false)

// 用戶資料
const userData = computed(() => userStore.userData)

// 字段標籤映射
const fieldLabels: Record<string, string> = {
  nickname: '顯示名稱',
  username: '使用者名稱',
  email: '電子郵件',
  phone: '電話號碼',
  status: '個人狀態'
}

// 獲取輸入框類型
const getInputType = (field: string): string => {
  switch (field) {
    case 'email':
      return 'email'
    case 'phone':
      return 'tel'
    default:
      return 'text'
  }
}

// 編輯字段
const editField = (field: string) => {
  editingField.value = field
  editValue.value = (userData.value as any)?.[field] || ''
  editDialogVisible.value = true
}

// 保存字段
const saveField = async () => {
  if (!editValue.value.trim()) {
    ElMessage.warning('請輸入有效的值')
    return
  }

  isSaving.value = true
  try {
    const updateData = {
      [editingField.value]: editValue.value.trim()
    }
    
    const response = await axiosInstance.put('/api/user/profile', updateData)
    
    if (response.data.success) {
      // 更新 store 中的用戶資料
      userStore.setUserData({
        ...userData.value,
        ...updateData
      } as User)
      
      ElMessage.success(`${fieldLabels[editingField.value]}更新成功`)
      editDialogVisible.value = false
    } else {
      ElMessage.error(response.data.message || '更新失敗')
    }
  } catch (error: any) {
    console.error('更新用戶資料失敗:', error)
    ElMessage.error(error.response?.data?.message || '更新失敗，請稍後再試')
  } finally {
    isSaving.value = false
  }
}

// 更改密碼
const changePassword = async () => {
  try {
    const { value: passwords } = await ElMessageBox.prompt(
      '請輸入新密碼和確認密碼',
      '更改密碼',
      {
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        inputType: 'password',
        inputPlaceholder: '新密碼'
      }
    )
    
    if (passwords) {
      const response = await axiosInstance.put('/api/user/password', {
        newPassword: passwords
      })
      
      if (response.data.success) {
        ElMessage.success('密碼更新成功')
      } else {
        ElMessage.error(response.data.message || '密碼更新失敗')
      }
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('更改密碼失敗:', error)
      ElMessage.error('密碼更新失敗，請稍後再試')
    }
  }
}

// 切換兩步驟驗證
const toggleTwoFactor = async () => {
  try {
    const action = twoFactorEnabled.value ? '停用' : '啟用'
    await ElMessageBox.confirm(
      `確定要${action}兩步驟驗證嗎？`,
      '確認操作',
      {
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await axiosInstance.put('/api/user/two-factor', {
      enabled: !twoFactorEnabled.value
    })
    
    if (response.data.success) {
      twoFactorEnabled.value = !twoFactorEnabled.value
      ElMessage.success(`兩步驟驗證${action}成功`)
    } else {
      ElMessage.error(response.data.message || `${action}失敗`)
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('切換兩步驟驗證失敗:', error)
      ElMessage.error('操作失敗，請稍後再試')
    }
  }
}

// 停用帳號
const deactivateAccount = async () => {
  try {
    await ElMessageBox.confirm(
      '停用帳號後，您將無法使用此帳號登入，但可以隨時恢復。確定要繼續嗎？',
      '停用帳號',
      {
        confirmButtonText: '確認停用',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await axiosInstance.put('/api/user/deactivate')
    
    if (response.data.success) {
      ElMessage.success('帳號已停用')
      userStore.logout()
    } else {
      ElMessage.error(response.data.message || '停用失敗')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('停用帳號失敗:', error)
      ElMessage.error('停用失敗，請稍後再試')
    }
  }
}

// 刪除帳號
const deleteAccount = async () => {
  try {
    await ElMessageBox.confirm(
      '⚠️ 警告：刪除帳號是不可逆的操作！您的所有資料、訊息和檔案都會被永久刪除。請輸入您的使用者名稱以確認刪除。',
      '刪除帳號',
      {
        confirmButtonText: '永久刪除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    const { value: username } = await ElMessageBox.prompt(
      `請輸入您的使用者名稱「${userData.value?.username}」以確認刪除`,
      '確認刪除',
      {
        confirmButtonText: '刪除',
        cancelButtonText: '取消',
        inputPlaceholder: '使用者名稱'
      }
    )
    
    if (username !== userData.value?.username) {
      ElMessage.error('使用者名稱不正確')
      return
    }
    
    const response = await axiosInstance.delete('/api/user/delete')
    
    if (response.data.success) {
      ElMessage.success('帳號已刪除')
      userStore.logout()
    } else {
      ElMessage.error(response.data.message || '刪除失敗')
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('刪除帳號失敗:', error)
      ElMessage.error('刪除失敗，請稍後再試')
    }
  }
}

// 載入兩步驟驗證狀態
const loadTwoFactorStatus = async () => {
  try {
    const response = await axiosInstance.get('/api/user/two-factor-status')
    if (response.data.success) {
      twoFactorEnabled.value = response.data.data.enabled
    }
  } catch (error) {
    console.error('載入兩步驟驗證狀態失敗:', error)
  }
}

onMounted(() => {
  loadTwoFactorStatus()
})
</script>

<style lang="scss" scoped>
.account-setting {
  color: #dcddde;
}

.default-banner {
  height: 120px;
}

.discord-dialog :deep(.el-dialog) {
  background-color: #36393f;
  border-radius: 8px;
}

.discord-dialog :deep(.el-dialog__header) {
  background-color: #36393f;
  border-bottom: 1px solid #40444b;
  padding: 16px;
}

.discord-dialog :deep(.el-dialog__title) {
  color: #ffffff;
  font-weight: 600;
}

.discord-dialog :deep(.el-dialog__body) {
  background-color: #36393f;
  padding: 16px;
}

.discord-dialog :deep(.el-dialog__footer) {
  background-color: #2f3136;
  border-top: 1px solid #40444b;
  padding: 16px;
}

.text {
  color: #dcddde;
}

.text-gray-3 {
  color: #b9bbbe;
}

.text-gray-4 {
  color: #72767d;
}

.text-gray-5 {
  color: #4f545c;
}

.bg-gray-6 {
  background-color: #4f545c;
}

.bg-gray-7 {
  background-color: #40444b;
}

.bg-gray-8 {
  background-color: #36393f;
}

input, textarea {
  color: #dcddde;
  
  &::placeholder {
    color: #72767d;
  }
  
  &:focus {
    outline: none;
    border-color: #7289da;
  }
}

button {
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:disabled {
    transform: none;
    cursor: not-allowed;
  }
}
</style>
