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
  <RightClickMenu @menu-action="handleMenuAction" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const handleRightClick = (event: { clientX: number; clientY: number }) => {
    //   // 取得滑鼠位置
    //   menuX.value = event.clientX
    //   menuY.value = event.clientY
    //   // 顯示下拉選單
    //   showMenu.value = true
  }
  const handleMenuAction = (menuX: number, menuY: number) => {
    // Handle the menu action here
  }
</script>
<style lang="scss" scoped></style>
