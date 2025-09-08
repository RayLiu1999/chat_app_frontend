import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import type { Channel } from '@/types/chat'
import type { ChannelAPI, APIResponse } from '@/types/api'
import { handleDeleteResponse, handleAPIResponse } from '@/api/utils'

export const useChannelStore = defineStore('channel', () => {
  // 狀態
  const channels = ref<Channel[]>([])
  const currentChannel = ref<Channel | null>(null)
  
  // 記住每個 server 的最後訪問頻道 (只存在前端記憶體中)
  const lastVisitedChannels = ref<Record<string, string>>({})

  // 獲取伺服器頻道列表
  const fetchServerChannels = async (serverId: string): Promise<void> => {
    try {
      const { data: response } = await api.get<APIResponse<Channel[]>>(`/servers/${serverId}/channels`)
      const channelList = handleAPIResponse(response, '獲取伺服器頻道')
      channels.value = channelList
    } catch (error) {
      throw error
    }
  }

  // 獲取單個頻道資訊
  const fetchChannel = async (channelId: string): Promise<void> => {
    try {
      const { data: response } = await api.get<APIResponse<Channel>>(`/channels/${channelId}`)
      const channel = handleAPIResponse(response, '獲取頻道資訊')
      
      currentChannel.value = channel
      // 更新本地頻道列表中的頻道資訊
      const index = channels.value.findIndex(c => c.id === channel.id)
      if (index !== -1) {
        channels.value[index] = channel
      }
    } catch (error) {
      throw error
    }
  }

  // 創建頻道
  const fetchCreateChannel = async (serverId: string, channelData: ChannelAPI.Request.Create): Promise<Channel> => {
    try {
      const { data: response } = await api.post<APIResponse<Channel>>(`/servers/${serverId}/channels`, channelData)
      const newChannel = handleAPIResponse(response, '建立頻道')
      channels.value.push(newChannel)
      return newChannel
    } catch (error) {
      throw error
    }
  }

  // 更新頻道
  const fetchUpdateChannel = async (channelId: string, channelData: ChannelAPI.Request.Update): Promise<Channel> => {
    try {
      const { data: response } = await api.put<APIResponse<Channel>>(`/channels/${channelId}`, channelData)
      const updatedChannel = handleAPIResponse(response, '更新頻道')
      
      // 更新本地頻道列表
      const index = channels.value.findIndex(c => c.id === channelId)
      if (index !== -1) {
        channels.value[index] = updatedChannel
      }
      
      // 更新當前頻道（如果是當前頻道）
      if (currentChannel.value?.id === channelId) {
        currentChannel.value = updatedChannel
      }
      
      return updatedChannel
    } catch (error) {
      throw error
    }
  }

  // 刪除頻道
  const fetchDeleteChannel = async (channelId: string): Promise<void> => {
    try {
      const { data: response } = await api.delete<APIResponse<null>>(`/channels/${channelId}`)
      
      // 使用 handleDeleteResponse 處理刪除回應
      handleDeleteResponse(response, '刪除頻道')
      
      // 成功後更新本地狀態
      channels.value = channels.value.filter(channel => channel.id !== channelId)
      
      // 如果刪除的是當前頻道，清空當前頻道
      if (currentChannel.value?.id === channelId) {
        currentChannel.value = null
      }
    } catch (error) {
      throw error
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
    fetchCreateChannel,
    fetchUpdateChannel,
    fetchDeleteChannel,
    setCurrentChannel,
    getLastVisitedChannel,
    getDefaultChannelForServer,
    getGroupedChannels,
    clearChannels
  }
})
