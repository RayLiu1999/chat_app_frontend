<template>
  <div class="bg-#0c0c31 relative w-60">
    <div class="p-4">
      <div class="mb-4">
        <input
          class="bg-#14175a text w-full rounded p-2"
          placeholder="搜尋或開始一個對話"
          type="text"
          @click="ElMessage.info('敬請期待此功能！')"
          @contextmenu.stop
        />
      </div>
      <RouterLink :to="`/channels/@me`">
        <div class="button-hover space-y-2 p-1">
          <div class="flex cursor-pointer items-center space-x-2">
            <i class="bi bi-person-fill" style="font-size: 1.5rem"></i>
            <span class="weak-text"> 好友 </span>
          </div>
        </div>
      </RouterLink>
      <div class="mt-4">
        <p class="text-3 weak-text mb-2">私人訊息</p>
        <div v-for="dmRoom in dmRooms" :key="dmRoom.room_id">
          <RouterLink :to="`/channels/@me/${dmRoom.room_id}`">
            <div 
              class="mb-2 flex cursor-pointer items-center p-1"
              :class="{
                'button-hover': !isCurrentDMRoom(dmRoom.room_id),
                'active-chat': isCurrentDMRoom(dmRoom.room_id)
              }"
            >
              <div class="mr-2">
                <AvatarImage
                  :src="dmRoom.picture_url"
                  alt="User"
                  size="xs"
                  :status="dmRoom.is_online ? 'online' : 'offline'"
                />
              </div>
              <span class="weak-text"> {{ dmRoom.nickname }} </span>
              <span class="ml-auto hover:text-white cursor-pointer">
                <i class="bi bi-x" @click="handleHideDMRoom(dmRoom.room_id)"></i>
              </span>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
    <BottomBar />
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useChatStore } from '@/stores/chat'
  import { ElMessage } from 'element-plus'
  import { useFetchData } from '@/composables/useFetchData'

  const route = useRoute()
  const chatStore = useChatStore()
  const dmRooms = computed(() => chatStore.dmRooms)
  const { isLoading, fetchData } = useFetchData(chatStore.fetchDMRoomList)

  // 判斷是否為當前聊天室
  const isCurrentDMRoom = (dmRoomId: string): boolean => {
    // 檢查當前路由是否匹配特定的聊天室
    return route.path === `/channels/@me/${dmRoomId}`
  }

  onMounted(async () => {
    fetchData()
  })

  // 隱藏DM聊天室
  const handleHideDMRoom = async (dmRoomId: string) => {
    try {
      await chatStore.fetchHideDMRoom(dmRoomId)
    } catch (error) {
      console.error(error);
    }
  }
</script>

<style scoped>
.active-chat {
  background-color: #14175a;
  border-radius: 0.25rem;
}
</style>
