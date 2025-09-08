<template>
  <div class="dialog">
    <el-dialog
      v-model="visible"
      :destroy-on-close="true"
      class="custom-dialog"
      :show-close="true"
      @closed="initDialogContent"
    >
      <div class="bg-#1d202f text relative rounded p-4">
        <span class="text absolute right-4 top-3 cursor-pointer text-lg" @click="visible = false">
          <i class="bi bi-x-lg"></i>
        </span>
        <div class="mb-4 flex flex-col text-left">
          <span class="text-base font-medium">建立頻道</span>
          <span class="text-xs">在 {{ channelTypeText }}頻道中</span>
        </div>

        <div class="mb-4">
          <div class="mb-2">
            <span class="text-xs font-medium">頻道類別</span>
          </div>
          <div class="flex flex-col gap-2">
            <!-- Text Channel Option -->
            <div
              class="flex cursor-pointer items-center gap-3 rounded p-3 transition-colors duration-200"
              :class="{
                'bg-[#2a2f3e] hover:bg-[#343846]': selectedType === 'text',
                'bg-[#1d202f] hover:bg-[#1d202f]': selectedType !== 'text'
              }"
              @click="selectedType = 'text'"
            >
              <span class="w-4 text-xl">#</span>
              <div class="flex flex-col">
                <span class="font-medium">文字</span>
                <span class="text-xs text-gray-400"
                  >傳送訊息、圖片、GIF、表情符號、意見和雙關語</span
                >
              </div>
              <div class="ml-auto">
                <div
                  class="h-4 w-4 rounded-full border-2 transition-colors duration-200"
                  :class="selectedType === 'text' ? 'bg-white border-white' : 'bg-transparent border-gray-400'"
                ></div>
              </div>
            </div>
            <!-- Voice Channel Option -->
            <div
              class="flex cursor-pointer items-center gap-3 rounded p-3 transition-colors duration-200"
              :class="{
                'bg-[#2a2f3e] hover:bg-[#343846]': selectedType === 'voice',
                'bg-[#1d202f] hover:bg-[#1d202f]': selectedType !== 'voice'
              }"
              @click="selectedType = 'voice'"
            >
              <span class="w-4 text-xl"><i class="bi bi-volume-up"></i></span>
              <div class="flex flex-col">
                <span class="font-medium">語音</span>
                <span class="text-xs text-gray-400"
                  >透過語音通話、視訊通話和畫面分享來相互交流</span
                >
              </div>
              <div class="ml-auto">
                <div
                  class="h-4 w-4 rounded-full border-2 transition-colors duration-200"
                  :class="selectedType === 'voice' ? 'bg-white border-white' : 'bg-transparent border-gray-400'"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="mb-2">
            <span class="text-xs font-medium">頻道名稱</span>
          </div>
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
          >
            <el-form-item prop="name" class="mb-0">
              <div class="flex items-center bg-[#111420] rounded">
                <span class="ml-3 mr-2 text-lg">
                  <i v-if="selectedType === 'text'" class="bi bi-hash"></i>
                  <i v-else class="bi bi-volume-up"></i>
                </span>
                <el-input
                  v-model="formData.name"
                  type="text"
                  class="custom-input"
                  :placeholder="selectedType === 'text' ? '新-頻道' : '一般'"
                  @keydown.enter="handleCreateChannel"
                />
              </div>
            </el-form-item>
          </el-form>
        </div>

        <div class="mb-4">
          <div class="flex items-center justify-between">
            <span class="font-medium">
              <span class="mr-1">
                <i class="bi bi-lock-fill"></i>
              </span>
              私人頻道
            </span>
            <el-switch
              v-model="isPrivate"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #4c4d4f"
            />
          </div>
          <div class="mt-1">
            <span class="text-xs text-gray-400">只有被選出的成員及身分組能檢視這個頻道。</span>
          </div>
        </div>

        <div class="flex justify-between">
          <button 
            class="rounded px-4 py-2 text-gray-400 hover:underline" 
            @click="visible = false"
          >
            取消
          </button>
          <button 
            class="rounded bg-[#5865f2] px-4 py-2 hover:bg-[#4752c4] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!formData.name.trim()"
            @click="handleCreateChannel"
          >
            建立頻道
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, reactive } from 'vue'
import { ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { createValidationRules } from '@/utils/validate'
import type { ChannelAPI } from '@/types/api'

const selectedType = ref<'text' | 'voice'>('text')
const visible = ref(false)
const isPrivate = ref(false)
const formRef = ref<FormInstance>()

// 表單資料
const formData = reactive({
  name: ''
})

// 驗證規則
const formRules = reactive({
  name: [
    createValidationRules.required('請輸入頻道名稱'),
    createValidationRules.length(1, 100, '頻道名稱長度應為 1-100 字元')
  ]
})

const props = defineProps<{
  dialogVisible: boolean
  channelType?: 'text' | 'voice'
}>()

const emit = defineEmits<{
  (event: 'updateVisible', value: boolean): void
  (event: 'createChannel', data: ChannelAPI.Request.Create): void
}>()

// 計算屬性
const channelTypeText = computed(() => {
  return selectedType.value === 'text' ? '文字' : '語音'
})

// 初始化對話框內容
const initDialogContent = () => {
  formData.name = ''
  isPrivate.value = false
  selectedType.value = props.channelType || 'text'
  // 重置表單驗證
  formRef.value?.resetFields()
}

// 處理創建頻道
const handleCreateChannel = async () => {
  if (!formRef.value) return
  
  try {
    // 驗證表單
    const isValid = await formRef.value.validate()
    if (!isValid) return
    
    const channelData: ChannelAPI.Request.Create = {
      name: formData.name.trim(),
      type: selectedType.value
    }
    
    emit('createChannel', channelData)
  } catch (error) {
    console.error('頻道名稱驗證失敗:', error)
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

watch(
  () => props.channelType,
  (newType) => {
    if (newType) {
      selectedType.value = newType
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

/* 自定義輸入框樣式 */
.dialog :deep(.custom-input .el-input__wrapper) {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  
  .el-input__inner {
    background-color: transparent !important;
    color: white !important;
    padding: 8px 12px !important;
    
    &::placeholder {
      color: #8e9297 !important;
    }
  }
}

/* 表單項目樣式調整 */
.dialog :deep(.el-form-item) {
  margin-bottom: 0 !important;
}

.dialog :deep(.el-form-item__error) {
  color: #f56565;
  font-size: 12px;
  margin-top: 4px;
}
</style>
