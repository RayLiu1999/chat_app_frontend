<template>
  <!-- 外框保持固定寬高 -->
  <div :class="containerClass">
    <!-- 真正的 <img> -->
    <img
      :src="displaySrc"
      :alt="alt"
      :class="imgClass"
      @error="onImgError"
    />
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

const displaySrc = computed(() =>
  props.src ? props.src : defaultAvatar
)

const containerClass = computed(() => `overflow-hidden rounded-full flex-shrink-0 ${sizeMap[props.size]}`)
const imgClass       = computed(() => `object-cover ${sizeMap[props.size]}`)
</script>