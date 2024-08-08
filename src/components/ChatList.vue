<template>
  <div class="bg-#0d1245 relative w-60">
    <div class="p-4">
      <div class="mb-4">
        <input
          class="bg-#14175a w-full rounded p-2 text-white"
          placeholder="搜尋或開始一個對話"
          type="text"
          @click="console.log(123)"
        />
      </div>
      <div class="button-hover space-y-2 p-1">
        <div class="flex cursor-pointer items-center space-x-2">
          <i class="bi bi-person-fill" style="font-size: 1.5rem"></i>
          <span class="text-gray-400"> 好友 </span>
        </div>
      </div>
      <div class="mt-4">
        <p class="text-3 mb-2 text-gray-400">私人訊息</p>
        <div class="button-hover mb-2 flex cursor-pointer items-center p-1">
          <div class="default-image w-40px h-40px mr-2">
            <img alt="User" class="h-full w-full" src="@/assets/images/user1.jpg" />
          </div>
          <span class="text-gray-400"> ホタル </span>
          <span class="ml-auto">
            <i class="bi bi-x"></i>
          </span>
        </div>
      </div>
    </div>
    <div class="bg-#161f73 absolute bottom-0 w-60">
      <div class="flex items-center p-2">
        <div class="default-image w-40px h-40px">
          <img alt="User" class="h-full w-full" src="@/assets/images/user1.jpg" />
        </div>
        <div class="ml-2">
          <div class="text-sm text-white">ホタル</div>
          <div class="text-xs text-green-500">線上</div>
        </div>
        <div class="ml-auto flex space-x-2 text-gray-400">
          <span class="hover:bg-#2b3375 flex w-8 flex-1 cursor-pointer justify-center rounded">
            <i class="bi bi-mic-fill" style="font-size: 1.2rem"></i>
          </span>
          <span class="hover:bg-#2b3375 flex w-8 flex-1 cursor-pointer justify-center rounded">
            <i class="bi bi-volume-down-fill" style="font-size: 2rem; line-height: 0rem"></i>
          </span>
          <span class="hover:bg-#2b3375 flex w-8 flex-1 cursor-pointer justify-center rounded">
            <i class="bi bi-gear-fill" style="font-size: 1.2rem"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
  .abc {
    color: #2b3375;
  }
</style>
