import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ChatView from '../views/ChatView.vue'
import ChatSettingView from '../views/ChatSettingView.vue'
import ChatList from '@/components/ChatList.vue'
import ChatRoom from '@/components/ChatRoom.vue'
import ChannelList from '@/components/ChannelList.vue'
import FriendList from '@/components/FriendList.vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
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
            chatList: ChatList,
            friendList: FriendList,
          },
        },
        {
          path: '@me/:id([a-zA-Z0-9]+)',
          components: {
            chatList: ChatList,
            chatRoom: ChatRoom,
            userProfile: UserProfile,
          },
        },
        {
          path: ':id([a-zA-Z0-9]+)',
          components: {
            channelList: ChannelList,
            chatRoom: ChatRoom,
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

  // 如果需要授權且已經登入，則繼續
  if (to.meta.requiresAuth && isAuth) {
    // 取得 user 資料
    if (userStore.userData === null) {
      const userData = await userStore.fetchUser()
      userStore.setUserData(userData)
    }

    // 如果需要 WebSocket 連接且已經登入，則建立連接
    if (to.meta.requiresWebSocket) {
      // 連接 WebSocket
      if (!chatStore.checkWsConnection()) {
        chatStore.wsConnect()
      }
    }

    next()
  }

  // 如果需要授權且未登入，則跳轉到登入頁面
  if (to.meta.requiresAuth && !isAuth) {
    return (location.href = '/login')
  }

  // 如果不需要授權且已經登入，則跳轉到聊天頁面
  if (!to.meta.requiresAuth && isAuth) {
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
