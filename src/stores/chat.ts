import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import type { Message, DMRoom } from '@/types/chat'
import type { MessageAPI, DMRoomAPI } from '@/types/api' 
import api from '@/api/axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export const useChatStore = defineStore('chat', () => {
  const router = useRouter()

  // 資料
  const channels = ref(['general', 'random', 'help'])
  const messages = ref<Message[]>([])
  const dm_rooms = ref<DMRoom[]>([])

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

  let pingInterval: number | undefined

  // 初始化 WebSocket 連接
  const wsConnect = async (): Promise<boolean> => {
    const userStore = useUserStore()
    const accessToken = userStore.accessToken

    return new Promise<boolean>((resolve, reject) => {
      try {
        disWsConnect() // 關閉舊的連接

        // 加入 token 到 URL
        const wsUrl = `${API_URL}/ws?token=${accessToken}`
        socket = new WebSocket(wsUrl)

        socket.onopen = () => {
          console.log('WebSocket 連接已建立')
          reconnectAttempts = 0 // 重置重連計數
          // 啟動 ping timer，每 30 秒發送一次
          pingInterval = window.setInterval(sendPing, 30000)
          resolve(true)
        }

        socket.onmessage = (event) => {
          const wsMessage: MessageAPI.WsResponseMessage = JSON.parse(event.data)
          console.log(wsMessage)

          if (wsMessage.action === 'send_message') {
            messages.value.push(wsMessage.data)
          }
          else if (wsMessage.action === 'join_room') {
            if (wsMessage.data.status === 'error') {
              // ElMessage.error('加入房間失敗')
              // 跳回好友列表
              router.push('/channels/@me')
            }
          }
        }

        socket.onclose = () => {
          console.log('WebSocket 連接已關閉')
          if (pingInterval) {
            clearInterval(pingInterval)
            pingInterval = undefined
          }
          reWsConnect()
        }

        socket.onerror = (error) => {
          console.error('WebSocket 錯誤:', error)
          socket?.close() // 關閉連接以觸發重連
        }
      } catch (error) {
        console.error('連線失敗，錯誤:', error)
        resolve(false)
      }
    })
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
    if (pingInterval) {
      clearInterval(pingInterval)
      pingInterval = undefined
    }
    if (socket) {
      socket.close()
    }
  }

  // 發送訊息
  const sendMessage = (message: MessageAPI.Request.SendMessage) => {
    if (checkWsConnection() === false) return

    const request: MessageAPI.WsRequestMessage = {
      action: 'send_message',
      data: message,
    }

    socket.send(JSON.stringify(request))
  }

  // 加入房間(Server Channel or Private Chat)
  const joinRoom = async (data: MessageAPI.Request.JoinRoom) => {
    if (checkWsConnection() === false) return

    const request: MessageAPI.WsRequestMessage = {
      action: 'join_room',
      data: data,
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

  const sendPing = () => {
    if (checkWsConnection()) {
      const request = { action: 'ping' }
      socket.send(JSON.stringify(request))
    }
  }

  // function setCurrentChannel(channel: string) {
  //   currentChannel.value = channel
  // }

  // 取得DM聊天室列表
  const fetchDMRoomList = async () => {
    const { data: response } = await api.get('/dm_rooms')
    const data = response.data as DMRoom[]
    dm_rooms.value = data

    return data
  }

  /**
   * 建立DM聊天室
   * @param dm_room DMRoomAPI.Request.Create
   * @returns DMRoom
   */
  const fetchCreateDMRoom = async (dm_room: DMRoomAPI.Request.Create) => {
    const { data: response } = await api.post('/dm_rooms', dm_room)
    const data = response.data as DMRoom

    // 如果ID重複，則更新
    const index = dm_rooms.value.findIndex((c) => c.room_id === data.room_id)
    if (index !== -1) {
      dm_rooms.value[index] = data
    } else {
      dm_rooms.value.push(data)
    }

    return data
  }

  // 隱藏DM聊天室
  const fetchHideDMRoom = async ( dm_room_id: string) => {
    await api.put(`/dm_rooms`, { room_id: dm_room_id,  is_hidden: true })
    dm_rooms.value = dm_rooms.value.filter((c) => c.room_id !== dm_room_id)
    router.push('/channels/@me')
  }

  // 取得DM聊天室訊息
  const fetchDMMessages = async (message: MessageAPI.Request.GetMessages) => {
    const params: { before?: string; limit: number } = { limit: message.limit }
    if (message.message_id) {
      params.before = message.message_id
    }
    const { data: response } = await api.get('/dm_rooms/' + message.room_id + '/messages', { params })
    const data = response.data as Message[]

    // 依序加入
    messages.value.push(...data)

    // 去重
    messages.value = messages.value.filter((item, index) => messages.value.findIndex((t) => t.id === item.id) === index)

    // 排序
    messages.value.sort((a, b) => a.timestamp - b.timestamp)

    return data
  }

  // 取得頻道訊息
  const fetchChannelMessages = async (message: MessageAPI.Request.GetMessages) => {
    const params: { before?: string; limit: number } = { limit: message.limit }
    if (message.message_id) {
      params.before = message.message_id
    }
    const { data: response } = await api.get('/channels/' + message.room_id + '/messages', { params })
    const data = response.data as Message[]

    // 依序加入
    messages.value.push(...data)

    // 去重
    messages.value = messages.value.filter((item, index) => messages.value.findIndex((t) => t.id === item.id) === index)

    // 排序
    messages.value.sort((a, b) => a.timestamp - b.timestamp)

    return data
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
    messages,
    channels,
    dm_rooms,
    currentChannel,
    fetchHideDMRoom,
    fetchDMRoomList,
    fetchCreateDMRoom,
    fetchDMMessages,
    fetchChannelMessages
  }
})
