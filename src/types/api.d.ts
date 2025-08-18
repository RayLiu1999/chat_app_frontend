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

    export interface ServerMember {
      user_id: string
      username: string
      nickname: string
      picture_url: string
      role: 'owner' | 'admin' | 'member'
      is_online: boolean
      last_active_at: number
      joined_at: number
    }

    export interface ServerChannel {
      id: string
      server_id: string
      name: string
      type: 'text' | 'voice'
      picture_url: string
      description: string
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
      channels: ServerChannel[]
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

    export interface UpdateProfile {
      username?: string
      nickname?: string
      status?: string
    }

    export interface UploadImage {
      image: File
      type: 'avatar' | 'banner'
    }
  }

  export namespace Response {
    export interface User {
      id: string
      username: string
      nickname: string
      status: string
      is_online: boolean
      picture_url: string
      banner_url?: string
      created_at: number
      updated_at: number
    }

    export interface UploadImage {
      url: string
    }
  }
}

// Message
export namespace MessageAPI {
  export namespace Request {
    export interface GetMessages {
      room_id: string
      message_id?: string
      limit: number
    }
  }
}
