<template>
  <div class="menu bg-#0c0c3 weak-text">
    <div class="menu-item" v-for="(item, index) in menuItems" :key="index">
      <div class="flex items-center justify-between">
        <div class="text-xs hover:text-white" @click="toggleSubMenu(index)">
          <span class="font-size-2.5">
            <i class="bi bi-chevron-down" v-if="item.isOpen"></i>
            <i class="bi bi-chevron-right" v-else></i>
          </span>
          {{ item.title }}
        </div>
        <span class="font-size-4.5 hover:text-white" @click="AddChannelDialogVisible = true">
          <i class="bi bi-plus"></i>
        </span>
      </div>
      <div class="sub-menu" v-show="item.isOpen">
        <div
          class="sub-menu-item hover:text-white"
          v-for="(subItem, subIndex) in item.subItems"
          :key="subIndex"
        >
          # {{ subItem }}
        </div>
      </div>
    </div>
  </div>
  <AddChannelDialog
    :dialog-visible="AddChannelDialogVisible"
    @update-visible="handleAddChannelDialog"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  interface MenuItem {
    title: string
    subItems: string[]
    isOpen: boolean
  }

  const menuItems = ref<MenuItem[]>([
    {
      title: '頻道類別',
      subItems: ['頻道 1-1', '頻道 1-2'],
      isOpen: true,
    },
    {
      title: '頻道類別',
      subItems: ['頻道 2-1', '頻道 2-2'],
      isOpen: true,
    },
  ])

  // 使用 ref 來追蹤 AddChannelDialog 的顯示狀態
  const AddChannelDialogVisible = ref(false)

  // 更新 AddChannelDialog 的顯示狀態
  const handleAddChannelDialog = (value: boolean) => {
    AddChannelDialogVisible.value = value
  }

  const toggleSubMenu = (index: number) => {
    menuItems.value[index].isOpen = !menuItems.value[index].isOpen
  }
</script>

<style scoped>
  .menu {
    width: 200px;
  }

  .menu-item {
    padding: 10px;
    cursor: pointer;
    position: relative;
  }

  .menu-item:hover {
  }

  .sub-menu {
    padding-left: 20px;
  }

  .sub-menu-item {
    padding: 5px 0;
  }
</style>
