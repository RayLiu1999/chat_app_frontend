<template>
  <div class="w-100% flex h-screen">
    <!-- Server Bar -->
    <ServerSideBar />
    <!-- Main Area -->
    <div class="flex flex-1">
      <!-- Side Content -->
      <RouterView name="chatList"></RouterView>
      <RouterView name="channelList"></RouterView>
      <!-- Main Content -->
      <RouterView name="friendList"></RouterView>
      <RouterView name="chatRoom"></RouterView>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, nextTick } from 'vue'
  import { useChatStore } from '@/stores/chat'
  import { ElScrollbar } from 'element-plus'
  import ChatList from '@/components/ChatList.vue'
  import ChatRoom from '@/components/ChatRoom.vue'

  // 使用 ref 來追蹤 ElScrollbar 的實例
  const innerRef = ref<HTMLElement | null>(null)
  const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

  // 使用 Pinia Store
  const chatStore = useChatStore()

  // 訊息列表
  const messages = ref([
    { id: 1, text: 'Hello' },
    { id: 2, text: 'How are you?' },
    { id: 3, text: 'I am fine, thank you!' },
    // 更多消息...
  ])

  // 卷軸捲到底部
  const scrollToBottom = async () => {
    scrollbarRef.value!.setScrollTop(innerRef.value!.clientHeight)
  }

  const delayedScrollToBottom = async () => {
    await nextTick()
    await scrollToBottom()
  }

  onMounted(async () => {
    await delayedScrollToBottom()
  })

  watch(messages, async (newMessages, oldMessages) => {
    delayedScrollToBottom()
  })
</script>

<style lang="scss">
  .custom-scrollbar {
    background-color: #080a28;
  }

  .channel-group:hover .host-border-active,
  .channel-group:hover .host-border-none {
    height: 10px;
  }
</style>
