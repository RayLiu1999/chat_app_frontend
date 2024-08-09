<template>
  <div class="bg-#0d1245 relative w-60">
    <div class="p-4">
      <div class="bg-#0b0f3b border-blacks mb-4 flex flex-col items-center rounded border-b-2 p-3">
        <el-dropdown trigger="click">
          <span
            class="el-dropdown-link flex justify-between font-bold text-white"
            style="width: 13rem"
          >
            LaplusDRKNESS
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu class="w-54" style="background-color: #0b0f3b; border: none">
              <el-dropdown-item>Action 1</el-dropdown-item>
              <el-dropdown-item>Action 2</el-dropdown-item>
              <el-dropdown-item>Action 3</el-dropdown-item>
              <el-dropdown-item disabled>Action 4</el-dropdown-item>
              <el-dropdown-item divided>Action 5</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
    <BottomBar />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
</script>

<style lang="scss">
  .el-select__wrapper {
    background-color: #0d1245;
  }

  .el-select-dropdown__list {
    background-color: #0b0f3b;
  }
</style>
