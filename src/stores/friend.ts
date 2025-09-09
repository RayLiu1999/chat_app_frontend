import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, Friend, FriendRequest, PendingFriendsResponse, BlockedUser } from '@/types/auth'
import type { APIResponse } from '@/types/api'
import api from '@/api/axios'
import { handleAPIResponse } from '@/api/utils'

export const useFriendStore = defineStore('friend', () => {
  const friends = ref<Friend[]>([])
  const pendingFriends = ref<PendingFriendsResponse>({
    sent: [],
    received: [],
    count: { sent: 0, received: 0, total: 0 }
  })
  const blockedUsers = ref<BlockedUser[]>([])

  /**
   * API Methods
   */
  // 取得好友列表
  const fetchFriends = async (): Promise<void> => {
    try {
      const { data: response } = await api.get<APIResponse<Friend[]>>('/friends')
      const friendList = handleAPIResponse(response, '獲取好友列表')
      setFriends(friendList)
    } catch (error) {
      throw error
    }
  }

  // 取得待處理好友請求
  const fetchPendingFriends = async (): Promise<void> => {
    try {
      const { data: response } = await api.get<APIResponse<PendingFriendsResponse>>('/friends/pending')
      const pendingData = handleAPIResponse(response, '獲取待處理請求')
      setPendingFriends(pendingData)
    } catch (error) {
      throw error
    }
  }

  // 取得封鎖用戶列表
  const fetchBlockedUsers = async (): Promise<void> => {
    try {
      const { data: response } = await api.get<APIResponse<BlockedUser[]>>('/friends/blocked')
      const blockedList = handleAPIResponse(response, '獲取封鎖列表')
      setBlockedUsers(blockedList)
    } catch (error) {
      throw error
    }
  }

  // 發送好友請求
  const fetchSendFriendRequest = async (username: string): Promise<any> => {
    try {
      const { data: response } = await api.post<APIResponse<any>>('/friends/requests', { username })
      const result = handleAPIResponse(response, '發送好友請求')
      // 發送後重新獲取待處理請求
      await fetchPendingFriends()
      return result
    } catch (error) {
      throw error
    }
  }

  // 接受好友請求
  const fetchAcceptFriendRequest = async (requestId: string): Promise<any> => {
    try {
      const { data: response } = await api.put<APIResponse<any>>(`/friends/requests/${requestId}/accept`)
      const result = handleAPIResponse(response, '接受好友請求')
      // 接受後重新獲取好友列表和待處理請求
      await Promise.all([fetchFriends(), fetchPendingFriends()])
      return result
    } catch (error) {
      throw error
    }
  }

  // 拒絕好友請求
  const fetchRejectFriendRequest = async (requestId: string): Promise<any> => {
    try {
      const { data: response } = await api.put<APIResponse<any>>(`/friends/requests/${requestId}/decline`)
      const result = handleAPIResponse(response, '拒絕好友請求')
      // 拒絕後重新獲取待處理請求
      await fetchPendingFriends()
      return result
    } catch (error) {
      throw error
    }
  }

  // 取消好友請求
  const fetchCancelFriendRequest = async (requestId: string): Promise<any> => {
    try {
      const { data: response } = await api.delete<APIResponse<any>>(`/friends/requests/${requestId}`)
      const result = handleAPIResponse(response, '取消好友請求')
      // 取消後重新獲取待處理請求
      await fetchPendingFriends()
      return result
    } catch (error) {
      throw error
    }
  }

  // 刪除好友
  const fetchRemoveFriend = async (friendId: string): Promise<any> => {
    try {
      const { data: response } = await api.delete<APIResponse<any>>(`/friends/remove/${friendId}`)
      const result = handleAPIResponse(response, '刪除好友')
      // 刪除後重新獲取好友列表
      await fetchFriends()
      return result
    } catch (error) {
      throw error
    }
  }

  // 封鎖用戶
  const fetchBlockUser = async (userId: string): Promise<any> => {
    try {
      const { data: response } = await api.post<APIResponse<any>>(`/friends/${userId}/block`)
      const result = handleAPIResponse(response, '封鎖用戶')
      // 封鎖後重新獲取封鎖列表和好友列表
      await Promise.all([fetchBlockedUsers(), fetchFriends()])
      return result
    } catch (error) {
      throw error
    }
  }

  // 解除封鎖
  const fetchUnblockUser = async (userId: string): Promise<any> => {
    try {
      const { data: response } = await api.delete<APIResponse<any>>(`/friends/${userId}/block`)
      const result = handleAPIResponse(response, '解除封鎖')
      // 解除封鎖後重新獲取封鎖列表
      await fetchBlockedUsers()
      return result
    } catch (error) {
      throw error
    }
  }

  /**
   * 操作資料 Methods
   */
  // 設置好友列表
  const setFriends = (newFriends: Friend[]) => {
    friends.value = newFriends
  }

  // 設置待處理好友請求
  const setPendingFriends = (pendingData: PendingFriendsResponse) => {
    pendingFriends.value = {
      sent: pendingData?.sent || [],
      received: pendingData?.received || [],
      count: pendingData?.count || { sent: 0, received: 0, total: 0 }
    }
  }

  // 設置封鎖用戶列表
  const setBlockedUsers = (blockedList: BlockedUser[]) => {
    blockedUsers.value = blockedList
  }

  // 清除所有資料
  const clearFriends = () => {
    friends.value = []
    pendingFriends.value = {
      sent: [],
      received: [],
      count: { sent: 0, received: 0, total: 0 }
    }
    blockedUsers.value = []
  }

  return {
    // Data
    friends,
    pendingFriends,
    blockedUsers,
    // API
    fetchFriends,
    fetchPendingFriends,
    fetchBlockedUsers,
    fetchSendFriendRequest,
    fetchAcceptFriendRequest,
    fetchRejectFriendRequest,
    fetchCancelFriendRequest,
    fetchRemoveFriend,
    fetchBlockUser,
    fetchUnblockUser,
    // Methods
    setFriends,
    setPendingFriends,
    setBlockedUsers,
    clearFriends,
  }
})
