<template>
  <div class="sidebar">
    <h2>頻道</h2>
    <ul>
      <li v-for="channel in channels" :key="channel" @click="selectChannel(channel)">
        {{ channel }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useChatStore } from '@/stores/chat'

export default defineComponent({
  name: 'ChatSidebar',
  setup() {
    const chatStore = useChatStore()
    const channels = ref(chatStore.channels)

    const selectChannel = (channel: string) => {
      chatStore.setCurrentChannel(channel)
    }

    return {
      channels,
      selectChannel
    }
  }
})
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #2f3136;
  color: #ffffff;
  padding: 20px;
}
</style>