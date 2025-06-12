import defaultAvatar from '@/assets/images/user1.jpg'

// 圖片載入失敗時替換為預設頭像，並移除 onerror 以避免重複觸發閃爍
const onImgError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.onerror = null // 防止 fallback 也失敗時無限迴圈
  img.src = defaultAvatar
}

export { onImgError }
