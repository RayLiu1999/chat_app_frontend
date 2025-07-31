<template>
  <el-dialog
    v-model="visible"
    :width="width"
    class="edit-field-dialog"
    :show-close="true"
    :close-on-click-modal="true"
    :close-on-press-escape="!loading"
    @opened="handleOpened"
  >
    <template #header>
      <h3 class="text-2xl font-semibold text text-center mt-2">{{ title }}</h3>
    </template>

    <div class="space-y-4">
      <!-- 字段標籤 -->
      <div>
        <label class="block text font-medium text mb-2 ml-1">
          {{ fieldLabel }}
          <span v-if="required" class="text-red-400 ml-1">*</span>
        </label>
        
        <!-- 文字輸入框 -->
        <input
          v-if="inputType !== 'textarea'"
          ref="inputRef"
          v-model="inputValue"
          :type="inputType"
          :placeholder="placeholder"
          :maxlength="maxLength"
          :disabled="loading"
          class="w-full px-3 py-2 bg-#36393f text rounded border border-gray-6 focus:border-#5865f2 focus:outline-none transition-colors disabled:opacity-50"
          @keydown.enter="handleConfirm"
          @keydown.esc="handleCancel"
        />
        
        <!-- 文字區域 -->
        <textarea
          v-else
          ref="textareaRef"
          v-model="inputValue"
          :placeholder="placeholder"
          :maxlength="maxLength"
          :disabled="loading"
          :rows="textareaRows"
          class="w-full px-3 py-2 bg-#36393f text rounded border border-gray-6 focus:border-#5865f2 focus:outline-none resize-none transition-colors disabled:opacity-50"
          @keydown.ctrl.enter="handleConfirm"
          @keydown.esc="handleCancel"
        ></textarea>
        
        <!-- 字數統計和錯誤訊息 -->
        <div class="flex justify-between items-center mt-2">
          <span v-if="errorMessage" class="text-red-400 text-sm">
            {{ errorMessage }}
          </span>
          <span v-else class="text-transparent text-sm">-</span>
          
          <span v-if="maxLength" class="text-gray-4 text-sm">
            {{ inputValue.length }}/{{ maxLength }}
          </span>
        </div>
        
        <!-- 幫助文字 -->
        <p v-if="helpText" class="text-gray-4 text-sm mt-2">
          {{ helpText }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          @click="handleCancel"
          :disabled="loading"
          class="text-sm font-medium text bg-gray-7 hover:bg-gray-5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ cancelButtonText }}
        </button>
        <button
          @click="handleConfirm"
          :disabled="loading || !isValid || hasErrors"
          class="text-sm font-medium bg-#5865f2 hover:bg-#4752c4 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div v-if="loading" class="flex items-center space-x-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ loadingText }}</span>
          </div>
          <span v-else>{{ confirmButtonText }}</span>
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElDialog } from 'element-plus'

// Props
interface Props {
  visible: boolean
  value: string
  title: string
  fieldLabel: string
  inputType?: 'text' | 'email' | 'password' | 'textarea'
  placeholder?: string
  maxLength?: number
  textareaRows?: number
  required?: boolean
  helpText?: string
  width?: string
  confirmButtonText?: string
  cancelButtonText?: string
  loadingText?: string
  loading?: boolean
  validator?: (value: string) => string | null
}

const props = withDefaults(defineProps<Props>(), {
  inputType: 'text',
  placeholder: '',
  textareaRows: 3,
  required: false,
  helpText: '',
  width: '400px',
  confirmButtonText: '確認',
  cancelButtonText: '取消',
  loadingText: '儲存中...',
  loading: false
})

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:value': [value: string]
  'confirm': [value: string]
  'cancel': []
}>()

// Refs
const inputRef = ref<HTMLInputElement>()
const textareaRef = ref<HTMLTextAreaElement>()

// Reactive data
const inputValue = ref('')
const errorMessage = ref('')

// Computed
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isValid = computed(() => {
  if (props.required && !inputValue.value.trim()) {
    return false
  }
  return true
})

const hasErrors = computed(() => {
  return !!errorMessage.value
})

// Methods
const validateInput = () => {
  errorMessage.value = ''
  
  // 必填驗證
  if (props.required && !inputValue.value.trim()) {
    errorMessage.value = `${props.fieldLabel}不能為空`
    return
  }
  
  // 長度驗證
  if (props.maxLength && inputValue.value.length > props.maxLength) {
    errorMessage.value = `${props.fieldLabel}不能超過 ${props.maxLength} 個字元`
    return
  }
  
  // 自訂驗證器
  if (props.validator) {
    const validationError = props.validator(inputValue.value)
    if (validationError) {
      errorMessage.value = validationError
      return
    }
  }
  
  // Email 格式驗證
  if (props.inputType === 'email' && inputValue.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inputValue.value)) {
      errorMessage.value = '請輸入有效的電子郵件地址'
      return
    }
  }
}

const handleConfirm = () => {
  validateInput()
  if (!isValid.value || hasErrors.value) {
    return
  }
  
  emit('update:value', inputValue.value)
  emit('confirm', inputValue.value)
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

const handleOpened = async () => {
  await nextTick()
  if (props.inputType === 'textarea') {
    textareaRef.value?.focus()
    textareaRef.value?.select()
  } else {
    inputRef.value?.focus()
    inputRef.value?.select()
  }
}

// Watchers
watch(() => props.visible, (newValue) => {
  if (newValue) {
    inputValue.value = props.value
    errorMessage.value = ''
  }
})

watch(() => props.value, (newValue) => {
  inputValue.value = newValue
})

watch(inputValue, () => {
  if (errorMessage.value) {
    validateInput()
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.text {
  color: #dcddde;
}

.text-gray-3 {
  color: #b9bbbe;
}

.text-gray-4 {
  color: #72767d;
}

.bg-gray-6 {
  background-color: #4f545c;
}

.bg-gray-5 {
  background-color: #6e7681;
}

input, textarea {
  color: #dcddde;
  
  &::placeholder {
    color: #72767d;
  }
  
  &:focus {
    outline: none;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>