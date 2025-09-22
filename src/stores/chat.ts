import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import type { Message, DMRoom } from '@/types/chat'
import type { MessageAPI, DMRoomAPI, APIResponse } from '@/types/api'
import api from '@/api/axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { ClientToServer, ServerToClient } from '@/types/ws'
import { handleAPIResponse, handleDeleteResponse } from '@/api/utils'

export const useChatStore = defineStore('chat', () => {
  const router = useRouter()

  // 資料
  const channels = ref(['general', 'random', 'help'])
  const messageCache = ref<Record<string, Message[]>>({}) // 訊息快取
  const messages = computed(() => messageCache.value[currentRoomId.value] || [])
  const dmRooms = ref<DMRoom[]>([])

  // 當前狀態
  const currentChannel = ref('general')
  const currentRoomId = ref<string>('') // 當前房間 ID
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
  if (import.meta.env.VITE_ONLINE === 'true') {
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

            // 嘗試解析 JSON
            let wsMessage: ServerToClient.Message
            try {
              wsMessage = JSON.parse(event.data)
            } catch (parseError) {
              console.error('JSON 解析錯誤:', parseError, '原始資料:', event.data)
              return
            }

            console.log('接收 ws:', wsMessage)

            // 分發事件
            const customEvent = new CustomEvent(wsMessage.action, { detail: wsMessage.data })
            window.dispatchEvent(customEvent)

            // 處理核心訊息
            switch (wsMessage.action) {
              case 'pong':
                // 心跳回應，不需要特殊處理
                break
              case 'new_message': {
                const newMessage: Message = wsMessage.data
                const roomId = newMessage.room_id
                if (messageCache.value[roomId]) {
                  messageCache.value[roomId].push(newMessage)
                }
                break
              }
              case 'room_joined':
                // ElMessage.success(wsMessage.data.message)
                break
              case 'room_left':
                // ElMessage.info(wsMessage.data.message)
                break
              case 'message_sent':
                // ElMessage.success('訊息發送成功')
                messages.value.push(wsMessage.data)
                break
              case 'error':
                ElMessage.error(`WebSocket 錯誤: ${wsMessage.data.message}`)
                if (wsMessage.data.original_action === 'join_room') {
                  router.push('/channels/@me')
                }
                break
              case 'user_status':
                // 用戶狀態更新，由其他 store 處理
                break
              case 'voice_call_notification':
                // 語音通話通知，由語音通話 store 處理
                break
              case 'webrtc_signaling':
                // WebRTC 信令，由語音通話 store 處理
                break
              default:
                // 其他事件由各自的 store 監聽處理
                break
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
        const request: ClientToServer.Ping = { action: 'ping' }
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
  const sendMessage = (payload: ClientToServer.Payload.SendMessage) => {
    if (!checkWsConnection()) {
      console.error('WebSocket 未連接，無法發送訊息')
      return false
    }

    try {
      const request: ClientToServer.SendMessage = {
        action: 'send_message',
        data: payload,
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
  const joinRoom = async (payload: ClientToServer.Payload.JoinRoom) => {
    if (!checkWsConnection()) {
      console.error('WebSocket 未連接，無法加入房間')
      return false
    }

    try {
      // 更新當前房間 ID
      currentRoomId.value = payload.room_id

      const request: ClientToServer.JoinRoom = {
        action: 'join_room',
        data: payload,
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
  const fetchDMRoomList = async (): Promise<void> => {
    try {
      const { data: response } = await api.get<APIResponse<DMRoom[]>>('/dm_rooms')
      const rooms = handleAPIResponse(response, '獲取 DM 聊天室列表')
      dmRooms.value = rooms
    } catch (error) {
      throw error
    }
  }

  /**
   * 建立DM聊天室
   * @param dm_room DMRoomAPI.Request.Create
   */
  const fetchCreateDMRoom = async (dm_room: DMRoomAPI.Request.Create): Promise<DMRoom> => {
    try {
      const { data: response } = await api.post<APIResponse<DMRoom>>('/dm_rooms', dm_room)
      const data = handleAPIResponse(response, '建立 DM 聊天室')

      // 如果ID重複，則更新
      const index = dmRooms.value.findIndex((c) => c.room_id === data.room_id)
      if (index !== -1) {
        dmRooms.value[index] = data
      } else {
        dmRooms.value.push(data)
      }
      
      return data
    } catch (error) {
      throw error
    }
  }

  // 隱藏DM聊天室
  const fetchHideDMRoom = async (dmRoomId: string): Promise<void> => {
    try {
      const { data: response } = await api.put<APIResponse<null>>(`/dm_rooms`, { room_id: dmRoomId, is_hidden: true })
      handleDeleteResponse(response, '隱藏 DM 聊天室')
      
      dmRooms.value = dmRooms.value.filter((c) => c.room_id !== dmRoomId)
      router.push('/channels/@me')
    } catch (error) {
      throw error
    }
  }

  // 取得DM聊天室訊息
  const fetchDMMessages = async (message: MessageAPI.Request.GetMessages): Promise<void> => {
    try {
      // 如果快取中已有訊息，且不是為了獲取舊訊息，則不重新獲取
      if (messageCache.value[message.room_id] && !message.message_id) {
        return
      }

      const params: { before?: string; limit: number } = { limit: message.limit }
      if (message.message_id) {
        params.before = message.message_id
      }
      const { data: response } = await api.get<APIResponse<Message[]>>('/dm_rooms/' + message.room_id + '/messages', { params })
      const data = handleAPIResponse(response, '獲取 DM 訊息')

      // 初始化快取
      if (!messageCache.value[message.room_id]) {
        messageCache.value[message.room_id] = []
      }

      // 將新訊息加入快取
      const existingMessages = messageCache.value[message.room_id]
      const newMessages = data.filter(d => !existingMessages.some(e => e.id === d.id))
      messageCache.value[message.room_id].push(...newMessages)

      // 排序
      messageCache.value[message.room_id].sort((a, b) => a.timestamp - b.timestamp)
    } catch (error) {
      throw error
    }
  }

  // 取得頻道訊息
  const fetchChannelMessages = async (message: MessageAPI.Request.GetMessages): Promise<void> => {
    try {
      // 如果快取中已有訊息，且不是為了獲取舊訊息，則不重新獲取
      if (messageCache.value[message.room_id] && !message.message_id) {
        return
      }

      const params: { before?: string; limit: number } = { limit: message.limit }
      if (message.message_id) {
        params.before = message.message_id
      }
      const { data: response } = await api.get<APIResponse<Message[]>>('/channels/' + message.room_id + '/messages', { params })
      const data = handleAPIResponse(response, '獲取頻道訊息')

      // 初始化快取
      if (!messageCache.value[message.room_id]) {
        messageCache.value[message.room_id] = []
      }

      // 將新訊息加入快取
      const existingMessages = messageCache.value[message.room_id]
      const newMessages = data.filter(d => !existingMessages.some(e => e.id === d.id))
      messageCache.value[message.room_id].push(...newMessages)

      // 排序
      messageCache.value[message.room_id].sort((a, b) => a.timestamp - b.timestamp)
    } catch (error) {
      throw error
    }
  }

  // 清空特定房間的訊息快取
  const clearMessageCache = (roomId: string) => {
    if (messageCache.value[roomId]) {
      delete messageCache.value[roomId]
    }
  }

  /**
   * 操作資料 Methods
   */

  return {
    socket,
    wsConnect,
    disWsConnect,
    checkWsConnection,
    getWsState,
    joinRoom,
    sendMessage,
    messages,
    channels,
    dmRooms,
    currentChannel,
    currentRoomId,
    fetchHideDMRoom,
    fetchDMRoomList,
    fetchCreateDMRoom,
    fetchDMMessages,
    fetchChannelMessages,
    clearMessageCache,
  }
})
