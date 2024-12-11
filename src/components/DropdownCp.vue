<template>
  <div ref="dropdown" class="dropdown">
    <div
      class="dropdown-btn text flex items-center justify-between font-semibold"
      @click="toggleDropdown"
    >
      <button class="">Server Name</button>
      <i class="bi bi-chevron-down"></i>
    </div>
    <div v-if="isOpen" class="dropdown-content text">
      <a href="#option1">伺服器設定</a>
      <a href="#option2">選項 2</a>
      <a href="#option3">選項 3</a>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  // 控制下拉選單的顯示狀態
  const isOpen = ref(false)

  // 參考下拉選單 DOM 節點
  const dropdown = ref<HTMLDivElement | null>(null)

  // 切換下拉選單顯示與隱藏
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }

  // 點擊外部時關閉下拉選單
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
      isOpen.value = false
    }
  }

  // 掛載和卸載全域事件
  onMounted(() => {
    window.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside)
  })
</script>

<style scoped>
  /* 下拉選單容器 */
  .dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  /* 下拉按鈕樣式 */
  .dropdown-btn {
    background-color: #0c0c31;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.307);

    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .dropdown-btn:hover {
    background-color: #181d52;
  }

  /* 下拉內容樣式 */
  .dropdown-content {
    position: absolute;
    background-color: #090c17;
    width: 90%;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);

    overflow: hidden;
    z-index: 1;
    animation: dropdownFade 0.3s ease;
    margin: 5%;
  }

  .dropdown-content a {
    padding: 10px 15px;
    text-decoration: none;
    display: block;
    transition: background-color 0.3s ease;
  }

  .dropdown-content a:hover {
    background-color: #363da2;
  }

  /* 動畫效果 */
  @keyframes dropdownFade {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
