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

    export interface Join {
      server_id: string
    }
  }

  export namespace Response {
    export interface Server {
      id: string
      name: string
      picture_url: string
    }

    export interface PublicServer {
      id: string
      name: string
      description: string
      picture_url: string
      member_count: number
      is_joined: boolean
      owner_name: string
      created_at: number
      online_count: number
      tags?: string[]
      is_joined?: boolean
    }

    export interface SearchResponse {
      servers: PublicServer[]
      total_count: number
      page: number
      limit: number
      total_pages: number
    }
  }
}

// Channel
export namespace ChannelAPI {
  export namespace Request {
    export interface Create {
      name: string
      type: 'text' | 'voice'
      category_id?: string
    }

    export interface Update {
      name?: string
      type?: 'text' | 'voice'
      category_id?: string
    }
  }

  export namespace Response {
    export interface Channel {
      id: string
      server_id: string
      name: string
      type: 'text' | 'voice'
      category_id?: string
    }
  }
}

// DMRoom
export namespace DMRoomAPI {
  export namespace Request {
    export interface Create {
      chat_with_user_id: string
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
      nickname: string
      pic_url: string
    }
  }
}

// Message
export namespace MessageAPI {
  export namespace Request {
    export interface SendMessage {
      room_type: 'channel' | 'dm'
      room_id: string
      content: string
    }

    export interface JoinRoom {
      room_type: 'channel' | 'dm'
      room_id: string
    }

    export interface GetMessages {
      room_id: string
      message_id?: string
      limit: number
    }
  }

  export namespace Response {
    export interface SendMessage {
      id: string
      room_type: 'channel' | 'dm'
      room_id: string
      sender_id: string
      content: string
      timestamp: number
    }

    export interface JoinRoom {
      status: string
      room_type: 'channel' | 'dm'
      room_id: string
    }
  }

  // 具體的請求消息類型
  export interface SendMessageRequestMessage {
    action: 'send_message'
    data: Request.SendMessage
  }

  export interface JoinRoomRequestMessage {
    action: 'join_room'
    data: Request.JoinRoom
  }

  // 具體的響應消息類型
  export interface SendMessageResponseMessage {
    action: 'send_message'
    data: Response.SendMessage
  }

  export interface JoinRoomResponseMessage {
    action: 'join_room'
    data: Response.JoinRoom
  }

  // 請求和響應的聯合類型
  export type WsRequestMessage = SendMessageRequestMessage | JoinRoomRequestMessage
  export type WsResponseMessage = SendMessageResponseMessage | JoinRoomResponseMessage

  // // 定義具體的消息類型
  // export interface SendMessageWsMessage<T extends Request.SendMessage | Response.SendMessage> {
  //   action: 'send_message'
  //   data: T
  // }

  // export interface JoinRoomWsMessage<T extends Request.JoinRoom | Response.JoinRoom> {
  //   action: 'join_room'
  //   data: T
  // }

  // // 使用判別聯合類型
  // export type WsMessage<T> = SendMessageWsMessage<T> | JoinRoomWsMessage<T>
}
