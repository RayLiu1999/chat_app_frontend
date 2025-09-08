<template>
  <div class="dialog">
    <el-dialog
      v-model="visible"
      :destroy-on-close="true"
      class="custom-dialog"
      :show-close="true"
      @closed="initDialogContent"
    >
      <div class="bg-#1d202f relative flex flex-col items-center justify-center rounded p-4">
        <span class="text absolute right-4 top-3 cursor-pointer text-lg" @click="visible = false">
          <i class="bi bi-x-lg"></i>
        </span>
        <span class="text mb-2 text-2xl font-bold">建立伺服器</span>
        <span class="text mb-2 text-base"
          >幫您的新伺服器取個名字和選個圖示，您之後隨時可以變更。</span
        >

        <!-- 使用 Element Plus 表單 -->
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          class="w-full flex flex-col items-center"
        >
          <!-- 圖片上傳區域 -->
          <el-form-item prop="picture">
            <label
              for="fileInput"
              :class="{
                'border-gray-2 relative flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full': true,
                'border-2 border-dashed p-2': !previewImage,
              }"
            >
              <i v-if="!previewImage" class="bi bi-camera text text-2xl"></i>
              <img v-else :src="previewImage" class="absolute h-20 w-20 rounded-full" />
              <input
                id="fileInput"
                ref="fileInput"
                type="file"
                class="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                @change="handleFileUpload"
              />
              <span class="text text-xs"> UPLOAD </span>
              <div
                v-if="!previewImage"
                class="bg-#5865f2 top-0.05 right-0.05 absolute flex h-6 w-6 items-center justify-center rounded-full"
              >
                <i class="bi bi-plus text text-lg"></i>
              </div>
            </label>
          </el-form-item>

          <!-- 伺服器名稱輸入 -->
          <div class="flex w-full justify-center">
            <div class="flex w-[80%] flex-col">
              <el-form-item prop="name" class="mb-0">
                <span class="text mb-1 block">伺服器名稱</span>
                <el-input
                  v-model="formData.name"
                  type="text"
                  placeholder="輸入伺服器名稱"
                  class="custom-input"
                />
              </el-form-item>
            </div>
          </div>

          <!-- 建立按鈕 -->
          <div class="mt-3">
            <el-button
              type="primary"
              class="create-server-btn"
              @click="handleCreateServer"
            >
              建立
            </el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue'
  import { useServerStore } from '@/stores/server'
  import { ElMessage } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  import { createValidationRules, formValidators, isValidImageType, isValidFileSize } from '@/utils/validate'

  // 表單相關
  const formRef = ref<FormInstance>()
  const formData = reactive({
    name: '',
    picture: null as File | null
  })

  // 其他響應式變數
  const visible = ref(false)
  const input = ref('')
  const previewImage = ref('')
  const fileInput = ref<HTMLInputElement | null>(null)

  // 使用預設的伺服器圖示驗證
  const formRules = {
    name: [
      createValidationRules.required('請輸入伺服器名稱'),
      createValidationRules.length(1, 50, '伺服器名稱長度應為 1-50 字元')
    ],
  }

  // 處理圖片上傳
  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      const file = target.files[0]

      if (!isValidImageType(file)) {
        ElMessage.error('請上傳圖片檔案')
        return
      }

      if (!isValidFileSize(file, 5)) {
        ElMessage.error('檔案大小超過 5MB，請選擇較小的檔案')
        return
      }

      formData.picture = file
      
      // 生成預覽圖
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImage.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  // 建立伺服器
  const handleCreateServer = async () => {
    if (!formRef.value) return

    try {
      // 使用驗證工具驗證表單
      const isValid = await formValidators.validateForm(formRef.value)
      if (!isValid) {
        return
      }

      const serverStore = useServerStore()
      await serverStore.fetchCreateServer({
        name: formData.name,
        picture: formData.picture as Blob,
      })
      visible.value = false
      ElMessage.success('伺服器建立成功')
    } catch (error) {
      console.log(error);
    }
  }

  // 初始化對話框內容
  const initDialogContent = () => {
    previewImage.value = ''
    input.value = ''
  }

  const props = defineProps<{
    dialogVisible: boolean
  }>()

  const emit = defineEmits<{
    (event: 'updateVisible', value: boolean): void
  }>()

  watch(
    () => props.dialogVisible,
    (newValue) => {
      visible.value = newValue
    },
  )

  watch(
    () => visible.value,
    (value) => {
      emit('updateVisible', value)
    },
  )
</script>

<style lang="scss" scoped>
  /* 從父層覆蓋套件(子層)樣式 */
  .dialog :deep(.el-dialog__header) {
    padding: 0;
  }

  /* 自定義輸入框樣式 */
  .dialog :deep(.custom-input .el-input__wrapper) {
    background-color: #111420;
    border: none;
    border-radius: 4px;
    color: white;
    
    .el-input__inner {
      color: white;
      
      &::placeholder {
        color: #8e9297;
      }
    }
  }

  /* 自定義按鈕樣式 */
  .dialog :deep(.create-server-btn) {
    background-color: #513a9a;
    border-color: #513a9a;
    
    &:hover {
      background-color: #5f4d9c;
      border-color: #5f4d9c;
    }
  }

  /* 表單項目樣式調整 */
  .dialog :deep(.el-form-item__label) {
    color: white;
    padding: 0;
  }

  .dialog :deep(.el-form-item__error) {
    color: #f56565;
    font-size: 12px;
  }
</style>
