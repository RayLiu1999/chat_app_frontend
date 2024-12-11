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
import { useUserStore } from '@/stores/user'
import MemberList from '@/components/MemberList.vue'
import UserProfile from '@/components/UserProfile.vue'

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

  // 如果沒有登入，且不是登入或註冊頁面，則跳轉到登入頁面
  if (to.name !== 'login' && to.name !== 'register' && !isAuth) {
    return (location.href = '/login')
  }

  // 如果已經登入，且是在登入或註冊頁面，則跳轉到聊天頁面
  if (isAuth && (to.name === 'login' || to.name === 'register')) {
    return (location.href = '/channels/@me')
  }

  // 取得 user 資料
  if (isAuth && userStore.userData === null) {
    const userData = await userStore.fetchUser()
    userStore.setUserData(userData)
  }

  next()
})

export default router
