<template>
  <div class="bg-#0c0c31 relative w-60" @contextmenu.prevent="handleRightClick">
    <div>
      <DropdownCp />
      <div class="mt-4">
        <VerticalMenu />
      </div>
    </div>
    <BottomBar />
  </div>
  <PositionMenu :position="menuPosition" v-model:visible="contextMenuVisible">
    <template #item>
      <li @click="">編輯頻道</li>
      <li @click="" class="danger">刪除頻道</li>
    </template>
  </PositionMenu>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const menuPosition = ref({ x: 0, y: 0 }) // 定義選單顯示位置
  const contextMenuVisible = ref(false) // 控制選單顯示與否

  const handleRightClick = (event: { clientX: number; clientY: number }) => {
    menuPosition.value = { x: event.clientX, y: event.clientY } // 設置選單位置
    contextMenuVisible.value = true // 顯示選單
  }
</script>
<style lang="scss" scoped></style>
