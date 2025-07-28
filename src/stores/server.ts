import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import type { Server } from '@/types/chat'
import type { ServerAPI } from '@/types/api'
import api from '@/api/axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

export const useServerStore = defineStore('server', () => {
  const router = useRouter()
  
  // 資料
  const servers = ref<Server[]>([])
  
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
    fetchServerList,
    createServer,
    deleteServer,
    leaveServer,
    searchPublicServers,
    fetchFeaturedServers,
    joinPublicServer
  }
})