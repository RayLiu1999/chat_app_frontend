export interface APIResponse<T = any> {
  status: string // "success" 或 "error"
  code: number // 自定義錯誤碼，例如 1001 表示 "用戶不存在"
  message: string // 訊息內容
  displayable: boolean // 是否顯示給使用者看
  data?: T // 可選的數據
}

// Server
export namespace ServerAPI {
  export namespace Request {
    export interface Create {
      name: string
      picture?: Blob
    }
  }

  export namespace Response {
    export interface Server {
      id: string
      name: string
      picture_url: string
    }
  }
}

// Channel
export namespace ChannelAPI {
  export namespace Request {
    export interface Create {
      name: string
      picture?: Blob
    }
  }

  export namespace Response {
    export interface Channel {
      id: string
      name: string
      // ...其他屬性
    }
  }
}

// Chat
export namespace ChatAPI {
  export namespace Request {
    export interface JoinRoom {
      type: string // channel or dm
      room_id: string
    }
  }

  export namespace Response {
    export interface ChatRoom {
      id: string
      name: string
      messages: Message[]
    }
  }
}

// User
export namespace UserAPI {
  export namespace Request {
    export interface Login {
      username: string
      password: string
    }
  }

  export namespace Response {
    export interface User {
      id: string
      username: string
      nick_name: string
      pic_url: string
    }
  }
}

// Message
export namespace MessageAPI {
  export namespace Request {
    export interface SendMessage {
      type: string
      room_id: string
      user_id: string
      text: string
      timestamp: number
    }

    export interface JoinRoom {
      type: string // channel or dm
      room_id: string
    }

  }

  export namespace Response {
    export interface OnMessage {
      type: string
      room_id: string
      user_id: string
      username: string
      text: string
      timestamp: number
    }
  }

  export type WsDataType = SendMessage | JoinRoom | null

  export interface WsMessage<T extends WsDataType = null> {
    type: string
    data: T
  }
}
