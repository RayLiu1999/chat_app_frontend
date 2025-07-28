import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import type { Server, ServerDetail, ServerMember } from '@/types/chat'
import type { ServerAPI } from '@/types/api'
import api from '@/api/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

export const useServerStore = defineStore('server', () => {
  const router = useRouter()
  
  // 資料
  const servers = ref<Server[]>([])
  const serverDetails = ref<Map<string, ServerDetail>>(new Map())
  const currentServerDetail = ref<ServerDetail | null>(null)
  
  // 取得伺服器列表
  const fetchServerList = async () => {
    try {
      const { data: response } = await api.get('/servers')
      if (response.status === 'success') {
        servers.value = response.data as Server[]
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('獲取伺服器列表失敗:', error)
      ElMessage.error('獲取伺服器列表失敗')
    }
  }

  // 取得伺服器詳細資訊
  const fetchServerDetail = async (serverId: string): Promise<ServerDetail | null> => {
    try {
      // 如果已經有快取，直接返回
      if (serverDetails.value.has(serverId)) {
        const detail = serverDetails.value.get(serverId)!
        currentServerDetail.value = detail
        return detail
      }

      const { data: response } = await api.get(`/servers/${serverId}/detail`)
      if (response.status === 'success') {
        const detail = response.data as ServerDetail
        // 快取伺服器詳細資訊
        serverDetails.value.set(serverId, detail)
        currentServerDetail.value = detail
        return detail
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('獲取伺服器詳細資訊失敗:', error)
      ElMessage.error('獲取伺服器詳細資訊失敗')
      return null
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
  const createServer = async (server: ServerAPI.Request.Create) => {
    try {
      const formData = new FormData()
      formData.append('name', server.name)
      if (server.picture) {
        formData.append('picture', server.picture)
      }

      const { data: response } = await api.post('/servers', formData)
      if (response.status === 'success') {
        servers.value.push(response.data as Server)
        ElMessage.success('成功創建伺服器')
        return response.data
      } else {
        if (response.displayable) {
          ElMessage.error(response.message)
        }
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('創建伺服器失敗:', error)
      ElMessage.error('創建伺服器失敗')
      throw error
    }
  }

  // 刪除伺服器
  const deleteServer = async (serverId: string) => {
    try {
      await ElMessageBox.confirm(
        '確定要刪除此伺服器嗎？此操作無法復原。',
        '刪除伺服器',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'discord-message-box'
        }
      )

      const { data: response } = await api.delete(`/servers/${serverId}`)
      if (response.status === 'success') {
        // 從列表中移除伺服器
        servers.value = servers.value.filter(server => server.id !== serverId)
        ElMessage.success('成功刪除伺服器')
        
        // 如果當前在被刪除的伺服器頁面，跳轉到私人訊息
        if (router.currentRoute.value.params.server_id === serverId) {
          router.push('/channels/@me')
        }
        
        return response.data
      } else {
        if (response.displayable) {
          ElMessage.error(response.message)
        }
        throw new Error(response.message)
      }
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('刪除伺服器失敗:', error)
        ElMessage.error('刪除伺服器失敗')
      }
      throw error
    }
  }

  // 離開伺服器
  const leaveServer = async (serverId: string) => {
    try {
      await ElMessageBox.confirm(
        '確定要離開此伺服器嗎？',
        '離開伺服器',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'discord-message-box'
        }
      )

      const { data: response } = await api.post(`/servers/${serverId}/leave`)
      if (response.status === 'success') {
        // 從列表中移除伺服器
        servers.value = servers.value.filter(server => server.id !== serverId)
        ElMessage.success('成功離開伺服器')
        
        // 如果當前在被離開的伺服器頁面，跳轉到私人訊息
        // if (router.currentRoute.value.params.server_id === serverId) {
        //   router.push('/channels/@me')
        // }
        
        return response.data
      } else {
        if (response.displayable) {
          ElMessage.error(response.message)
        }
        throw new Error(response.message)
      }
    } catch (error: any) {
      if (error !== 'cancel') {
        console.error('離開伺服器失敗:', error)
        ElMessage.error('離開伺服器失敗')
      }
      throw error
    }
  }

  // 搜尋公開伺服器
  const searchPublicServers = async (query: string) => {
    try {
      const { data: response } = await api.get(`/servers/search?q=${encodeURIComponent(query)}`)
      if (response.status === 'success') {
        return response.data
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('搜尋伺服器失敗:', error)
      throw error
    }
  }

  // 獲取推薦伺服器
  const fetchFeaturedServers = async () => {
    try {
      const { data: response } = await api.get('/servers/featured')
      if (response.status === 'success') {
        return response.data
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('獲取推薦伺服器失敗:', error)
      throw error
    }
  }

  // 加入公開伺服器
  const joinPublicServer = async (serverId: string) => {
    try {
      const { data: response } = await api.post(`/servers/${serverId}/join`)

      if (response.status === 'success') {
        // 重新載入伺服器列表
        await fetchServerList()
        ElMessage.success('成功加入伺服器')
        return response.data
      } else {
        if (response.displayable) {
          ElMessage.error(response.message)
        }
        return null
      }
    } catch (error: any) {
      console.error('加入伺服器失敗:', error)
      ElMessage.error('加入伺服器失敗')
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
    createServer,
    deleteServer,
    leaveServer,
    searchPublicServers,
    fetchFeaturedServers,
    joinPublicServer
  }
})