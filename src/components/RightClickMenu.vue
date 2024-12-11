<template>
  <div
    v-if="visible"
    :style="{ top: `${position.y}px`, left: `${position.x}px` }"
    class="custom-menu"
  >
    <ul>
      <slot name="top"></slot>
      <slot name="middle"></slot>
      <slot name="bottom"></slot>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'

  const props = defineProps<{
    items: string[] // 接收的選單項目
    position: { x: number; y: number } // 接收的顯示位置
    visible: boolean // 控制選單顯示與否
  }>()

  // 伺服器設定下拉選單
  // const menuX = ref(0)
  // const menuY = ref(0)
  // const showMenu = ref(false)

  // const props = defineProps<{
  //   dialogVisible: boolean
  // }>()

  // const emit = defineEmits<{
  //   (event: 'menuStatus', menuX: number, menuY: number, showMenu: boolean): void
  // }>()

  // watch(
  //   () => props.dialogVisible,
  //   (newValue) => {
  //     showMenu.value = newValue
  //   },
  // )

  // watch(
  //   () => showMenu.value,
  //   (value) => {
  //     emit('menuStatus', menuX.value, menuY.value, value)
  //   },
  // )
</script>

<style scoped>
  .custom-menu {
    position: absolute;
    background-color: #000000;
    padding: 10px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    width: 150px;
    z-index: 1000;
  }
  .custom-menu ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  /* 使用 :deep 來確保樣式能應用到 slot 內容 */
  .custom-menu :deep(li) {
    padding: 5px 10px;
    cursor: pointer;
    color: #ffffff;
  }
  .custom-menu :deep(li:hover) {
    background-color: #2f2f2f;
  }
  .custom-menu :deep(li.danger) {
    color: #ff4444;
  }
  .custom-menu :deep(li.danger:hover) {
    background-color: #3f2f2f;
  }
</style>
