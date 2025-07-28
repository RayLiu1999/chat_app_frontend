<template>
  <ChatRoom 
    room-type="channel" 
    :room-id="channelId" 
  />
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, computed, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import { useChatStore } from '@/stores/chat'
  import { ElScrollbar } from 'element-plus'
  import ChatRoom from '@/components/ChatRoom.vue'


  // 使用 Pinia Store
  const chatStore = useChatStore()

  // 獲取當前路由信息
  const route = useRoute()
  const channelId = route.params.channel_id as string

  // 使用 ref 來追蹤 ElScrollbar 的實例
  const innerRef = ref<HTMLElement | null>(null)
  const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

  // 資料
  const messages = computed(() => chatStore.messages)

  // 卷軸捲到底部
  const scrollToBottom = async () => {
    scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
  }

  // 延遲捲到底部
  const delayedScrollToBottom = async () => {
    await nextTick()
    await scrollToBottom()
  }

  const loadingMore = ref(false)

  const loadMore = async () => {
    // 僅當訊息數為 50 的倍數時才繼續請求（代表前一次抓取滿 50 筆）
    if (messages.value.length === 0 || messages.value.length % 50 !== 0) return
    if (loadingMore.value) return
    loadingMore.value = true
    const wrapper = scrollbarRef.value?.wrapRef as HTMLElement
    const prevHeight = wrapper.scrollHeight
    const topMsgId = messages.value[0].id // 假設 Message 裡有 id
    await chatStore.fetchChannelMessages({
      room_id: channelId,
      message_id: topMsgId,
      limit: 50,
    })
    // 保持卷軸位置不跳動
    await nextTick(() => {
      const newHeight = wrapper.scrollHeight
      wrapper.scrollTop = newHeight - prevHeight
    })
    loadingMore.value = false
  }

  onMounted(async () => {
    await chatStore.joinRoom({
      room_type: 'channel',
      room_id: channelId,
    })
    await chatStore.fetchChannelMessages({
      room_id: channelId,
      limit: 50,
    })
    await delayedScrollToBottom()

    const wrapper = scrollbarRef.value?.wrapRef as HTMLElement
    wrapper.addEventListener('scroll', () => {
      if (wrapper.scrollTop === 0) {
        loadMore()
      }
    })
  })

  // 允許 20px 誤差
  const isUserNearBottom = (): boolean => {
    const wrapper = scrollbarRef.value?.wrapRef as HTMLElement | undefined
    if (!wrapper) return true // 尚未掛載前就直接回 true
    const threshold = 20
    return wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight - threshold
  }

  // 監聽訊息列表
  watch(
    () => messages.value.length,
    async () => {
      if (isUserNearBottom()) {
        await delayedScrollToBottom()
      }
    },
  )
</script>


