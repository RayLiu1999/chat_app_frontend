export interface User {
  id: string
  username: string
  nickname: string
  email?: string
  phone?: string
  pic_url: string
  status: string
  is_online: boolean
  banner_url?: string
  created_at?: number
  updated_at?: number
}

export interface CSRFToken {
  name: string
  value: string
}
