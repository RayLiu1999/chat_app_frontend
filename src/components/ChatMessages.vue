<template>
  <div class="messages">
    <div v-for="message in messages" :key="message.id" class="message">
      <strong>{{ message.userId }}</strong>
      <p>{{ message.content }}</p>
      <small>{{ formatDate(message.timestamp) }}</small>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useChatStore } from '@/stores/chat'

export default defineComponent({
  name: 'ChatMessages',
  setup() {
    const chatStore = useChatStore()
    
    const messages = computed(() => chatStore.messages)

    const formatDate = (date: Date): string => {
      return new Date(date).toLocaleString()
    }

    return {
      messages,
      formatDate
    }
  }
})
</script>

<style scoped>
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  margin-bottom: 15px;
}
</style>