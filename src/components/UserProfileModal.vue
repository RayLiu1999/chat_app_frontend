<template>
  <el-dialog v-model="visible" width="500" class="custom-dialog" :show-close="false">
    <template #header>
      <div class="relative">
        <img
          alt="Background image with hands and a claw"
          class="h-200px w-full rounded-t-lg object-cover"
          src="@/assets/images/GTFy9B3aQAAz2JI.jpg"
        />
        <!-- <div class="absolute top-2 right-2 flex items-center space-x-2">
          <button class="bg-#5a3d2b text-white rounded-full p-2">
            <i class="fas fa-ellipsis-h"> </i>
          </button>
        </div> -->
        <div class="bottom--40px absolute left-4 flex items-center space-x-2">
          <img
            alt="Profile picture"
            class="w-80px h-80px border-#0e0b17 rounded-full border-4"
            src="@/assets/images/user1.jpg"
          />
          <!-- <img
            alt="Status icon"
            class="w-30px h-30px rounded-full border-4 border-#d9a7c7"
            src="https://placehold.co/30x30"
          /> -->
        </div>
      </div>
    </template>
    <div class="m-2 pb-2">
      <div class="pb-2 pl-2 pt-10">
        <div class="flex items-center">
          <h1 class="mr-2 text-xl font-bold text-gray-200">ホタル</h1>
          <span class="text-gray-200"> laplus </span>
        </div>
      </div>
      <div class="bg-#1a1724 h-400px rounded-lg p-4 text-gray-200">
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
              class="w-40px h-40px rounded-full"
              height="40"
              src="https://placehold.co/40x40"
              width="40"
            />
            <span> 霹靂將軍 </span>
          </div>
          <div class="flex items-center space-x-2">
            <img
              alt="Friend 2 profile picture"
              class="w-40px h-40px rounded-full"
              src="https://placehold.co/40x40"
            />
            <span> Aluo </span>
          </div>
          <div class="flex items-center space-x-2">
            <img
              alt="Friend 3 profile picture"
              class="w-40px h-40px rounded-full"
              height="40"
              src="https://placehold.co/40x40"
              width="40"
            />
            <span> +0 </span>
          </div>
          <div class="flex items-center space-x-2">
            <img
              alt="Friend 4 profile picture"
              class="w-40px h-40px rounded-full"
              height="40"
              src="https://placehold.co/40x40"
              width="40"
            />
            <span> 花樂_Pinky </span>
          </div>
          <div class="flex items-center space-x-2">
            <img
              alt="Friend 5 profile picture"
              class="w-40px h-40px rounded-full"
              height="40"
              src="https://placehold.co/40x40"
              width="40"
            />
            <span> Dami-瑪潔 </span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { defineProps, ref, watch, defineEmits } from 'vue'

  const visible = ref(false)

  const props = defineProps<{
    modalVisible: boolean
  }>()

  const emit = defineEmits<{
    (event: 'updateVisible', value: boolean): void
  }>()

  watch(
    () => props.modalVisible,
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

<style>
  .custom-dialog {
    padding: 0;
    border-radius: 0.5rem;
    background-color: #0e0b17;
  }
</style>
