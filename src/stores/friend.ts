import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth'
import type { APIResponse } from '@/types/api'
import api from '@/api/axios'

export const useFriendStore = defineStore('friend', () => {
  const friends = ref<User[]>([])

  /**
   * API Methods
   */
  // 取得好友
  const fetchFriends = async () => {
    try {
      const response = await api.get('/friends')
      setFriends(response.data)
      return response.data
    } catch (error) {
      console.error('Failed to fetch friends:', error)
      return []
    }
  }

  // 發送好友請求
  const sendFriendRequest = async (newFriendUsername: string) => {
    try {
      const response = await api.post('/friends/', { username: newFriendUsername })
      return response.data
    } catch (error) {
      console.error('Failed to send friend request:', error)
      return []
    }
  }

  // 接受好友請求
  const acceptFriendRequest = async (friendId: string) => {
    try {
      const response = await api.put(`/friends/${friendId}`, { status: 'accepted' })
      await fetchFriends() // 重新獲取好友列表
      return response.data
    } catch (error) {
      console.error('接受好友請求失敗:', error)
      throw error
    }
  }

  // 拒絕好友請求
  const rejectFriendRequest = async (friendId: string) => {
    try {
      const response = await api.put(`/friends/${friendId}`, { status: 'rejected' })
      await fetchFriends() // 重新獲取好友列表
      return response.data
    } catch (error) {
      console.error('拒絕好友請求失敗:', error)
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
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    // Methods
    setFriends,
    clearFriends,
  }
})
