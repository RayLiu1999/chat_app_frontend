export interface Server {
  id: string
  name: string
  picture: string
  channels: Channel[]
}

export interface ChatRoom {
  id: string
  name: string
  messages: Message[]
}

export interface Message {
  type: string
  room_id: string
  server_id: string
  user_id: string
  text: string
  timestamp: number
}
