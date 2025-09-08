import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Server, ServerDetail, ServerMember } from '@/types/chat'
import api from '@/api/axios'
import { useRouter } from 'vue-router'
import type { ChannelAPI, APIResponse } from '@/types/api'
import { handleDeleteResponse, handleAPIResponse } from '@/api/utils'

export const useServerStore = defineStore('server', () => {
  const router = useRouter()
  
  // 資料
  const servers = ref<Server[]>([])
  const serverDetails = ref<Map<string, ServerDetail>>(new Map())
  const currentServerDetail = ref<ServerDetail | null>(null)
  
  // 取得伺服器列表
  const fetchServerList = async (): Promise<void> => {
    try {
      const { data: response } = await api.get<APIResponse<Server[]>>('/servers')
      const serverList = handleAPIResponse(response, '獲取伺服器列表')
      servers.value = serverList
    } catch (error) {
      throw error
    }
  }

  // 取得伺服器詳細資訊
  const fetchServerDetail = async (serverId: string): Promise<void> => {
    try {
      // 如果已經有快取，直接返回
      if (serverDetails.value.has(serverId)) {
        const detail = serverDetails.value.get(serverId)!
        currentServerDetail.value = detail
        return
      }

      const { data: response } = await api.get<APIResponse<ServerDetail>>(`/servers/${serverId}/detail`)
      const detail = handleAPIResponse(response, '獲取伺服器詳細資訊')
      
      // 快取伺服器詳細資訊
      serverDetails.value.set(serverId, detail)
      currentServerDetail.value = detail
    } catch (error) {
      throw error
    }
  }

  // 清除伺服器詳細資訊快取
  const clearServerDetailCache = (serverId?: string) => {
    if (serverId) {
      serverDetails.value.delete(serverId)
      if (currentServerDetail.value?.id === serverId) {
        currentServerDetail.value = null
      }
    } else {
      serverDetails.value.clear()
      currentServerDetail.value = null
    }
  }

  // 根據使用者 ID 獲取成員資訊
  const getMemberByUserId = (userId: string): ServerMember | null => {
    if (!currentServerDetail.value) return null
    return currentServerDetail.value.members.find(member => member.user_id === userId) || null
  }

  // 獲取線上成員列表
  const getOnlineMembers = (): ServerMember[] => {
    if (!currentServerDetail.value) return []
    return currentServerDetail.value.members.filter(member => member.is_online)
  }

  // 獲取離線成員列表
  const getOfflineMembers = (): ServerMember[] => {
    if (!currentServerDetail.value) return []
    return currentServerDetail.value.members.filter(member => !member.is_online)
  }

  // 創建伺服器
  const fetchCreateServer = async (server: {name: string, picture?: Blob}): Promise<Server> => {
    try {
      const formData = new FormData()
      formData.append('name', server.name)
      if (server.picture) {
        formData.append('picture', server.picture)
      }

      const { data: response } = await api.post<APIResponse<Server>>('/servers', formData)
      const newServer = handleAPIResponse(response, '建立伺服器')
      servers.value.push(newServer)
      
      return newServer
    } catch (error) {
      throw error
    }
  }

  // 刪除伺服器
  const fetchDeleteServer = async (serverId: string): Promise<void> => {
    try {
      const { data: response } = await api.delete<APIResponse<null>>(`/servers/${serverId}`)
      
      // 使用 handleDeleteResponse 處理刪除回應
      handleDeleteResponse(response, '刪除伺服器')
      
      // 成功後更新本地狀態
      servers.value = servers.value.filter(server => server.id !== serverId)
      
      // 清除伺服器詳情快取
      clearServerDetailCache(serverId)
      
      // 如果是當前伺服器，清空當前伺服器詳情
      if (currentServerDetail.value?.id === serverId) {
        currentServerDetail.value = null
      }
    } catch (error) {
      throw error
    }
  }

  // 離開伺服器
  const fetchLeaveServer = async (serverId: string): Promise<void> => {
    try {
      const { data: response } = await api.post<APIResponse<null>>(`/servers/${serverId}/leave`)
      handleDeleteResponse(response, '離開伺服器')
      
      // 從列表中移除伺服器
      servers.value = servers.value.filter(server => server.id !== serverId)
      
      // 清除伺服器詳情快取
      clearServerDetailCache(serverId)
      
      // 如果是當前伺服器，清空當前伺服器詳情
      if (currentServerDetail.value?.id === serverId) {
        currentServerDetail.value = null
      }
    } catch (error) {
      throw error
    }
  }

  // 搜尋公開伺服器
  const fetchSearchPublicServers = async (query: string): Promise<any> => {
    try {
      const { data: response } = await api.get<APIResponse>(`/servers/search?q=${encodeURIComponent(query)}`)
      const searchResults = handleAPIResponse(response, '搜尋公開伺服器')
      return searchResults
    } catch (error) {
      throw error
    }
  }

  // 加入公開伺服器
  const fetchJoinPublicServer = async (serverId: string): Promise<Server> => {
    try {
      const { data: response } = await api.post<APIResponse<Server>>(`/servers/${serverId}/join`)
      const joinedServer = handleAPIResponse(response, '加入伺服器')
      
      // 將新的伺服器加入到列表中
      const existingIndex = servers.value.findIndex(s => s.id === serverId)
      if (existingIndex === -1) {
        servers.value.push(joinedServer)
      }
      
      return joinedServer
    } catch (error) {
      throw error
    }
  }

  return {
    servers,
    serverDetails,
    currentServerDetail,
    fetchServerList,
    fetchServerDetail,
    clearServerDetailCache,
    getMemberByUserId,
    getOnlineMembers,
    getOfflineMembers,
    fetchCreateServer,
    fetchDeleteServer,
    fetchLeaveServer,
    fetchSearchPublicServers,
    fetchJoinPublicServer
  }
})