<template>
  <!-- 透明遮罩層，點擊時隱藏選單 -->
  <div
    v-if="isVisible"
    class="menu-overlay"
    @click.stop.prevent="hiddenMenu"
    @contextmenu.stop.prevent="hiddenMenu"
    @mousedown.stop.prevent
    @mouseup.stop.prevent
    @touchstart.stop.prevent
    @touchend.stop.prevent
  ></div>
  
  <!-- 選單內容 -->
  <div
    v-if="isVisible"
    ref="menuRef"
    :style="menuStyle"
    class="custom-menu"
    @click.stop
    @contextmenu.stop.prevent
  >
    <ul>
      <slot name="item"></slot>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
  
  // 內部管理顯示狀態
  const isVisible = ref(false)
  
  // 內部管理位置
  const position = ref({ x: 0, y: 0 })
  
  // 選單 DOM 元素參考
  const menuRef = ref<HTMLElement | null>(null)
  
  // 選單尺寸資訊
  const menuWidth = ref(150) // 預設寬度
  const menuHeight = ref(150) // 預設高度
  
  // 計算選單最終定位
  const menuStyle = computed(() => {
    // 取得視窗尺寸
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    
    // 計算初始位置
    let x = position.value.x
    let y = position.value.y
    
    // 檢查右側是否有足夠空間
    if (x + menuWidth.value > windowWidth) {
      // 右側空間不足，向左展開
      x = x - menuWidth.value
    }
    
    // 檢查下方是否有足夠空間
    if (y + menuHeight.value > windowHeight) {
      // 下方空間不足，向上展開
      y = y - menuHeight.value
    }
    
    // 確保不會超出左上角
    x = Math.max(0, x)
    y = Math.max(0, y)
    
    return {
      left: `${x}px`,
      top: `${y}px`
    }
  })
  
  // 當選單顯示時，取得實際尺寸
  watch(isVisible, async (visible) => {
    if (visible) {
      // 等待 DOM 更新
      await nextTick()
      if (menuRef.value) {
        // 取得實際尺寸
        menuWidth.value = menuRef.value.offsetWidth
        menuHeight.value = menuRef.value.offsetHeight
      }
    }
  })

  // 隱藏選單函數
  const hiddenMenu = () => {
    isVisible.value = false
  }
  
  /**
   * 顯示選單
   * @param pos 選單顯示位置
   */
  const showMenu = (pos: { x: number; y: number }) => {
    // 更新位置
    position.value = pos
    // 顯示選單
    isVisible.value = true
  }
  
  // 暴露方法給外部使用
  defineExpose({
    showMenu,
    hideMenu: hiddenMenu
  })
  
  // 在元件掛載時取得預設尺寸
  onMounted(() => {
    if (menuRef.value) {
      menuWidth.value = menuRef.value.offsetWidth
      menuHeight.value = menuRef.value.offsetHeight
    }

    // 點 ESC 鍵隱藏下拉選單
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        hiddenMenu()
      }
    })
  })

  // 移除不需要的註釋

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        hiddenMenu()
      }
    })
  })

</script>

<style scoped>
  /* 遮罩層樣式 */
  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    z-index: 999;
    /* 確保點擊事件能被捕獲 */
    pointer-events: auto;
    /* 避免選擇文字 */
    user-select: none;
  }
  
  .custom-menu {
    position: fixed;
    background-color: #0f0f2b;
    padding: 10px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    width: max-content;
    min-width: 150px;
    z-index: 1000;
    border-radius: 4px;
    transition: opacity 0.15s ease-in-out;
  }
  .custom-menu ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .custom-menu :deep(li) {
    padding: 8px 12px;
    cursor: pointer;
    color: #ffffff;
    border-radius: 2px;
    transition: background-color 0.15s ease;
    white-space: nowrap;
  }
  .custom-menu :deep(li:hover) {
    background-color: #2f2f4f;
  }
  .custom-menu :deep(li.danger) {
    color: #ff4444;
  }
  .custom-menu :deep(li.danger:hover) {
    background-color: #3f2f2f;
  }
</style>
