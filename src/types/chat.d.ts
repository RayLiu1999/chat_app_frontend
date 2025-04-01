export interface Server {
  id: string
  name: string
  picture_url: string
}

export interface Channel {
  id: string
  server_id: string
  name: string
  picture_url: string
}

export interface ChatRoom {
  id: string
  name: string
  messages: Message[]
}

export interface Message {
  type: string
  room_id: string
  user_id: string
  username: string
  text: string
  timestamp: number
}



