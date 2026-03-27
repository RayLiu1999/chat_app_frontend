<template>
  <div class="user-profile-setting">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text text-2xl font-bold">個人資料</h2>
      <div class="flex space-x-2">
        <button
          @click="resetForm"
          :disabled="!hasChanges"
          class="rounded px-4 py-2 text-sm"
          :class="
            hasChanges
              ? 'bg-gray-6 text hover:bg-gray-5'
              : 'bg-gray-7 cursor-not-allowed text-white'
          "
        >
          重置
        </button>
        <button
          @click="saveProfile"
          :disabled="!hasChanges || isSaving"
          class="rounded px-4 py-2 text-sm"
          :class="
            hasChanges && !isSaving
              ? 'bg-#513a9a hover:bg-#5f4d9c text'
              : 'bg-gray-7 cursor-not-allowed text-white'
          "
        >
          {{ isSaving ? '儲存中...' : '儲存變更' }}
        </button>
      </div>
    </div>

    <div class="flex space-x-6">
      <!-- 左側表單 -->
      <div class="flex-1 space-y-6">
        <!-- 顯示名稱 -->
        <div class="border-b-1 border-gray-5 pb-6">
          <label class="font-size-3 mb-2 block text-white">顯示名稱</label>
          <input
            v-model="formData.nickname"
            class="bg-gray-8 text focus:border-#513a9a w-full rounded border border-transparent p-3 focus:outline-none"
            type="text"
            placeholder="輸入您的顯示名稱"
            maxlength="32"
          />
          <div class="mt-1 flex justify-between">
            <span v-if="errors.nickname" class="text-sm text-red-400">{{ errors.nickname }}</span>
            <span class="ml-auto text-sm text-white">{{ formData.nickname.length }}/32</span>
          </div>
        </div>

        <!-- 使用者名稱 -->
        <div class="border-b-1 border-gray-5 pb-6">
          <label class="font-size-3 mb-2 block text-white">使用者名稱</label>
          <input
            v-model="formData.username"
            class="bg-gray-8 text focus:border-#513a9a w-full rounded border border-transparent p-3 focus:outline-none"
            type="text"
            placeholder="輸入您的使用者名稱"
            maxlength="20"
          />
          <div class="mt-1 flex justify-between">
            <span v-if="errors.username" class="text-sm text-red-400">{{ errors.username }}</span>
            <span class="ml-auto text-sm text-white">{{ formData.username.length }}/20</span>
          </div>
        </div>

        <!-- 個人狀態 -->
        <div class="border-b-1 border-gray-5 pb-6">
          <label class="font-size-3 mb-2 block text-white">個人狀態</label>
          <textarea
            v-model="formData.status"
            class="bg-gray-8 text focus:border-#513a9a w-full resize-none rounded border border-transparent p-3 focus:outline-none"
            rows="3"
            placeholder="輸入您的個人狀態"
            maxlength="190"
          ></textarea>
          <div class="mt-1 flex justify-between">
            <span v-if="errors.status" class="text-sm text-red-400">{{ errors.status }}</span>
            <span class="ml-auto text-sm text-white">{{ formData.status.length }}/190</span>
          </div>
        </div>

        <!-- 頭像設定 -->
        <div class="border-b-1 border-gray-5 pb-6">
          <label class="font-size-3 mb-2 block text-white">頭像</label>
          <div class="flex items-center space-x-3">
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              @change="handleAvatarChange"
              class="hidden"
            />
            <button
              @click="avatarInput?.click()"
              :disabled="isUploadingAvatar"
              class="bg-#513a9a hover:bg-#5f4d9c text disabled:bg-gray-7 rounded px-4 py-2 disabled:text-white"
            >
              {{ isUploadingAvatar ? '上傳中...' : '變更頭像' }}
            </button>
            <button
              @click="removeAvatar"
              :disabled="!formData.picture_url || isUploadingAvatar"
              class="text px-4 py-2 hover:underline disabled:text-white disabled:no-underline"
            >
              移除頭像
            </button>
          </div>
          <p class="mt-2 text-sm text-white">建議尺寸：128x128 像素，檔案大小不超過 8MB</p>
        </div>

        <!-- 橫幅設定 -->
        <div class="pb-6">
          <label class="font-size-3 mb-2 block text-white">個人橫幅</label>
          <div class="mb-2 flex items-center space-x-3">
            <input
              ref="bannerInput"
              type="file"
              accept="image/*"
              @change="handleBannerChange"
              class="hidden"
            />
            <button
              @click="bannerInput?.click()"
              :disabled="isUploadingBanner"
              class="bg-#513a9a hover:bg-#5f4d9c text disabled:bg-gray-7 rounded px-4 py-2 disabled:text-white"
            >
              {{ isUploadingBanner ? '上傳中...' : '變更橫幅' }}
            </button>
            <button
              @click="removeBanner"
              :disabled="!formData.banner_url || isUploadingBanner"
              class="text px-4 py-2 hover:underline disabled:text-white disabled:no-underline"
            >
              移除橫幅
            </button>
          </div>
          <p class="text-sm text-white">建議尺寸：600x240 像素，檔案大小不超過 8MB</p>
        </div>
      </div>

      <!-- 右側預覽 -->
      <div class="w-1/3">
        <label class="font-size-3 mb-2 block text-white">預覽</label>
        <div class="bg-#01013b border-gray-6 h-auto overflow-hidden rounded-lg border-2">
          <!-- 橫幅區域 -->
          <div class="relative">
            <div class="aspect-ratio-5/2 bg-gray-7 w-full">
              <img
                v-if="previewBannerUrl"
                :src="previewBannerUrl"
                alt="橫幅預覽"
                class="h-full w-full object-cover"
              />
              <div v-else class="h-full w-full bg-gradient-to-br from-purple-500 to-blue-600"></div>
            </div>
            <!-- 頭像 -->
            <div class="absolute left-4" style="bottom: -40px">
              <AvatarImage
                :src="previewAvatarUrl"
                :alt="formData.username || 'User'"
                size="custom"
                custom-size="w-20 h-20 border-4 border-#01013b"
              />
            </div>
          </div>

          <!-- 用戶資訊 -->
          <div class="px-4 pb-4 pt-14">
            <div class="flex flex-wrap items-center">
              <span class="text mr-2 text-xl font-bold">
                {{ formData.nickname || formData.username || '使用者' }}
              </span>
              <span class="text-sm text-white">
                {{ formData.username || 'username' }}
              </span>
            </div>
            <p v-if="formData.status" class="mt-2 text-sm text-white">
              {{ formData.status }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 載入遮罩 -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-gray-8 flex items-center space-x-3 rounded-lg p-6">
        <div class="border-#513a9a h-6 w-6 animate-spin rounded-full border-b-2"></div>
        <span class="text">載入中...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '@/stores/user'
  import type { User } from '@/types/auth'
  import type { APIResponse } from '@/types/api'
  import api from '@/api/axios'
  import AvatarImage from '@/components/AvatarImage.vue'

  // Store
  const userStore = useUserStore()

  // 響應式數據
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isUploadingAvatar = ref(false)
  const isUploadingBanner = ref(false)

  // 表單數據
  const formData = ref({
    username: '',
    nickname: '',
    status: '',
    picture_url: '',
    banner_url: '',
  })

  // 原始數據（用於比較變更）
  const originalData = ref({
    username: '',
    nickname: '',
    status: '',
    picture_url: '',
    banner_url: '',
  })

  // 表單驗證錯誤
  const errors = ref({
    username: '',
    nickname: '',
    status: '',
  })

  // 預覽圖片
  const previewAvatarUrl = ref('')
  const previewBannerUrl = ref('')

  // Refs
  const avatarInput = ref<HTMLInputElement>()
  const bannerInput = ref<HTMLInputElement>()

  // 計算屬性
  const hasChanges = computed(() => {
    return JSON.stringify(formData.value) !== JSON.stringify(originalData.value)
  })

  // 表單驗證
  const validateForm = (): boolean => {
    errors.value = {
      username: '',
      nickname: '',
      status: '',
    }

    let isValid = true

    // 驗證使用者名稱
    if (!formData.value.username.trim()) {
      errors.value.username = '使用者名稱不能為空'
      isValid = false
    } else if (formData.value.username.length < 2) {
      errors.value.username = '使用者名稱至少需要 2 個字元'
      isValid = false
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.value.username)) {
      errors.value.username = '使用者名稱只能包含字母、數字和底線'
      isValid = false
    }

    // 驗證顯示名稱
    if (!formData.value.nickname.trim()) {
      errors.value.nickname = '顯示名稱不能為空'
      isValid = false
    } else if (formData.value.nickname.length < 1) {
      errors.value.nickname = '顯示名稱至少需要 1 個字元'
      isValid = false
    }

    return isValid
  }

  // 載入用戶資料
  const loadUserProfile = async () => {
    try {
      isLoading.value = true

      // 如果 store 中沒有用戶資料，先獲取
      if (!userStore.userData) {
        await userStore.fetchUser()
      }

      const userData = userStore.userData
      if (userData) {
        formData.value = {
          username: userData.username || '',
          nickname: userData.nickname || '',
          status: userData.status || '',
          picture_url: userData.picture_url || '',
          banner_url: userData.banner_url || '',
        }

        // 保存原始數據
        originalData.value = { ...formData.value }

        // 設置預覽圖片
        previewAvatarUrl.value = formData.value.picture_url
        previewBannerUrl.value = formData.value.banner_url
      }
    } catch (error) {
      console.error('載入用戶資料失敗:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 儲存個人資料
  const saveProfile = async () => {
    if (!validateForm()) {
      return
    }

    try {
      isSaving.value = true

      const updateData = {
        username: formData.value.username,
        nickname: formData.value.nickname,
        status: formData.value.status,
      }

      const { data: response }: { data: APIResponse } = await api.put('/user/profile', updateData)

      if (response.status === 'success') {
        // 更新 store 中的用戶資料
        if (userStore.userData) {
          userStore.setUserData({
            ...userStore.userData,
            username: formData.value.username,
            nickname: formData.value.nickname,
            status: formData.value.status,
            picture_url: formData.value.picture_url,
            banner_url: formData.value.banner_url,
          } as User)
        }

        // 更新原始數據
        originalData.value = { ...formData.value }

        ElMessage.success('個人資料已更新')
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      console.error('儲存個人資料失敗:', error)
      if (error.response?.data?.displayable) {
        ElMessage.error(error.response.data.message)
      } else {
        ElMessage.error('儲存個人資料失敗')
      }
    } finally {
      isSaving.value = false
    }
  }

  // 重置表單
  const resetForm = () => {
    formData.value = { ...originalData.value }
    previewAvatarUrl.value = formData.value.picture_url
    previewBannerUrl.value = formData.value.banner_url
    errors.value = {
      username: '',
      nickname: '',
      status: '',
    }
  }

  // 上傳圖片的通用函數
  const uploadImage = async (file: File, type: 'avatar' | 'banner'): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', type)

    const { data: response }: { data: APIResponse<{ image_url: string }> } = await api.post(
      '/user/upload-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    if (response.status === 'success' && response.data) {
      return response.data.image_url
    } else {
      throw new Error(response.message)
    }
  }

  // 處理頭像變更
  const handleAvatarChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    // 檢查檔案大小 (8MB)
    if (file.size > 8 * 1024 * 1024) {
      ElMessage.error('檔案大小不能超過 8MB')
      return
    }

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      ElMessage.error('請選擇圖片檔案')
      return
    }

    try {
      isUploadingAvatar.value = true

      // 立即顯示預覽
      const reader = new FileReader()
      reader.onload = (e) => {
        previewAvatarUrl.value = e.target?.result as string
      }
      reader.readAsDataURL(file)

      // 上傳到伺服器
      const imageUrl = await uploadImage(file, 'avatar')
      formData.value.picture_url = imageUrl
      previewAvatarUrl.value = imageUrl

      // 更新 store 中的用戶資料
      if (userStore.userData) {
        userStore.setUserData({
          ...userStore.userData,
          picture_url: imageUrl,
        })
      }

      ElMessage.success('頭像已更新')
    } catch (error: any) {
      console.error('上傳頭像失敗:', error)
      // 恢復原始預覽
      previewAvatarUrl.value = formData.value.picture_url

      if (error.response?.data?.displayable) {
        ElMessage.error(error.response.data.message)
      } else {
        ElMessage.error('上傳頭像失敗')
      }
    } finally {
      isUploadingAvatar.value = false
      // 清除 input value
      if (target) target.value = ''
    }
  }

  // 處理橫幅變更
  const handleBannerChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    // 檢查檔案大小 (8MB)
    if (file.size > 8 * 1024 * 1024) {
      ElMessage.error('檔案大小不能超過 8MB')
      return
    }

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      ElMessage.error('請選擇圖片檔案')
      return
    }

    try {
      isUploadingBanner.value = true

      // 立即顯示預覽
      const reader = new FileReader()
      reader.onload = (e) => {
        previewBannerUrl.value = e.target?.result as string
      }
      reader.readAsDataURL(file)

      // 上傳到伺服器
      const imageUrl = await uploadImage(file, 'banner')
      formData.value.banner_url = imageUrl
      previewBannerUrl.value = imageUrl

      // 更新 store 中的用戶資料
      if (userStore.userData) {
        userStore.setUserData({
          ...userStore.userData,
          banner_url: imageUrl,
        })
      }
      ElMessage.success('橫幅已更新')
    } catch (error: any) {
      console.error('上傳橫幅失敗:', error)
      // 恢復原始預覽
      previewBannerUrl.value = formData.value.banner_url

      if (error.response?.data?.displayable) {
        ElMessage.error(error.response.data.message)
      } else {
        ElMessage.error('上傳橫幅失敗')
      }
    } finally {
      isUploadingBanner.value = false
      // 清除 input value
      if (target) target.value = ''
    }
  }

  // 移除頭像
  const removeAvatar = async () => {
    try {
      isUploadingAvatar.value = true

      const { data: response }: { data: APIResponse } = await api.delete('/user/avatar')

      if (response.status === 'success') {
        formData.value.picture_url = ''
        previewAvatarUrl.value = ''

        // 更新 store 中的用戶資料
        if (userStore.userData) {
          userStore.setUserData({
            ...userStore.userData,
            picture_url: '',
          })
        }

        ElMessage.success('頭像已移除')
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      console.error('移除頭像失敗:', error)
      if (error.response?.data?.displayable) {
        ElMessage.error(error.response.data.message)
      } else {
        ElMessage.error('移除頭像失敗')
      }
    } finally {
      isUploadingAvatar.value = false
    }
  }

  // 移除橫幅
  const removeBanner = async () => {
    try {
      isUploadingBanner.value = true

      const { data: response }: { data: APIResponse } = await api.delete('/user/banner')

      if (response.status === 'success') {
        formData.value.banner_url = ''
        previewBannerUrl.value = ''

        // 更新 store 中的用戶資料
        if (userStore.userData) {
          userStore.setUserData({
            ...userStore.userData,
            banner_url: '',
          })
        }

        ElMessage.success('橫幅已移除')
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      console.error('移除橫幅失敗:', error)
      if (error.response?.data?.displayable) {
        ElMessage.error(error.response.data.message)
      } else {
        ElMessage.error('移除橫幅失敗')
      }
    } finally {
      isUploadingBanner.value = false
    }
  }

  // 監聽表單變化，即時驗證
  watch(
    () => formData.value.username,
    () => {
      if (errors.value.username) {
        validateForm()
      }
    },
  )

  watch(
    () => formData.value.nickname,
    () => {
      if (errors.value.nickname) {
        validateForm()
      }
    },
  )

  // 組件掛載時載入數據
  onMounted(() => {
    loadUserProfile()
  })
</script>

<style lang="scss" scoped>
  .user-profile-setting {
    max-width: 100%;
  }

  .custom-textarea {
    background-color: rgb(55 65 81);
    color: white;
    border-radius: 0.375rem;
    padding: 0.75rem;
    min-height: 6rem;
    border: 1px solid transparent;

    &:focus {
      border-color: #513a9a;
      outline: none;
    }

    &:empty:before {
      content: '輸入您的個人簡介...';
      color: rgb(107 114 128);
    }
  }

  // 檔案上傳按鈕樣式
  input[type='file'] {
    display: none;
  }

  // 載入動畫
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
</style>
