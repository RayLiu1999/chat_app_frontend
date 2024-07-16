<template>
  <div class="chat-container">
    <ChatSidebar />
    <div class="chat-main">
      <ChatMessages />
      <ChatInput />
    </div>
  </div>
  <div
    class="h-screen flex items-center justify-center text-5xl text-purple fw100 animate-bounce-alt animate-count-infinite animate-duration-1s"
  >
    UnoCSS
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ChatSidebar from '@/components/ChatSidebar.vue'
import ChatMessages from '@/components/ChatMessages.vue'
import ChatInput from '@/components/ChatInput.vue'

export default defineComponent({
  name: 'ChatView',
  components: {
    ChatSidebar,
    ChatMessages,
    ChatInput
  }
})
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
