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
        <h2 class="mb-2 text-2xl font-bold text-white">歡迎回來！</h2>
        <p class="mb-6 text-gray-400">我們很高興又見到您了！</p>
        
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-position="top"
          class="login-form"
        >
          <el-form-item label="電子郵件" prop="email">
            <el-input
              v-model="formData.email"
              type="email"
              placeholder="請輸入電子信箱"
              size="large"
            />
          </el-form-item>
          
          <el-form-item label="密碼" prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="請輸入密碼"
              size="large"
              show-password
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :loading="isLoading"
              @click="handleSubmit"
            >
              登入
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="mt-4 text-gray-400">
          需要一個帳號？
          <RouterLink class="text-blue-400" to="/register"> 註冊 </RouterLink>
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
  import { useUserStore } from '@/stores/user'
  import { createValidationRules } from '@/utils/validate'

  const router = useRouter()
  const formRef = ref<FormInstance>()
  const isLoading = ref(false)

  // 表單資料
  const formData = reactive({
    email: '',
    password: ''
  })

  // 驗證規則
  const rules = reactive({
    email: [
      createValidationRules.required('請輸入電子郵件'),
      createValidationRules.email()
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

      // 登入
      const userStore = useUserStore()
      await userStore.fetchLogin({ 
        email: formData.email, 
        password: formData.password 
      })
      
      // 登入成功後跳轉
      router.push('/channels/@me')
      ElMessage.success('登入成功')
    } catch (error: any) {
      console.error('登入失敗:', error)
      ElMessage.error(error.message || '登入失敗，請檢查您的帳號密碼')
    } finally {
      isLoading.value = false
    }
  }
</script>

<style lang="scss" scoped>
.login-form {
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
</style>
