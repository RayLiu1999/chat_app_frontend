export interface User {
  id: string
  username: string
  nickname: string
  email?: string
  phone?: string
  status: string
  is_online: boolean
  picture_url: string
  banner_url: string
  created_at?: number
  updated_at?: number
}

export interface FriendRequest {
  id: number
  from_user: User
  to_user: User
  status: 'pending' | 'accepted' | 'rejected'
  created_at: number
}

export interface CSRFToken {
  name: string
  value: string
}
