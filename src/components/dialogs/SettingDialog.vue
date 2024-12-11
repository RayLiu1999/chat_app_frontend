<template>
  <div class="dialog">
    <el-dialog
      v-model="visible"
      title="Notice"
      destroy-on-close
      center
      :fullscreen="true"
      class="custom-full-dialog"
      :show-close="false"
    >
      <template #header>
        <div></div>
      </template>
      <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="bg-#0c0c31 w-1/3 p-8">
          <div class="ml-auto w-1/3 justify-items-end">
            <div class="mb-4 w-full">
              <input class="bg-gray-8 text w-full rounded p-2" placeholder="搜尋" type="text" />
              <i class="fas fa-search text-gray-4 absolute right-3 top-3"> </i>
            </div>
            <ul class="w-full space-y-2">
              <span class="text-size-xs text-gray-4 p-2">使用者設定</span>
              <li class="button-current text p-2" @click="currentComponent = AccountSetting">
                我的帳號
              </li>
              <li class="button-hover text p-2" @click="currentComponent = UserProfileSetting">
                個人資料
              </li>
            </ul>
          </div>
        </div>
        <!-- Main Content -->
        <div class="bg-#080a28 flex flex-1 p-8">
          <div class="w-3/5">
            <component :is="currentComponent" />
          </div>
          <div>
            <span
              class="text-gray-5 hover:text-gray-4 ml-3 flex cursor-pointer flex-col items-center"
              @click="visible = false"
            >
              <i class="bi bi-x-circle" style="font-size: 1.8rem"></i>
              ESC
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import UserProfileSetting from '@/components/UserProfileSetting.vue'
  import AccountSetting from '@/components/AccountSetting.vue'

  const visible = ref(false)

  const props = defineProps<{
    dialogVisible: boolean
  }>()

  const emit = defineEmits<{
    (event: 'updateVisible', value: boolean): void
  }>()

  const currentComponent = ref(AccountSetting)

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
  .custom-textarea {
    background-color: #1f2937;
    border-radius: 4px;
    padding: 10px;
    min-height: 100px;
    overflow-y: auto;
    white-space: pre-wrap; /* 保持换行和空格 */
    color: #e8e3e3; /* 文本颜色 */
    font-family: Arial, sans-serif;
    font-size: 16px;
  }
  .custom-textarea:empty:before {
    color: #8e96a2;
  }

  /* 從父層覆蓋套件(子層)樣式 */
  .dialog :deep(.el-dialog__header) {
    padding: 0;
  }
</style>
