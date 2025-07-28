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
  let socket: WebSocket | null = null
  const wsOptions = {
    reconnectDelay: 1000, // 重連間隔
    maxReconnectAttempts: 5, // 最大重連次數
    reconnectBackoff: 2, // 指數退避倍數
    heartbeatInterval: 30000, // 心跳間隔
    maxMessageSize: 1024 * 1024, // 1MB 訊息大小限制
  }
  let reconnectAttempts: number = 0 // 重連次數
  let isConnecting: boolean = false // 連線狀態
  let shouldReconnect: boolean = true // 是否應該重連
  let API_URL = ''
  if (import.meta.env.ONLINE) {
    API_URL = 'wss://' + API_DOMAIN
  } else {
    API_URL = 'ws://' + API_DOMAIN
  }

  let pingInterval: number | undefined
  let reconnectTimer: number | undefined

  // 初始化 WebSocket 連接
  const wsConnect = async (): Promise<boolean> => {
    if (isConnecting || (socket && socket.readyState === WebSocket.CONNECTING)) {
      return false
    }

    const userStore = useUserStore()
    const accessToken = userStore.accessToken

    return new Promise<boolean>((resolve, reject) => {
      try {
        isConnecting = true
        cleanupConnection() // 關閉舊的連接

        // 加入 token 到 URL
        const wsUrl = `${API_URL}/ws?token=${accessToken}`
        socket = new WebSocket(wsUrl)

        socket.onopen = () => {
          console.log('WebSocket 連接已建立')
          isConnecting = false
          reconnectAttempts = 0 // 重置重連計數
          startHeartbeat()

          resolve(true)
        }

        socket.onmessage = (event) => {
          try {
            // 檢查訊息大小限制
            const messageSize = new Blob([event.data]).size
            if (messageSize > wsOptions.maxMessageSize) {
              console.error('訊息過大:', messageSize, '最大限制:', wsOptions.maxMessageSize)
              return
            }

            // 處理心跳回應
            if (event.data === 'pong') {
              return
            }

            // 嘗試解析 JSON
            let wsMessage: MessageAPI.WsResponseMessage
            try {
              wsMessage = JSON.parse(event.data)
            } catch (parseError) {
              console.error('JSON 解析錯誤:', parseError, '原始資料:', event.data)
              return
            }

            console.log('接收 ws:', wsMessage)

            if (wsMessage.action === 'send_message') {
              messages.value.push(wsMessage.data)
            } else if (wsMessage.action === 'join_room') {
              if (wsMessage.data.status === 'error') {
                ElMessage.error('加入房間失敗')
                // 跳回好友列表
                router.push('/channels/@me')
              }
            } else if (wsMessage.action === 'pong') {
              // 收到 ping 回應，無需處理
            } else {
              console.warn('未知的 WebSocket 訊息:', wsMessage)
            }
          } catch (error) {
            console.error('處理 WebSocket 訊息時發生錯誤:', error)
          }
        }

        socket.onclose = (event) => {
          console.log('WebSocket 連接已關閉', event.code, event.reason)
          isConnecting = false
          stopHeartbeat()

          // 判斷是否為異常斷線
          if (!event.wasClean && shouldReconnect) {
            console.log('WebSocket 異常斷線，準備重連')
            handleReconnect()
          }
        }

        socket.onerror = (error) => {
          console.error('WebSocket 錯誤:', error)
          isConnecting = false
          socket?.close() // 關閉連接以觸發重連
        }
      } catch (error) {
        console.error('連線失敗，錯誤:', error)
        isConnecting = false
        resolve(false)
      }
    })
  }

  // 心跳機制
  const startHeartbeat = () => {
    stopHeartbeat()
    pingInterval = window.setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const request = { action: 'ping' }
        socket.send(JSON.stringify(request))
      }
    }, wsOptions.heartbeatInterval)
  }

  // 停止心跳機制
  const stopHeartbeat = () => {
    if (pingInterval) {
      clearInterval(pingInterval)
      pingInterval = undefined
    }
  }

  // 重連機制
  const handleReconnect = () => {
    if (!shouldReconnect || reconnectAttempts >= wsOptions.maxReconnectAttempts) {
      console.error('達到最大重連次數，停止重連', reconnectAttempts)
      return
    }

    reconnectAttempts++
    const delay = wsOptions.reconnectDelay * Math.pow(wsOptions.reconnectBackoff, reconnectAttempts - 1)

    console.log(`嘗試重連 ${reconnectAttempts}/${wsOptions.maxReconnectAttempts}，延遲 ${delay}ms`)

    reconnectTimer = window.setTimeout(() => {
      wsConnect()
    }, delay)
  }

  // 清理舊連線（不影響重連狀態）
  const cleanupConnection = () => {
    stopHeartbeat()

    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = undefined
    }

    if (socket) {
      socket.close()
      socket = null
    }
  }

  // 完全關閉 WebSocket 連接（停止重連）
  const disWsConnect = async () => {
    shouldReconnect = false
    cleanupConnection()
  }

  // 發送訊息
  const sendMessage = (message: MessageAPI.Request.SendMessage) => {
    if (!checkWsConnection()) {
      console.error('WebSocket 未連接，無法發送訊息')
      return false
    }

    try {
      const request: MessageAPI.WsRequestMessage = {
        action: 'send_message',
        data: message,
      }

      const messageString = JSON.stringify(request)

      // 檢查訊息大小
      const messageSize = new Blob([messageString]).size
      if (messageSize > wsOptions.maxMessageSize) {
        console.error('訊息過大:', messageSize, '最大限制:', wsOptions.maxMessageSize)
        return false
      }

      socket!.send(messageString)
      return true
    } catch (error) {
      console.error('發送訊息時發生錯誤:', error)
      return false
    }
  }

  // 加入房間(Server Channel or Private Chat)
  const joinRoom = async (data: MessageAPI.Request.JoinRoom) => {
    if (!checkWsConnection()) {
      console.error('WebSocket 未連接，無法加入房間')
      return false
    }

    try {
      const request: MessageAPI.WsRequestMessage = {
        action: 'join_room',
        data: data,
      }

      socket!.send(JSON.stringify(request))
      return true
    } catch (error) {
      console.error('加入房間時發生錯誤:', error)
      return false
    }
  }

  // 檢查 WebSocket 連接
  const checkWsConnection = (): boolean => {
    return socket !== null && socket.readyState === WebSocket.OPEN
  }

  // 獲取連線狀態
  const getWsState = (): string => {
    if (!socket) return 'DISCONNECTED'

    switch (socket.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING'
      case WebSocket.OPEN: return 'OPEN'
      case WebSocket.CLOSING: return 'CLOSING'
      case WebSocket.CLOSED: return 'CLOSED'
      default: return 'UNKNOWN'
    }
  }

  // 監聽 visibilitychange 事件
  const setupVisibilityListener = () => {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('頁面可見，檢查 WebSocket 狀態')
        if (!checkWsConnection()) {
          console.log('WebSocket 未連接，嘗試重新連接')
          shouldReconnect = true
          wsConnect()
        }
      }
    })
  }

  // 初始化 visibilitychange 監聽器
  setupVisibilityListener()

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
  const fetchHideDMRoom = async (dm_room_id: string) => {
    await api.put(`/dm_rooms`, { room_id: dm_room_id, is_hidden: true })
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
    getWsState,
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
