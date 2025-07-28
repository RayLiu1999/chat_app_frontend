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
              class="flex cursor-pointer items-center gap-3 rounded bg-[#111420] p-3 hover:bg-[#1a1d2d]"
              :class="selectedType === 'text' ? 'bg-[#1a1d2d]' : 'bg-[#111420]'"
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
                  class="h-4 w-4 rounded-full border-2"
                  :class="selectedType === 'text' ? 'bg-white' : 'bg-transparent'"
                ></div>
              </div>
            </div>
            <!-- Voice Channel Option -->
            <div
              class="flex cursor-pointer items-center gap-3 rounded bg-[#111420] p-3 hover:bg-[#1a1d2d]"
              :class="selectedType === 'voice' ? 'bg-[#1a1d2d]' : 'bg-[#111420]'"
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
                  class="h-4 w-4 rounded-full border-2"
                  :class="selectedType === 'voice' ? 'bg-white' : 'bg-transparent'"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="mb-2">
            <span class="text-xs font-medium">頻道名稱</span>
          </div>
          <div class="flex items-center">
            <span class="mr-2 text-lg">
              <i v-if="selectedType === 'text'" class="bi bi-hash"></i>
              <i v-else class="bi bi-volume-up"></i>
            </span>
            <input
              v-model="channelName"
              type="text"
              class="w-full rounded border-none bg-[#111420] px-4 py-2 text-white"
              :placeholder="selectedType === 'text' ? '新-頻道' : '一般'"
              @keydown.enter="handleCreateChannel"
            />
          </div>
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
            :disabled="!channelName.trim()"
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
import { ref, watch, computed } from 'vue'
import type { ChannelAPI } from '@/types/api'

const selectedType = ref<'text' | 'voice'>('text')
const visible = ref(false)
const channelName = ref('')
const isPrivate = ref(false)

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
  channelName.value = ''
  isPrivate.value = false
  selectedType.value = props.channelType || 'text'
}

// 處理創建頻道
const handleCreateChannel = () => {
  if (!channelName.value.trim()) return
  
  const channelData: ChannelAPI.Request.Create = {
    name: channelName.value.trim(),
    type: selectedType.value
  }
  
  emit('createChannel', channelData)
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
</style>
