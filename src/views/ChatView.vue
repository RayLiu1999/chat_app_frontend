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
      <!-- <RouterView name="userProfile"></RouterView> -->
      <!-- <RouterView name="memberList"></RouterView> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch, nextTick } from 'vue'
  import { useUserStore } from '@/stores/user'

  // 使用 Pinia Store
  const userStore = useUserStore()

  onMounted(() => {
    userStore.fetchUser()
  })
</script>

<style lang="scss"></style>
