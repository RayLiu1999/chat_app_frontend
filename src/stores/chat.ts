import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTokenStore } from './token'

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
  const tokenStore = useTokenStore()
  const accessToken = tokenStore.accessToken
  const API_DOMAIN = import.meta.env.VITE_API_DOMAIN
  let API_URL = ''
  if (import.meta.env.ONLINE) {
    API_URL = 'wss://' + API_DOMAIN
  } else {
    API_URL = 'ws://' + API_DOMAIN
  }
  API_URL = API_URL + '/auth/ws'
  API_URL = API_URL + `?token=${accessToken}`
  const socket = new WebSocket(API_URL)

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
