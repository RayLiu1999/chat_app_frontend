import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ChatView from '../views/ChatView.vue'
import ChatSettingView from '../views/ChatSettingView.vue'
import DmRoomList from '@/components/DmRoomList.vue'
import DmRoom from '@/components/DmRoom.vue'
import ChannelList from '@/components/ChannelList.vue'
import ChannelRoom from '@/components/ChannelRoom.vue'
import FriendList from '@/components/FriendList.vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import { useChannelStore } from '@/stores/channel'
import MemberList from '@/components/MemberList.vue'
import UserProfile from '@/components/UserProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/channels',
      name: 'channels',
      component: ChatView,
      meta: {
        requiresAuth: true,
        requiresWebSocket: true,
      },
      children: [
        {
          path: '/',
          redirect: '/channels/@me', // 默認重定向到 @me
        },
        {
          path: '@me',
          components: {
            dmRoomList: DmRoomList,
            friendList: FriendList,
          },
        },
        {
          path: '@me/:dm_room_id([a-zA-Z0-9]+)',
          components: {
            dmRoomList: DmRoomList,
            dmRoom: DmRoom,
            userProfile: UserProfile,
          },
        },
        {
          path: ':server_id([a-zA-Z0-9]+)',
          components: {
            channelList: ChannelList,
            memberList: MemberList,
          },
        },
        {
          path: ':server_id([a-zA-Z0-9]+)/:channel_id([a-zA-Z0-9]+)',
          components: {
            channelList: ChannelList,
            channelRoom: ChannelRoom,
            memberList: MemberList,
          },
        },
      ],
    },
    {
      path: '/chat-setting',
      name: 'chat-setting',
      component: ChatSettingView,
    },
  ],
})

// 路由守衛
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const isAuth = await userStore.isAuthenticated() // 權限判斷
  const chatStore = useChatStore()
  const channelStore = useChannelStore()

  // 如果需要授權且已經登入，則繼續
  if (to.meta.requiresAuth && isAuth) {
    // 取得 user 資料
    if (userStore.userData === null) {
      try {
        await userStore.fetchUser()
      } catch (error) {
        console.error('獲取使用者資料失敗:', error)
        return next('/login')
      }
    }

    // 處理伺服器頁面自動重定向邏輯
    if (to.path.match(/^\/channels\/[a-zA-Z0-9]+$/) && to.params.server_id) {
      const serverId = to.params.server_id as string
      console.log(`路由守衛: 處理伺服器頁面 ${serverId}`)
      
      try {
        // 載入頻道列表
        await channelStore.fetchServerChannels(serverId)
        
        // 獲取預設頻道
        const defaultChannel = channelStore.getDefaultChannelForServer(serverId)
        
        if (defaultChannel) {
          console.log(`路由守衛: 重定向到頻道 ${defaultChannel.id}`)
          // 重定向到預設頻道
          return next(`/channels/${serverId}/${defaultChannel.id}`)
        } else {
          // 如果沒有預設頻道，停留在伺服器頁面
          console.warn(`路由守衛: 沒有找到伺服器 ${serverId} 的預設頻道`)
          return next()
        }
      } catch (error) {
        console.error('路由守衛: 載入頻道失敗:', error)
        // 發生錯誤時，停留在當前頁面而不是跳轉
        return next()
      }
    }

    // 如果需要 WebSocket 連接且已經登入，則建立連接
    if (to.meta.requiresWebSocket) {
      // 連接 WebSocket
      if (! (await chatStore.checkWsConnection())) {
        await chatStore.wsConnect()
      }
    }

    return next()
  }

  // 如果需要授權且未登入，則跳轉到登入頁面
  if (to.meta.requiresAuth && !isAuth) {
    return (location.href = '/login')
  }

  // 如果不需要授權且已經登入，且不是在 channels 路由下，則跳轉到聊天頁面
  if (!to.meta.requiresAuth && isAuth && !to.path.startsWith('/channels')) {
    return (location.href = '/channels/@me')
  }

  next()
})

// 全局後置守衛
router.afterEach((to) => {
  // 可以在這裡處理頁面標題、分析追蹤等
  document.title = `Chat App`
})

export default router
