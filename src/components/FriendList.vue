<template>
  <div class="bg-#080a28 flex h-screen flex-1 flex-col text-white">
    <!-- Top Navigation Bar -->
    <div class="bg-#080a28 flex items-center p-4">
      <div class="mr-2 flex space-x-2">
        <div class="flex items-center">
          <span class="mr-1 text-gray-400">
            <i class="bi bi-person-fill" style="font-size: 1.4rem"></i>
          </span>
          <span class="text-whit font-bold">好友</span>
        </div>
        <div class="border-r border-gray-500 pl-2"></div>
      </div>
      <div class="flex space-x-4">
        <button class="hover:bg-#4d4e65f7 rounded px-1 text-gray-400 hover:text-white">線上</button>
        <button class="hover:bg-#4d4e65f7 rounded px-1 text-gray-400 hover:text-white">所有</button>
        <button class="hover:bg-#4d4e65f7 rounded px-1 text-gray-400 hover:text-white">
          等待中
        </button>
        <button class="hover:bg-#4d4e65f7 rounded px-1 text-gray-400 hover:text-white">
          已封鎖
        </button>
      </div>
      <button class="bg-#513a9a hover:bg-#5f4d9c ml-auto rounded px-4 py-1 text-white">
        新增好友
      </button>
    </div>
    <!-- Search Bar -->
    <div class="flex items-center p-2">
      <input class="bg-#14175a w-full rounded p-2 text-white" placeholder="搜尋" type="text" />
      <i class="fas fa-search ml-2 text-gray-400"> </i>
    </div>
    <!-- Friends List -->
    <div class="flex-1 overflow-y-auto p-4">
      <div class="mb-2 text-gray-400">線上 - 4</div>
      <div class="space-y-4">
        <!-- Friend Item -->
        <div v-for="item in 10" :key="item" class="flex items-center justify-between rounded p-2">
          <div class="flex items-center space-x-4">
            <div class="default-image w-40px h-40px">
              <img alt="User" class="h-full w-full cursor-pointer" src="" @error="handleError" />
            </div>
            <div>
              <div class="text-white">Ray</div>
              <div class="text-sm text-gray-400">正在玩 Apex Legends</div>
            </div>
          </div>
          <i class="fas fa-ellipsis-h text-gray-400"> </i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const handleError = (e: Event) => {
    const target = e.target as HTMLImageElement
    target.style.display = 'none'
  }
</script>

<style scoped>
  .abc {
    color: #503a9a95;
  }
</style>
