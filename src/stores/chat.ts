import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import type { Server, Message } from '@/types/chat'
import type { ServerAPI, MessageAPI } from '@/types/api' 
import api from '@/api/axios'

export const useChatStore = defineStore('chat', () => {
  // 資料
  const servers = ref<Server[]>([])
  const channels = ref(['general', 'random', 'help'])
  const messages = ref<Message[]>([])

  // 當前狀態
  const currentChannel = ref('general')
  const API_DOMAIN = import.meta.env.VITE_API_DOMAIN

  // WebSocket
  let socket: WebSocket
  let reconnectInterval: number = 1000 // 重連間隔
  const maxReconnectAttempts: number = 5 // 最大重連次數
  let reconnectAttempts: number = 0 // 重連次數
  let API_URL = ''
  if (import.meta.env.ONLINE) {
    API_URL = 'wss://' + API_DOMAIN
  } else {
    API_URL = 'ws://' + API_DOMAIN
  }

  // 初始化 WebSocket 連接
  const wsConnect = async () => {
    const userStore = useUserStore()
    const accessToken = userStore.accessToken

    try {
      await disWsConnect() // 關閉舊的連接

      // 加入 token 到 URL
      const wsUrl = `${API_URL}/ws?token=${accessToken}&user_id=${userStore.userData!.id}`
      socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        console.log('WebSocket 連接已建立')
        reconnectAttempts = 0 // 重置重連計數
      }

      socket.onmessage = (event) => {
        const wsMessage: MessageAPI.WsMessage<MessageAPI.Response.OnMessage> = JSON.parse(event.data)
        if (wsMessage.type === 'send_message') {
          messages.value.push(wsMessage.data)
        }
      }

      socket.onclose = () => {
        console.log('WebSocket 連接已關閉')
        reWsConnect()
      }

      socket.onerror = (error) => {
        console.error('WebSocket 錯誤:', error)
        socket?.close() // 關閉連接以觸發重連
      }
    } catch (error) {
      console.error('連線失敗，錯誤:', error)
    }
  }

  // 重連
  const reWsConnect = () => {
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts++
        console.log(`重連嘗試 ${reconnectAttempts}`)
        reconnectInterval *= 2 // 指數增長
        wsConnect()
      }, reconnectInterval)
    } else {
      console.log('達到最大重連次數，停止重連')
    }
  }

  // 關閉 WebSocket 連接
  const disWsConnect = async () => {
    if (socket) {
      socket.close()
    }
  }

  // 發送訊息
  const sendMessage = (message: MessageAPI.Request.SendMessage) => {
    if (checkWsConnection() === false) return

    const request: MessageAPI.WsMessage<MessageAPI.Request.SendMessage> = {
      type: 'send_message',
      data: message,
    }

    socket.send(JSON.stringify(request))
  }

  // 加入房間(Server Channel or Private Chat)
  const joinRoom = (join_room: MessageAPI.Request.JoinRoom) => {
    if (checkWsConnection() === false) return

    const request: MessageAPI.WsMessage<MessageAPI.Request.JoinRoom> = {
      type: 'join_room',
      data: join_room,
    }

    socket.send(JSON.stringify(request))
  }

  // 檢查 WebSocket 連接
  const checkWsConnection = (): boolean => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      return true
    } else {
      return false
    }
  }

  // function setCurrentChannel(channel: string) {
  //   currentChannel.value = channel
  // }

  // 取得伺服器列表
  const fetchServerList = async () => {
    const response = await api.get('/servers')
    servers.value = response.data as Server[]
    console.log(servers.value)
  }

  // 創建伺服器
  const createServer = async (server: ServerAPI.Request.Create) => {
    const formData = new FormData()
    formData.append('name', server.name)
    if (server.picture) {
      formData.append('picture', server.picture)
    }

    const response = await api.post('/servers', formData)
    servers.value.push(response.data as Server)
  }

  /**
   * 操作資料 Methods
   */

  return {
    wsConnect,
    disWsConnect,
    checkWsConnection,
    joinRoom,
    sendMessage,
    servers,
    messages,
    channels,
    currentChannel,
    fetchServerList,
    createServer,
  }
})
