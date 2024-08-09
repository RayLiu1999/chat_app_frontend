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
  // import { ref, onMounted, watch, nextTick } from 'vue'
  // import { useChatStore } from '@/stores/chat'

  // 使用 Pinia Store
  // const chatStore = useChatStore()
</script>

<style lang="scss"></style>
