import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ChatView from '../views/ChatView.vue'
import ChatSettingView from '../views/ChatSettingView.vue'
import ChatList from '@/components/ChatList.vue'
import ChatRoom from '@/components/ChatRoom.vue'
import ChannelList from '@/components/ChannelList.vue'
import FriendList from '@/components/FriendList.vue'
import { isAuthenticated } from '@/composables/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/channels',
      name: 'channels',
      component: ChatView,
      children: [
        {
          path: '',
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
          path: '@me/:id',
          components: {
            channelList: ChannelList,
            chatRoom: ChatRoom,
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
  const isAuth = await isAuthenticated() // 權限判斷

  // 如果沒有登入，且不是登入或註冊頁面，則跳轉到登入頁面
  if (to.name !== 'login' && to.name !== 'register' && !isAuth) {
    return (location.href = '/login')
  }

  // 如果已經登入，且是在登入或註冊頁面，則跳轉到聊天頁面
  if (isAuth && (to.name === 'login' || to.name === 'register')) {
    return (location.href = '/channels/@me')
  }

  next()
})

export default router
