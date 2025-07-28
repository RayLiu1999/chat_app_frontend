<template>
  <div class="bg-#0c0c31 relative w-60" @contextmenu="handleRightClick">
    <div>
      <DropdownCp />
      <div class="mt-4">
        <VerticalMenu />
      </div>
    </div>
    <BottomBar />
  </div>
  <PositionMenu ref="menuRef">
    <template #item>
      <li @click="createChannel">
        <i class="bi bi-hash mr-2"></i>建立文字頻道
      </li>
      <li @click="createVoiceChannel">
        <i class="bi bi-volume-up mr-2"></i>建立語音頻道
      </li>
      <li @click="createCategory" class="danger">
        <i class="bi bi-folder-plus mr-2"></i>建立類別
      </li>
    </template>
  </PositionMenu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import PositionMenu from './PositionMenu.vue'

const menuRef = ref<InstanceType<typeof PositionMenu> | null>(null)

const handleRightClick = (event: MouseEvent) => {
  event.preventDefault()
  menuRef.value?.showMenu({
    x: event.clientX,
    y: event.clientY
  })
}

const createChannel = () => {
  console.log('建立文字頻道')
  // 這個功能現在由 VerticalMenu 處理
  menuRef.value?.hideMenu()
}

const createVoiceChannel = () => {
  console.log('建立語音頻道')
  // 這個功能現在由 VerticalMenu 處理
  menuRef.value?.hideMenu()
}

const createCategory = () => {
  console.log('建立類別')
  // TODO: 實現建立類別功能
  menuRef.value?.hideMenu()
}
</script>

<style lang="scss" scoped>
.danger {
  color: #ed4245 !important;

  &:hover {
    background-color: #ed4245 !important;
    color: white !important;
  }
}
</style>
