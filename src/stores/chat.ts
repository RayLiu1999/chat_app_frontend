import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Message {
  id: number
  content: string
  userId: string
  timestamp: Date
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([])
  const channels = ref(['general', 'random', 'help'])
  const currentChannel = ref('general')
  // const socket = new WebSocket('ws://localhost:8080/ws')

  // socket.onmessage = (event: MessageEvent) => {
  //   const message = JSON.parse(event.data)
  //   console.log(message)
  // }

  // function addMessage(message: Message) {
  //   messages.value.push(message)

  //   // Send the message to the server
  //   socket.send(JSON.stringify(message))
  // }

  // function setCurrentChannel(channel: string) {
  //   currentChannel.value = channel
  // }

  return { messages, channels, currentChannel }
})
