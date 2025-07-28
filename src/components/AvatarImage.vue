<template>
  <!-- 外框保持固定寬高 -->
  <div :class="containerClass" class="relative">
    <!-- 真正的 <img> -->
    <img
      :src="displaySrc"
      :alt="alt"
      :class="imgClass"
      @error="onImgError"
    />
    <!-- 狀態指示器 -->
    <div 
      v-if="status" 
      :class="statusClass"
      class="absolute rounded-full border-2"
      :style="statusStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onImgError } from '@/utils/image'
import defaultAvatar from '@/assets/images/user1.jpg'

/* -------- props -------- */
interface Props {
  src: string
  alt?: string
  size?: 'sm' | 'xs' | 'md' | 'xl' | 'lg'    // 預設 md
  status?: 'online' | 'offline'              // 狀態指示器：線上/離線
}
const props = withDefaults(defineProps<Props>(), {
  alt: '',
  size: 'md',
})

/* -------- class 計算 -------- */
const sizeMap = {
  sm: 'w-6 h-6',   // Tailwind size-6
  xs: 'w-8 h-8',   // Tailwind size-8
  md: 'w-10 h-10', // Tailwind size-10
  xl: 'w-12 h-12', // Tailwind size-12
  lg: 'w-16 h-16', // Tailwind size-16
}

// 狀態指示器大小映射（相對於頭像大小）
const statusSizeMap = {
  sm: 'w-2.5 h-2.5',   // 10px
  xs: 'w-3 h-3',       // 12px
  md: 'w-3.5 h-3.5',   // 14px
  xl: 'w-4 h-4',       // 16px
  lg: 'w-5 h-5',       // 20px
}

// 狀態指示器位置映射（負值讓指示器超出頭像邊界）
const statusPositionMap = {
  sm: 'bottom-0 right-0 translate-x-1/8 translate-y-1/8',
  xs: 'bottom-0 right-0 translate-x-1/8 translate-y-1/8', 
  md: 'bottom-0 right-0 translate-x-1/6 translate-y-1/6',
  xl: 'bottom-0 right-0 translate-x-1/6 translate-y-1/6',
  lg: 'bottom-0 right-0 translate-x-1/4 translate-y-1/4',
}

const displaySrc = computed(() =>
  props.src ? props.src : defaultAvatar
)

const containerClass = computed(() => `rounded-full flex-shrink-0 ${sizeMap[props.size]}`)
const imgClass = computed(() => `object-cover rounded-full ${sizeMap[props.size]}`)

// 狀態指示器樣式
const statusClass = computed(() => {
  const baseClass = `${statusSizeMap[props.size]} ${statusPositionMap[props.size]}`
  const colorClass = props.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
  return `${baseClass} ${colorClass}`
})

// 狀態指示器的邊框顏色（與背景色相同以形成邊框效果）
const statusStyle = computed(() => {
  // 使用深色邊框來確保在各種背景下都清楚可見
  return {
    borderColor: '#2f3349', // 深色邊框，確保與狀態顏色形成對比
    boxShadow: '0 0 0 2px #2f3349', // 額外的陰影邊框效果
  }
})
</script>