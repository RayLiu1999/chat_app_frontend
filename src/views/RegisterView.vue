<template>
  <div class="bg-#0c0c31 flex h-screen w-screen items-center justify-center">
    <RouterLink class="text-white" to="/channels">
      <div class="absolute left-8 top-8 flex items-center">
        <span class="mr-1">
          <i class="bi bi-chat-dots-fill" style="font-size: 1.5rem; color: white"></i>
        </span>
        <span class="text-2xl">Chat App</span>
      </div>
    </RouterLink>
    <div class="rounded-lg bg-gray-800 p-8 shadow-lg">
      <div class="w-100 mr-auto">
        <h2 class="mb-4 text-2xl font-bold text-white">建立新帳號</h2>
        
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-position="top"
          class="register-form"
        >
          <el-form-item label="電子郵件" prop="email">
            <el-input
              v-model="formData.email"
              type="email"
              placeholder="請輸入電子信箱"
              size="large"
            />
          </el-form-item>
          
          <el-form-item label="顯示名稱" prop="nickname">
            <el-input
              v-model="formData.nickname"
              placeholder="請輸入顯示名稱（可選）"
              size="large"
            />
            <div class="form-hint">其他人會看見您的顯示名稱，可使用特殊字元和表情符號。</div>
          </el-form-item>
          
          <el-form-item label="使用者名稱" prop="username">
            <el-input
              v-model="formData.username"
              placeholder="請輸入使用者名稱"
              size="large"
            />
            <div class="form-hint">請只使用數字、字母、底線 _，或英文句號 (.)。</div>
          </el-form-item>
          
          <el-form-item label="密碼" prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="請輸入密碼"
              size="large"
              show-password
            />
            <div class="form-hint">密碼需包含至少6個字元。</div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :loading="isLoading"
              @click="handleSubmit"
            >
              註冊
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="mt-4 text-gray-400">
          <RouterLink class="text-blue-400" to="/login"> 已經有一個帳號？ </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'
  import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  import api from '@/api/axios'
  import { createValidationRules } from '@/utils/validate'
  import { useUserStore } from '@/stores/user'

  const router = useRouter()
  const formRef = ref<FormInstance>()
  const isLoading = ref(false)

  // 表單資料
  const formData = reactive({
    email: '',
    nickname: '',
    username: '',
    password: ''
  })

  // 驗證規則
  const rules = reactive({
    email: [
      createValidationRules.required('請輸入電子郵件'),
      createValidationRules.email()
    ],
    nickname: [
      createValidationRules.length(0, 32, '顯示名稱長度不能超過32個字符')
    ],
    username: [
      createValidationRules.required('請輸入使用者名稱'),
      createValidationRules.username()
    ],
    password: [
      createValidationRules.required('請輸入密碼'),
      createValidationRules.length(6, 50, '密碼長度需在6-50個字符之間')
    ]
  })

  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      // 驗證表單
      const isValid = await formRef.value.validate()
      if (!isValid) return

      isLoading.value = true

      // 註冊請求
      const userStore = useUserStore()
      await userStore.fetchRegister({
        email: formData.email,
        nickname: formData.nickname || formData.username,
        username: formData.username,
        password: formData.password,
      })

      // 註冊成功後，顯示成功訊息並導向登入頁
      ElMessage.success('註冊成功！請使用新帳號登入')
      router.push({ path: '/login' })
    } catch (error: any) {
      console.error('註冊失敗:', error)
    } finally {
      isLoading.value = false
    }
  }
</script>

<style lang="scss" scoped>
.register-form {
  :deep(.el-form-item__label) {
    color: #d1d5db !important;
    font-weight: 500;
  }
  
  :deep(.el-input__wrapper) {
    background-color: #374151 !important;
    border: 1px solid transparent !important;
    
    &:hover {
      border-color: transparent !important;
    }
    
    &.is-focus {
      border-color: #3b82f6 !important;
    }
  }
  
  :deep(.el-input__inner) {
    color: white !important;
    
    &::placeholder {
      color: #9ca3af !important;
    }
  }
  
  :deep(.el-button--primary) {
    background-color: #2563eb !important;
    border-color: #2563eb !important;
    
    &:hover {
      background-color: #1d4ed8 !important;
      border-color: #1d4ed8 !important;
    }
  }
}

.form-hint {
  margin-top: 4px;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.4;
}
</style>
