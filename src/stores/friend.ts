import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth'
import type { APIResponse } from '@/types/api'
import api from '@/api/axios'
import { handleAPIResponse } from '@/api/utils'

export const useFriendStore = defineStore('friend', () => {
  const friends = ref<User[]>([])

  /**
   * API Methods
   */
  // 取得好友
  const fetchFriends = async (): Promise<void> => {
    try {
      const { data: response } = await api.get<APIResponse<User[]>>('/friends')
      const friendList = handleAPIResponse(response, '獲取好友列表')
      setFriends(friendList)
    } catch (error) {
      throw error
    }
  }

  // 發送好友請求
  const fetchSendFriendRequest = async (newFriendUsername: string): Promise<any> => {
    try {
      const { data: response } = await api.post<APIResponse<any>>('/friends', { username: newFriendUsername })
      const result = handleAPIResponse(response, '發送好友請求')
      return result
    } catch (error) {
      throw error
    }
  }

  // 接受好友請求
  const fetchAcceptFriendRequest = async (friendId: string): Promise<User> => {
    try {
      const { data: response } = await api.put<APIResponse<User>>(`/friends/${friendId}`, { status: 'accepted' })
      const acceptedFriend = handleAPIResponse(response, '接受好友請求')
      await fetchFriends() // 重新獲取好友列表
      return acceptedFriend
    } catch (error) {
      throw error
    }
  }

  // 拒絕好友請求
  const fetchRejectFriendRequest = async (friendId: string): Promise<any> => {
    try {
      const { data: response } = await api.put<APIResponse<any>>(`/friends/${friendId}`, { status: 'rejected' })
      const result = handleAPIResponse(response, '拒絕好友請求')
      await fetchFriends() // 重新獲取好友列表
      return result
    } catch (error) {
      throw error
    }
  }

  /**
   * 操作資料 Methods
   */
  // 設置 user
  const setFriends = (newFriends: User[]) => {
    friends.value = newFriends
  }

  // 清除 user
  const clearFriends = () => {
    friends.value = []
  }

  return {
    // Data
    friends,
    // API
    fetchFriends,
    fetchSendFriendRequest,
    fetchAcceptFriendRequest,
    fetchRejectFriendRequest,
    // Methods
    setFriends,
    clearFriends,
  }
})
