<template>
  <el-dialog
    v-model="visible"
    :width="width"
    class="confirm-dialog"
    :show-close="false"
    :close-on-click-modal="true"
    :close-on-press-escape="!loading"
  >
    <template #header>
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <component
            :is="iconComponent"
            :class="iconColorClass"
          />
        </div>
        <h3 class="text-xl font-semibold text">{{ title }}</h3>
      </div>
    </template>

    <div class="space-y-4">
      <!-- 主要訊息 -->
      <p class="text text-base mt-2">{{ message }}</p>
      
      <!-- 詳細描述 -->
      <p v-if="description" class="text-gray-3 text-sm">{{ description }}</p>
      
      <!-- 自訂內容插槽 -->
      <div v-if="$slots.default">
        <slot></slot>
      </div>
      
      <!-- 危險操作確認輸入 -->
      <div v-if="requireConfirmText" class="space-y-2">
        <label class="block text-sm font-medium text-gray-3">
          請輸入 <span class="font-bold text-red-400">{{ confirmText }}</span> 以確認操作
        </label>
        <input
          v-model="confirmInput"
          type="text"
          class="w-full px-3 py-2 bg-#36393f text rounded border border-gray-6 focus:border-#5865f2 focus:outline-none"
          :placeholder="confirmText"
          :disabled="loading"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          @click="handleCancel"
          :disabled="loading"
          class="text-sm font-medium text bg-gray-6 hover:bg-gray-5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ cancelButtonText }}
        </button>
        <button
          @click="handleConfirm"
          :disabled="loading || (requireConfirmText && confirmInput !== confirmText)"
          class="text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="confirmButtonClass"
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
import { ref, computed, watch } from 'vue'
import { ElDialog } from 'element-plus'

// Icons (using simple SVG components)
const InfoIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>
  `
}

const WarningIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
    </svg>
  `
}

const ErrorIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
    </svg>
  `
}

const SuccessIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  `
}

// Props
interface Props {
  visible: boolean
  title: string
  message: string
  description?: string
  type?: 'info' | 'warning' | 'error' | 'success'
  width?: string
  confirmButtonText?: string
  cancelButtonText?: string
  loadingText?: string
  requireConfirmText?: boolean
  confirmText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  width: '400px',
  confirmButtonText: '確認',
  cancelButtonText: '取消',
  loadingText: '處理中...',
  requireConfirmText: false,
  confirmText: '',
  loading: false
})

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'confirm': []
  'cancel': []
}>()

// Reactive data
const confirmInput = ref('')

// Computed
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const iconComponent = computed(() => {
  switch (props.type) {
    case 'warning': return WarningIcon
    case 'error': return ErrorIcon
    case 'success': return SuccessIcon
    default: return InfoIcon
  }
})

const iconColorClass = computed(() => {
  switch (props.type) {
    case 'warning': return 'text-yellow-400'
    case 'error': return 'text-red-400'
    case 'success': return 'text-green-400'
    default: return 'text-blue-400'
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'warning': return 'bg-yellow-600 hover:bg-yellow-700 text-white'
    case 'error': return 'bg-red-600 hover:bg-red-700 text-white'
    case 'success': return 'bg-green-600 hover:bg-green-700 text-white'
    default: return 'bg-#5865f2 hover:bg-#4752c4 text-white'
  }
})

// Methods
const handleConfirm = () => {
  if (props.requireConfirmText && confirmInput.value !== props.confirmText) {
    return
  }
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

// Watchers
watch(() => props.visible, (newValue) => {
  if (newValue) {
    confirmInput.value = ''
  }
})
</script>

<style lang="scss" scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>