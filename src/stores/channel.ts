import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import type { Channel } from '@/types/chat'
import type { ChannelAPI, APIResponse } from '@/types/api'
import { ElMessage } from 'element-plus'

export const useChannelStore = defineStore('channel', () => {
  // 狀態
  const channels = ref<Channel[]>([])
  const currentChannel = ref<Channel | null>(null)
  
  // 記住每個 server 的最後訪問頻道 (只存在前端記憶體中)
  const lastVisitedChannels = ref<Record<string, string>>({})

  // 獲取伺服器頻道列表
  const fetchServerChannels = async (serverId: string) => {
    try {
      const { data: response } = await api.get(`/servers/${serverId}/channels`)
      channels.value = response.data as Channel[]
    } catch (error: any) {
      console.error('獲取頻道列表失敗:', error)
      ElMessage.error('獲取頻道列表失敗')
    }
  }

  // 獲取單個頻道資訊
  const fetchChannel = async (channelId: string): Promise<Channel | null> => {
    try {
      const { data: response } = await api.get<APIResponse<Channel>>(`/channels/${channelId}`)

      if (response.status === 'success') {
        const channel = response.data
        if (channel) {
          currentChannel.value = channel
          
          // 更新本地頻道列表中的頻道資訊
          const index = channels.value.findIndex(c => c.id === channel.id)
          if (index !== -1) {
            channels.value[index] = channel
          }
        }
        return channel || null
      } else {
        if (response.displayable) {
          ElMessage.error(response.message)
        }
        return null
      }
    } catch (error: any) {
      console.error('獲取頻道資訊失敗:', error)
      ElMessage.error('獲取頻道資訊失敗')
      return null
    }
  }

  // 創建頻道
  const createChannel = async (serverId: string, channelData: ChannelAPI.Request.Create): Promise<Channel | null> => {
    try {
      const { data: response } = await api.post<APIResponse<Channel>>(`/servers/${serverId}/channels`, channelData)

      if (response.status === 'success') {
        const newChannel = response.data
        if (newChannel) {
          channels.value.push(newChannel)
          ElMessage.success('創建頻道成功')
        }
        return newChannel || null
      } else {
        if (response.displayable) {
          ElMessage.error(response.message)
        }
        return null
      }
    } catch (error: any) {
      console.error('創建頻道失敗:', error)
      ElMessage.error('創建頻道失敗')
      return null
    }
  }

  // 更新頻道
  const updateChannel = async (channelId: string, channelData: ChannelAPI.Request.Update): Promise<Channel | null> => {
    try {
      const { data: response } = await api.put<APIResponse<Channel>>(`/channels/${channelId}`, channelData)

      if (response.status === 'success') {
        const updatedChannel = response.data
        if (updatedChannel) {
          // 更新本地頻道列表
          const index = channels.value.findIndex(c => c.id === channelId)
          if (index !== -1) {
            channels.value[index] = updatedChannel
          }
          
          // 更新當前頻道（如果是當前頻道）
          if (currentChannel.value?.id === channelId) {
            currentChannel.value = updatedChannel
          }
          
          ElMessage.success('更新頻道成功')
        }
        return updatedChannel || null
      } else {
        if (response.displayable) {
          ElMessage.error(response.message)
        }
        return null
      }
    } catch (error: any) {
      console.error('更新頻道失敗:', error)
      ElMessage.error('更新頻道失敗')
      return null
    }
  }

  // 刪除頻道
  const deleteChannel = async (channelId: string): Promise<boolean> => {
    try {
      const { data: response } = await api.delete<APIResponse<null>>(`/channels/${channelId}`)

      if (response.status === 'success') {
        // 從本地頻道列表中移除
        channels.value = channels.value.filter(c => c.id !== channelId)
        
        // 如果刪除的是當前頻道，清空當前頻道
        if (currentChannel.value?.id === channelId) {
          currentChannel.value = null
        }
        
        ElMessage.success('刪除頻道成功')
        return true
      } else {
        if (response.displayable) {
          ElMessage.error(response.message)
        }
        return false
      }
    } catch (error: any) {
      console.error('刪除頻道失敗:', error)
      ElMessage.error('刪除頻道失敗')
      return false
    }
  }

  // 設置當前頻道
  const setCurrentChannel = (channel: Channel | null) => {
    currentChannel.value = channel
    // 記住這個 server 的最後訪問頻道
    if (channel) {
      lastVisitedChannels.value[channel.server_id] = channel.id
    }
  }

  // 獲取指定 server 的最後訪問頻道
  const getLastVisitedChannel = (serverId: string): string | null => {
    return lastVisitedChannels.value[serverId] || null
  }

  // 獲取指定 server 的預設頻道（最後訪問或第一個文字頻道）
  const getDefaultChannelForServer = (serverId: string): Channel | null => {
    if (channels.value.length === 0) return null
    
    // 先檢查是否有最後訪問的頻道
    const lastChannelId = getLastVisitedChannel(serverId)
    if (lastChannelId) {
      const lastChannel = channels.value.find(c => c.id === lastChannelId)
      if (lastChannel) return lastChannel
    }
    
    // 如果沒有，返回第一個文字頻道
    const textChannels = channels.value.filter(c => c.type === 'text')
    return textChannels.length > 0 ? textChannels[0] : null
  }

  // 根據類型分組頻道
  const getGroupedChannels = () => {
    const textChannels = channels.value.filter(c => c.type === 'text')
    const voiceChannels = channels.value.filter(c => c.type === 'voice')

    return {
      text: textChannels,
      voice: voiceChannels
    }
  }

  // 清空頻道數據
  const clearChannels = () => {
    channels.value = []
    currentChannel.value = null
  }

  return {
    // 狀態
    channels,
    currentChannel,
    lastVisitedChannels,
    
    // 方法
    fetchServerChannels,
    fetchChannel,
    createChannel,
    updateChannel,
    deleteChannel,
    setCurrentChannel,
    getLastVisitedChannel,
    getDefaultChannelForServer,
    getGroupedChannels,
    clearChannels
  }
})
