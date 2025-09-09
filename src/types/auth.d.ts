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

// 好友（來自好友列表API）
export interface Friend {
  id: string
  name: string
  nickname: string
  picture_url: string
  status: 'accepted'
  is_online: boolean
}

// 好友請求（用於待處理請求）
export interface FriendRequest {
  request_id: string
  user_id: string
  username: string
  nickname: string
  picture_url: string
  sent_at: number
  type: 'sent' | 'received'
}

// 待處理好友請求回應
export interface PendingFriendsResponse {
  sent: FriendRequest[]
  received: FriendRequest[]
  count: {
    sent: number
    received: number
    total: number
  }
}

// 封鎖用戶
export interface BlockedUser {
  user_id: string
  username: string
  nickname: string
  picture_url: string
  blocked_at: number
}

export interface CSRFToken {
  name: string
  value: string
}
