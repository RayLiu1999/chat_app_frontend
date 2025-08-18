/**
 * =================================================================
 * WebSocket Message Types
 * =================================================================
 *
 * This file defines the types for WebSocket communication between
 * the client and the server.
 *
 * -----------------------------------------------------------------
 *
 * ### Naming Convention:
 *
 * - `ClientToServer`: Messages sent from the client to the server.
 * - `ServerToClient`: Messages sent from the server to the client.
 * - `Payload`: The `data` part of a WebSocket message.
 *
 * -----------------------------------------------------------------
 *
 * ### Message Structure:
 *
 * All messages follow this basic structure:
 *
 * ```typescript
 * interface WsMessage<T, P> {
 *   action: T;
 *   data: P;
 * }
 * ```
 *
 * - `action`: A string literal that identifies the message type.
 * - `data`: The payload, with a type specific to the action.
 *
 * =================================================================
 */

import type { Message, VoiceCallNotification, WebRTCSignaling } from './chat'

/**
 * =================================
 * Client to Server Messages
 * =================================
 */

// --- Payload Types ---

export namespace ClientToServer {
  export namespace Payload {
    export interface SendMessage {
      room_type: 'channel' | 'dm'
      room_id: string
      content: string
    }

    export interface JoinRoom {
      room_type: 'channel' | 'dm'
      room_id: string
    }
  }

  // --- Message Types ---

  export type Action = 'ping' | 'send_message' | 'join_room' | 'leave_room' | 'webrtc_signaling'

  export interface Ping {
    action: 'ping'
  }

  export interface SendMessage {
    action: 'send_message'
    data: Payload.SendMessage
  }

  export interface JoinRoom {
    action: 'join_room'
    data: Payload.JoinRoom
  }

  export interface LeaveRoom {
    action: 'leave_room'
    data: Payload.LeaveRoom
  }

  export interface WebRTCSignaling {
    action: 'webrtc_signaling'
    data: WebRTCSignaling
  }

  // --- Union Type for all Client-to-Server messages ---

  export type Message = Ping | SendMessage | JoinRoom | WebRTCSignaling
}

/**
 * =================================
 * Server to Client Messages
 * =================================
 */

export namespace ServerToClient {
  // --- Message Types ---

export type Action =
    | 'pong'
    | 'room_joined'
    | 'room_left'
    | 'message_sent'
    | 'new_message'
    | 'error'
    | 'user_status'
    | 'voice_call_notification'
    | 'webrtc_signaling'

  export interface Pong {
    action: 'pong'
    data: null
  }

  export interface NewMessage {
    action: 'new_message'
    data: {
      id: string
      room_type: 'channel' | 'dm'
      room_id: string
      sender_id: string
      content: string
      timestamp: number
    }
  }

  export interface RoomJoined {
    action: 'room_joined'
    data: {
        message: string
    }
  }

  export interface RoomLeft {
    action: 'room_left'
    data: {
      message: string
    }
  }

  export interface MessageSent {
    action: 'message_sent'
    data: {
      id: string
      room_type: 'channel' | 'dm'
      room_id: string
      sender_id: string
      content: string
      timestamp: number
    }
  }

  export interface UserStatus {
    action: 'user_status'
    data: {
      user_id: string
      status: 'online' | 'offline' | 'away'
    }
  }

  export interface Error {
    action: 'error'
    data: {
      message: string
      original_action?: ClientToServer.Action
    }
  }

  export interface VoiceCallNotification {
    action: 'voice_call_notification'
    data: VoiceCallNotification
  }

  export interface WebRTCSignaling {
    action: 'webrtc_signaling'
    data: WebRTCSignaling
  }

  // --- Union Type for all Server-to-Client messages ---

  export type Message =
    | Pong
    | NewMessage
    | RoomJoined
    | RoomLeft
    | MessageSent
    | UserStatus
    | Error
    | VoiceCallNotification
    | WebRTCSignaling
}
