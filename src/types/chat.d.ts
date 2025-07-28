export interface Server {
  id: string
  name: string
  picture_url: string
}

export interface Channel {
  id: string
  server_id: string
  name: string
  type: 'text' | 'voice'
  category_id?: string
}
export interface DMRoom {
  room_id: string
  nickname: string
  picture_url: string
  timestamp: number
}

export interface Message {
  id: string
  room_type: string // channel or dm
  room_id: string
  sender_id: string
  content: string
  timestamp: number
}

export interface UnreadMessage {
  room_type: string // channel or dm
  room_id: string
  unread_count: number
}