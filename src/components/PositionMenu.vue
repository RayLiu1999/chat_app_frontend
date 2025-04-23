<template>
  <div
    v-if="visible"
    ref="menuRef"
    :style="menuStyle"
    class="custom-menu"
  >
    <ul>
      <slot name="item"></slot>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
  
  const props = defineProps<{
    position: { x: number; y: number } // 接收的顯示位置
    visible: boolean // 控制選單顯示與否
  }>()
  
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
    let x = props.position.x
    let y = props.position.y
    
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
  watch(() => props.visible, async (isVisible) => {
    if (isVisible) {
      // 等待 DOM 更新
      await nextTick()
      if (menuRef.value) {
        // 取得實際尺寸
        menuWidth.value = menuRef.value.offsetWidth
        menuHeight.value = menuRef.value.offsetHeight
      }
    }
  })
  
  // 在元件掛載時取得預設尺寸
  onMounted(() => {
    if (menuRef.value) {
      menuWidth.value = menuRef.value.offsetWidth
      menuHeight.value = menuRef.value.offsetHeight
    }

    window.addEventListener('click', hiddenMenu)
    // 點ESC鍵隱藏下拉選單
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        hiddenMenu()
      }
    })
  })

  // 定義 emit 函數
  const emit = defineEmits<{
    'update:visible': [value: boolean]
  }>()

  const hiddenMenu = () => {
    // 使用 emit 通知父組件更新 visible 的值
    emit('update:visible', false)
  }

  onBeforeUnmount(() => {
    window.removeEventListener('click', hiddenMenu)
    window.removeEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        hiddenMenu()
      }
    })
  })

</script>

<style scoped>
  .custom-menu {
    position: absolute;
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
