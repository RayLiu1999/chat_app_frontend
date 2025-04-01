<template>
  <div class="chat-window">
    <div class="messages">
      <div v-for="message in messages" :key="message.id" class="message">
        <span class="username">{{ message.user }}:</span>
        <span class="content">{{ message.text }}</span>
      </div>
    </div>
    <MessageInput @send-message="sendMessage" />
  </div>
</template>

<script>
  import MessageInput from './MessageInput.vue'

  export default {
    components: {
      MessageInput,
    },
    data() {
      return {
        messages: [
          { id: 1, user: 'Alice', text: 'Hello everyone!' },
          { id: 2, user: 'Bob', text: 'Hi Alice!' },
        ],
      }
    },
    methods: {
      sendMessage(message) {
        this.messages.push({
          id: this.messages.length + 1,
          user: 'You',
          text: message,
        })
      },
    },
  }
</script>

<style>
  .chat-window {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background-color: #36393f;
    color: #fff;
  }

  .messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
  }

  .message {
    margin-bottom: 10px;
  }

  .username {
    font-weight: bold;
  }
</style>
