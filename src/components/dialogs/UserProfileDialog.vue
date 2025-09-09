<template>
  <el-dialog v-model="visible" width="500" class="custom-dialog" :show-close="false">
    <template #header>
      <div class="relative">
        <div class="aspect-ratio-16/7 w-full">
          <img
            alt="Background image with hands and a claw"
            class="h-full w-full rounded-t-lg object-cover"
            src="@/assets/images/banner.jpg"
          />
        </div>
        <div class="bottom--48px absolute left-4 flex items-center space-x-2">
          <img
            alt="Profile picture"
            class="w-80px h-80px border-#0e0b17 rounded-full border-4"
            src="@/assets/images/user.jpg"
          />
        </div>
      </div>
    </template>
    <div class="m-2 pb-2">
      <div class="pb-2 pl-2 pt-8">
        <div class="flex items-center">
          <h1 class="text mr-2 text-xl font-bold">ホタル</h1>
          <span class="text"> laplus </span>
        </div>
        <p class="text mt-2">1234</p>
      </div>
      <div class="h-400px text bg-#333354 rounded-lg p-4">
        <div class="relative">
          <div class="h-1px absolute bottom-0 left-0 right-0 bg-gray-500"></div>
          <div class="relative flex">
            <div class="group relative mr-4 flex pb-2">
              <div class="border-hover transition-all duration-300"></div>
              關於我
            </div>

            <!-- 項目 2 -->
            <div class="group relative mr-4 flex pb-2">
              <div class="border-current transition-all duration-300"></div>
              5 位共同好友
            </div>

            <!-- 項目 3 -->
            <div class="group relative mr-4 flex pb-2">
              <div class="border-hover transition-all duration-300"></div>
              2 個共同伺服器
            </div>
            <!-- <button class="text-black font-bold border-b border-gray-300">關於我</button>
            <button class="text-black font-bold border-b border-gray-300">5 位共同好友</button>
            <button class="text-black font-bold border-b border-gray-300">2 個共同伺服器</button> -->
          </div>
        </div>
        <div class="space-y-2 pt-2">
          <div class="flex items-center space-x-2">
            <img
              alt="Friend 1 profile picture"
              class="size-12 rounded-full"
              height="40"
              src="https://placehold.co/40x40"
              width="40"
            />
            <span> 繩匠 </span>
          </div>
          <div class="flex items-center space-x-2">
            <img
              alt="Friend 2 profile picture"
              class="size-12 rounded-full"
              src="https://placehold.co/40x40"
            />
            <span> 漂泊者 </span>
          </div>
          <div class="flex items-center space-x-2">
            <img
              alt="Friend 3 profile picture"
              class="size-12 rounded-full"
              height="40"
              src="https://placehold.co/40x40"
              width="40"
            />
            <span> 旅行者 </span>
          </div>
          <div class="flex items-center space-x-2">
            <img
              alt="Friend 4 profile picture"
              class="size-12 rounded-full"
              height="40"
              src="https://placehold.co/40x40"
              width="40"
            />
            <span> 開拓者 </span>
          </div>
          <div class="flex items-center space-x-2">
            <img
              alt="Friend 5 profile picture"
              class="size-12 rounded-full"
              height="40"
              src="https://placehold.co/40x40"
              width="40"
            />
            <span> 指揮官 </span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const visible = ref(false)

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

<style></style>
