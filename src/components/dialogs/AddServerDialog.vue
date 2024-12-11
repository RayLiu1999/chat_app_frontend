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

        <div class="flex w-full justify-center">
          <div class="flex w-[80%] flex-col">
            <span class="text">伺服器名稱</span>
            <input
              v-model="input"
              type="text"
              class="rounded border-none bg-[#111420] px-4 py-2 text-white"
            />
          </div>
        </div>

        <div class="mt-3">
          <button class="bg-#513a9a hover:bg-#5f4d9c text rounded px-4 py-1.5">建立</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const visible = ref(false)
  const input = ref('ホタル 的伺服器')
  const previewImage = ref('')
  const fileInput = ref<HTMLInputElement | null>(null)

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
      const file = target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImage.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  // 初始化對話框內容
  const initDialogContent = () => {
    previewImage.value = ''
    input.value = 'ホタル 的伺服器'
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
</style>
