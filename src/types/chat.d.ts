export interface Message {
  room_id: string
  user_id: string
  text: string
  timestamp: number
}

export interface Channel {
  id: string
  name: string
  messages: Message[]
}
