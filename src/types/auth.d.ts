export interface User {
  id: string
  username: string
  nickname: string
  pic_url: string
  status: string
}

export interface CSRFToken {
  name: string
  value: string
}
