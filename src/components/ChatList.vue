<template>
  <div class="bg-#0d1245 relative w-60">
    <div class="p-4">
      <div class="mb-4">
        <input
          class="bg-#14175a text w-full rounded p-2"
          placeholder="搜尋或開始一個對話"
          type="text"
          @click="console.log(123)"
        />
      </div>
      <div class="button-hover space-y-2 p-1">
        <div class="flex cursor-pointer items-center space-x-2">
          <i class="bi bi-person-fill" style="font-size: 1.5rem"></i>
          <span class="weak-text"> 好友 </span>
        </div>
      </div>
      <div class="mt-4">
        <p class="text-3 weak-text mb-2">私人訊息</p>
        <div class="button-hover mb-2 flex cursor-pointer items-center p-1">
          <div class="default-image w-40px h-40px mr-2">
            <img alt="User" class="h-full w-full" src="@/assets/images/user1.jpg" />
          </div>
          <span class="weak-text"> ホタル </span>
          <span class="ml-auto">
            <i class="bi bi-x"></i>
          </span>
        </div>
      </div>
    </div>
    <BottomBar />
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
