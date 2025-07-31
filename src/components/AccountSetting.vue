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
          <img v-if="userData?.banner_url" :src="userData.banner_url" alt="個人橫幅"
            class="h-full w-full rounded-t-lg object-cover" />
          <div v-else class="h-full w-full rounded-t-lg bg-gradient-to-br from-purple-500 to-blue-600"></div>
        </div>

        <!-- 頭像 -->
        <div class="absolute left-4" style="bottom: -40px;">
          <AvatarImage :src="userData?.picture_url || ''" :alt="userData?.username || 'User'" size="custom"
            custom-size="w-20 h-20 border-4 border-#0e0b17" />
        </div>
      </div>

      <!-- 用戶資訊 -->
      <div class="px-4 pb-2 pt-14">
        <div class="flex items-center justify-between">
          <span class="text mr-2 text-xl font-bold">
            {{ userData?.nickname || userData?.username || '載入中...' }}
          </span>
          <button @click="$emit('edit-profile')" class="bg-#513a9a hover:bg-#5f4d9c text rounded px-4 py-1.5">
            編輯使用者個人資料
          </button>
        </div>

        <!-- 詳細資訊 -->
        <div class="bg-#333354 mt-4 rounded-lg p-4">
          <!-- 顯示名稱 -->
          <div class="pb-3 border-b border-gray-6 last:border-b-0">
            <label class="font-size-3 text-white block mb-1">顯示名稱</label>
            <div class="flex items-center justify-between">
              <span class="text text-white">{{ userData?.nickname || '未設置' }}</span>
              <button @click="editField('nickname')" class="bg-gray-6 hover:bg-gray-5 text rounded px-3 py-1 text-sm">
                編輯
              </button>
            </div>
          </div>

          <!-- 使用者名稱 -->
          <div class="pb-3 border-b border-gray-6 last:border-b-0">
            <label class="font-size-3 text-white block mb-1">使用者名稱</label>
            <div class="flex items-center justify-between">
              <span class="text text-white">{{ userData?.username || '載入中...' }}</span>
              <button @click="editField('username')" class="bg-gray-6 hover:bg-gray-5 text rounded px-3 py-1 text-sm">
                編輯
              </button>
            </div>
          </div>

          <!-- 電子郵件 -->
          <div class="pb-3 border-b border-gray-6 last:border-b-0">
            <label class="font-size-3 text-white block mb-1">電子郵件</label>
            <div class="flex items-center justify-between">
              <span class="text text-white">{{ userData?.email || '未設置' }}</span>
              <button @click="editField('email')" class="bg-gray-6 hover:bg-gray-5 text rounded px-3 py-1 text-sm">
                編輯
              </button>
            </div>
          </div>

          <!-- 電話號碼 -->
          <div class="pb-3 border-b border-gray-6 last:border-b-0">
            <label class="font-size-3 text-white block mb-1">電話號碼</label>
            <div class="flex items-center justify-between">
              <span class="text text-white">{{ userData?.phone || '未設置' }}</span>
              <button @click="editField('phone')" class="bg-gray-6 hover:bg-gray-5 text rounded px-3 py-1 text-sm">
                編輯
              </button>
            </div>
          </div>

          <!-- 個人狀態 -->
          <div class="pb-3">
            <label class="font-size-3 text-white block mb-1">個人狀態</label>
            <div class="flex items-center justify-between">
              <span class="text text-white">{{ userData?.status || '未設置' }}</span>
              <button @click="editField('status')" class="bg-gray-6 hover:bg-gray-5 text rounded px-3 py-1 text-sm">
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
          <label class="font-size-3 text-white block mb-1">密碼</label>
          <div class="flex items-center justify-between">
            <span class="text text-white">••••••••••••</span>
            <button @click="changePassword" class="bg-#513a9a hover:bg-#5f4d9c text rounded px-4 py-1.5">
              更改密碼
            </button>
          </div>
        </div>

        <!-- <div class="pt-3">
          <label class="font-size-3 text-white block mb-1">兩步驟驗證</label>
          <div class="flex items-center justify-between">
            <span class="text text-white">{{ twoFactorEnabled ? '已啟用' : '未啟用' }}</span>
            <button @click="toggleTwoFactor"
              :class="twoFactorEnabled ? 'bg-red-6 hover:bg-red-7' : 'bg-green-6 hover:bg-green-7'"
              class="text rounded px-4 py-1.5">
              {{ twoFactorEnabled ? '停用' : '啟用' }}
            </button>
          </div>
        </div> -->
      </div>
    </div>

    <!-- 帳號管理 -->
    <div class="mt-6">
      <h3 class="text text-xl font-bold mb-4">帳號管理</h3>
      <div class="bg-#333354 rounded-lg p-4">
        <div class="pb-4 border-b border-gray-6">
          <h4 class="font-size-3 text-white mb-2">停用帳號</h4>
          <p class="text text-white text-sm mb-3">
            停用帳號表示您在採取此動作後可以隨時恢復帳號。您的資料會被保留，但帳號將暫時無法使用。
          </p>
          <button @click="deactivateAccount" class="bg-red-6 hover:bg-red-7 text rounded px-4 py-1.5">
            停用帳號
          </button>
        </div>

        <div class="pt-4">
          <h4 class="font-size-3 text-white mb-2">刪除帳號</h4>
          <p class="text text-white text-sm mb-3">
            ⚠️ 警告：刪除帳號是不可逆的操作。您的所有資料、訊息和檔案都會被永久刪除。
          </p>
          <button @click="deleteAccount" class="bg-red-6 hover:bg-red-7 text rounded px-4 py-1.5 mr-3">
            刪除帳號
          </button>
        </div>
      </div>
    </div>

    <!-- 新的對話框元件 -->
    <EditFieldDialog v-model:visible="showEditDialog" :title="editFieldData.title"
      :field-label="editFieldData.fieldLabel" :value="editFieldData.value" :placeholder="editFieldData.placeholder"
      :input-type="editFieldData.type" @confirm="handleFieldEdit" />

    <ConfirmDialog v-model:visible="showConfirmDialog" :title="confirmData.title" :message="confirmData.message"
      :type="confirmData.type" :confirm-text="confirmData.confirmText" @confirm="confirmData.onConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import AvatarImage from '@/components/AvatarImage.vue'
import EditFieldDialog from '@/components/dialogs/EditFieldDialog.vue'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import { useUserStore } from '@/stores/user'
import api from '@/api/axios'
import type { User } from '@/types/auth'

// Emits
const emit = defineEmits<{
  'edit-profile': []
}>()

// Stores
const userStore = useUserStore()

// Reactive data
const twoFactorEnabled = ref(false)

// 新對話框狀態
const showEditDialog = ref(false)
const showConfirmDialog = ref(false)
const showPasswordDialog = ref(false)
const editFieldData = ref<{
  field: string
  value: string
  title: string
  fieldLabel: string
  placeholder: string
  type: 'text' | 'email' | 'password' | 'textarea'
}>({
  field: '',
  value: '',
  title: '',
  fieldLabel: '',
  placeholder: '',
  type: 'text'
})
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
  onConfirm: () => { }
})

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
  const inputType = getInputType(field)
  editFieldData.value = {
    field,
    value: (userData.value as any)?.[field] || '',
    title: `編輯${fieldLabels[field]}`,
    fieldLabel: fieldLabels[field],
    placeholder: `輸入新的${fieldLabels[field]}`,
    type: field === 'status' ? 'textarea' : inputType as 'text' | 'email' | 'password' | 'textarea'
  }
  showEditDialog.value = true
}

// 處理字段編輯確認
const handleFieldEdit = async (value: string) => {
  if (!value.trim()) {
    ElMessage.warning('請輸入有效的值')
    return
  }

  // 處理不同類型的編輯
  if (editFieldData.value.field === 'password') {
    await handlePasswordChange(value)
  } else if (editFieldData.value.field === 'username-confirm') {
    await handleDeleteConfirm(value)
  } else {
    // 一般字段更新
    try {
      const updateData = {
        [editFieldData.value.field]: value.trim()
      }

      const { data: response } = await api.put('/user/profile', updateData)

      if (response.status === 'success') {
        // 更新 store 中的用戶資料
        userStore.setUserData({
          ...userData.value,
          ...updateData
        } as User)

        ElMessage.success(`${fieldLabels[editFieldData.value.field]}更新成功`)
        showEditDialog.value = false
      } else {
        ElMessage.error(response.message || '更新失敗')
      }
    } catch (error: any) {
      console.error('更新用戶資料失敗:', error)
      ElMessage.error(error.response?.data?.message || '更新失敗，請稍後再試')
    }
  }
}

// 更改密碼
const changePassword = () => {
  editFieldData.value = {
    field: 'password',
    value: '',
    title: '更改密碼',
    fieldLabel: '新密碼',
    placeholder: '輸入新密碼',
    type: 'password'
  }
  showEditDialog.value = true
}

// 處理密碼更改
const handlePasswordChange = async (newPassword: string) => {
  try {
    const { data: response } = await api.put('/user/password', {
      newPassword
    })

    if (response.status === 'success') {
      ElMessage.success('密碼更新成功')
      showEditDialog.value = false
    } else {
      ElMessage.error(response.message || '密碼更新失敗')
    }
  } catch (error: any) {
    console.error('更改密碼失敗:', error)
    ElMessage.error('密碼更新失敗，請稍後再試')
  }
}

// 切換兩步驟驗證
const toggleTwoFactor = () => {
  const action = twoFactorEnabled.value ? '停用' : '啟用'
  confirmData.value = {
    title: '確認操作',
    message: `確定要${action}兩步驟驗證嗎？`,
    type: 'warning',
    confirmText: '確認',
    onConfirm: async () => {
      try {
        const { data: response } = await api.put('/user/two-factor', {
          enabled: !twoFactorEnabled.value
        })

        if (response.status === 'success') {
          twoFactorEnabled.value = !twoFactorEnabled.value
          ElMessage.success(`兩步驟驗證${action}成功`)
        } else {
          ElMessage.error(response.message || `${action}失敗`)
        }
      } catch (error: any) {
        console.error('切換兩步驟驗證失敗:', error)
        ElMessage.error('操作失敗，請稍後再試')
      }
    }
  }
  showConfirmDialog.value = true
}

// 停用帳號
const deactivateAccount = () => {
  confirmData.value = {
    title: '停用帳號',
    message: '停用帳號後，您將無法使用此帳號登入，但可以隨時恢復。確定要繼續嗎？',
    type: 'error',
    confirmText: '確認停用',
    onConfirm: async () => {
      try {
        const { data: response } = await api.put('/user/deactivate')

        if (response.status === 'success') {
          ElMessage.success('帳號已停用')
          userStore.logout()
        } else {
          ElMessage.error(response.message || '停用失敗')
        }
      } catch (error: any) {
        console.error('停用帳號失敗:', error)
        ElMessage.error('停用失敗，請稍後再試')
      }
    }
  }
  showConfirmDialog.value = true
}

// 刪除帳號
const deleteAccount = () => {
  confirmData.value = {
    title: '刪除帳號',
    message: '⚠️ 警告：刪除帳號是不可逆的操作！您的所有資料、訊息和檔案都會被永久刪除。',
    type: 'error',
    confirmText: '我了解風險，繼續刪除',
    onConfirm: () => {
      // 第二步確認，需要輸入使用者名稱
      editFieldData.value = {
        field: 'username-confirm',
        value: '',
        title: '確認刪除帳號',
        fieldLabel: '使用者名稱確認',
        placeholder: `請輸入您的使用者名稱「${userData.value?.username}」`,
        type: 'text'
      }
      showEditDialog.value = true
    }
  }
  showConfirmDialog.value = true
}

// 處理刪除帳號確認
const handleDeleteConfirm = async (inputUsername: string) => {
  if (inputUsername !== userData.value?.username) {
    ElMessage.error('使用者名稱不正確')
    return
  }

  try {
    const { data: response } = await api.delete('/user/delete')

    if (response.status === 'success') {
      ElMessage.success('帳號已刪除')
      userStore.logout()
    } else {
      ElMessage.error(response.message || '刪除失敗')
    }
  } catch (error: any) {
    console.error('刪除帳號失敗:', error)
    ElMessage.error('刪除失敗，請稍後再試')
  }
}

// 載入兩步驟驗證狀態
const loadTwoFactorStatus = async () => {
  try {
    const { data: response } = await api.get('/user/two-factor-status')
    if (response.status === 'success') {
      twoFactorEnabled.value = response.data.enabled
    }
  } catch (error) {
    console.error('載入兩步驟驗證狀態失敗:', error)
  }
}

onMounted(() => {
  // loadTwoFactorStatus()
})
</script>

<style lang="scss" scoped>
.default-banner {
  height: 120px;
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
