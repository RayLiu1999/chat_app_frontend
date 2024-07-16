<template>
  <div class="input-area">
    <input v-model="newMessage" placeholder="輸入訊息..." @keyup.enter="sendMessage" />
    <button @click="sendMessage">發送</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useChatStore } from '@/stores/chat'

export default defineComponent({
  name: 'ChatInput',
  setup() {
    const chatStore = useChatStore()
    const newMessage = ref('')

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        chatStore.addMessage({
          id: Date.now(),
          content: newMessage.value,
          userId: 'CurrentUser', // 這裡應該使用實際的用戶ID
          timestamp: new Date()
        })
        newMessage.value = ''
      }
    }

    return {
      newMessage,
      sendMessage
    }
  }
})
</script>

<style scoped>
.input-area {
  padding: 20px;
  display: flex;
}

input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
}
</style>