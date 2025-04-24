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
        <li @click="createChannel">建立頻道</li>
        <li @click="createCategory" class="danger">建立類別</li>
      </template>
    </PositionMenu>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import PositionMenu from './PositionMenu.vue'

  const menuRef = ref<InstanceType<typeof PositionMenu> | null>(null)

  const handleRightClick = (event: MouseEvent) => {
    menuRef.value?.showMenu({
      x: event.clientX,
      y: event.clientY
    })
  }

  const createChannel = () => {
    console.log('建立頻道')
    menuRef.value?.hideMenu()
  }

  const createCategory = () => {
    console.log('建立類別')
    menuRef.value?.hideMenu()
  }
</script>
<style lang="scss" scoped></style>
