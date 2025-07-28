export interface User {
  id: string
  username: string
  nickname: string
  pic_url: string
  status: string
  is_online: boolean
}

export interface CSRFToken {
  name: string
  value: string
}
