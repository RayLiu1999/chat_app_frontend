import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import type { Server, Message } from '@/types/chat'
import api from '@/api/axios'

export const useChatStore = defineStore('chat', () => {
  // 資料
  const servers = ref<Server[]>([])
  const channels = ref(['general', 'random', 'help'])
  const messages = ref<Message[]>([])

  // 當前狀態
  const currentChannel = ref('general')

  const userStore = useUserStore()
  const accessToken = userStore.accessToken
  const API_DOMAIN = import.meta.env.VITE_API_DOMAIN

  let API_URL = ''
  if (import.meta.env.ONLINE) {
    API_URL = 'wss://' + API_DOMAIN
  } else {
    API_URL = 'ws://' + API_DOMAIN
  }

  API_URL = API_URL + '/ws'
  API_URL = API_URL + `?token=${accessToken}`
  API_URL = API_URL + `&user_id=${userStore!.userData!.id}`
  API_URL = API_URL + `&room_id=fdssd`
  const socket = new WebSocket(API_URL)

  socket.onmessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data)
    console.log(message)
  }

  function addMessage(message: Message) {
    messages.value.push(message)

    // Send the message to the server
    console.log(JSON.stringify(message))
    socket.send(JSON.stringify(message))
  }

  // function setCurrentChannel(channel: string) {
  //   currentChannel.value = channel
  // }

  // 取得伺服器列表
  const fetchServerList = async () => {
    const response = await api.get('/servers')
    servers.value = response.data
    console.log(servers.value)
  }

  /**
   * 操作資料 Methods
   */

  return { servers, messages, channels, currentChannel, addMessage, fetchServerList }
})
