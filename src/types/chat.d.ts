export interface Server {
  id: string
  name: string
  picture_url: string
}

export interface ServerMember {
  user_id: string
  username: string
  nickname: string
  picture: string
  role: 'owner' | 'admin' | 'member'
  is_online: boolean
  last_active_at: number
  joined_at: number
}

export interface ServerDetail {
  id: string
  name: string
  picture_url: string
  description: string
  member_count: number
  is_public: boolean
  owner_id: string
  members: ServerMember[]
  channels: Channel[]
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