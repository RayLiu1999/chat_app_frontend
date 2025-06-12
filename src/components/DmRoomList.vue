<template>
  <div class="bg-#0c0c31 relative w-60">
    <div class="p-4">
      <div class="mb-4">
        <input
          class="bg-#14175a text w-full rounded p-2"
          placeholder="搜尋或開始一個對話"
          type="text"
          @click="console.log(123)"
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
        <div v-for="dm_room in dm_rooms" :key="dm_room.room_id">
          <RouterLink :to="`/channels/@me/${dm_room.room_id}`">
            <div 
              class="mb-2 flex cursor-pointer items-center p-1"
              :class="{
                'button-hover': !isCurrentDMRoom(dm_room.room_id),
                'active-chat': isCurrentDMRoom(dm_room.room_id)
              }"
            >
              <div class="mr-2">
                <AvatarImage
                  :src="dm_room.picture_url"
                  alt="User"
                  size="xs"
                />
              </div>
              <span class="weak-text"> {{ dm_room.nickname }} </span>
              <span class="ml-auto hover:text-white cursor-pointer">
                <i class="bi bi-x" @click="handleHideDMRoom(dm_room.room_id)"></i>
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

  const route = useRoute()
  const chatStore = useChatStore()
  const dm_rooms = computed(() => chatStore.dm_rooms)

  // 判斷是否為當前聊天室
  const isCurrentDMRoom = (dm_room_id: string): boolean => {
    // 檢查當前路由是否匹配特定的聊天室
    return route.path === `/channels/@me/${dm_room_id}`
  }

  onMounted(async () => {
    await chatStore.fetchDMRoomList()
  })

  const handleHideDMRoom = (dm_room_id: string) => {
    chatStore.fetchHideDMRoom(dm_room_id)
  }
</script>

<style scoped>
.active-chat {
  background-color: #14175a;
  border-radius: 0.25rem;
}
</style>
