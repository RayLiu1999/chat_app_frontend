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
          @contextmenu.prevent="(event) => handleRightClick(event, typeof subItem === 'string' ? `${item.title}-${subIndex}` : subItem.id)"
        >
          # {{ typeof subItem === 'string' ? subItem : subItem.name }}
        </div>
      </div>
    </div>
    <PositionMenu ref="menuRef">
      <template #item>
        <li @click="editChannel(selectedChannelId)">編輯頻道</li>
        <li @click="deleteChannel(selectedChannelId)" class="danger">刪除頻道</li>
      </template>
    </PositionMenu>
  </div>
  <AddChannelDialog
    :dialog-visible="AddChannelDialogVisible"
    @update-visible="handleAddChannelDialog"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import PositionMenu from './PositionMenu.vue'

  interface Channel {
    id: string
    name: string
  }

  interface MenuItem {
    title: string
    subItems: Channel[] | string[]
    isOpen: boolean
  }

  const menuItems = ref<MenuItem[]>([
    {
      title: '頻道類別',
      subItems: [
        { id: 'channel-1-1', name: '頻道 1-1' },
        { id: 'channel-1-2', name: '頻道 1-2' }
      ],
      isOpen: true,
    },
    {
      title: '頻道類別',
      subItems: [
        { id: 'channel-2-1', name: '頻道 2-1' },
        { id: 'channel-2-2', name: '頻道 2-2' }
      ],
      isOpen: true,
    },
  ])

  const menuRef = ref<InstanceType<typeof PositionMenu> | null>(null)
  const selectedChannelId = ref('')

  // 使用 ref 來追蹤 AddChannelDialog 的顯示狀態
  const AddChannelDialogVisible = ref(false)

  // 更新 AddChannelDialog 的顯示狀態
  const handleAddChannelDialog = (value: boolean) => {
    AddChannelDialogVisible.value = value
  }

  const toggleSubMenu = (index: number) => {
    menuRef.value?.hideMenu()
    menuItems.value[index].isOpen = !menuItems.value[index].isOpen
  }

  const handleRightClick = (event: MouseEvent, channelId: string) => {
    // 阻止冒泡
    event.stopPropagation()
    
    // 顯示選單
    menuRef.value?.showMenu({
      x: event.clientX,
      y: event.clientY
    })
    
    // 儲存頻道 ID
    selectedChannelId.value = channelId
    console.log('右鍵點擊頻道 ID:', channelId)
  }

  // 編輯頻道
  const editChannel = (channelId: string) => {
    console.log('編輯頻道:', channelId)
    // 這裡可以實現編輯頻道的邏輯
    menuRef.value?.hideMenu()
  }

  // 刪除頻道
  const deleteChannel = (channelId: string) => {
    console.log('刪除頻道:', channelId)
    // 這裡可以實現刪除頻道的邏輯
    menuRef.value?.hideMenu()
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
