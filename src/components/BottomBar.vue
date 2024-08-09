<template>
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
</template>
<script lang="ts" setup></script>
