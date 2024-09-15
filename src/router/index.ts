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
import { useTokenStore } from '@/stores/token'

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

// 身分驗證
router.beforeEach((to, from, next) => {
  const tokenStore = useTokenStore()
  const isAuthenticated = tokenStore.isAuthenticated
  if (to.name !== 'login' && to.name !== 'register' && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
