import { defineStore } from 'pinia'

interface Message {
  id: number
  content: string
  userId: string
  timestamp: Date
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as Message[],
    channels: ['general', 'random', 'help'] as string[],
    currentChannel: 'general'
  }),
  actions: {
    addMessage(message: Message) {
      this.messages.push(message)
    },
    setCurrentChannel(channel: string) {
      this.currentChannel = channel
    }
  }
})
