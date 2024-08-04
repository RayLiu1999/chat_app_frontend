import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ChatView from '../views/ChatView.vue'
import ChatSettingView from '../views/ChatSettingView.vue'
import ChatList from '@/components/ChatList.vue'
import ChatRoom from '@/components/ChatRoom.vue'

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
            // friendList: FriendList,
          },
        },
        {
          path: '@me/:id',
          components: {
            chatList: ChatList,
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

export default router
