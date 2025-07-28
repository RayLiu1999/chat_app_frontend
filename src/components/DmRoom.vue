<template>
  <ChatRoom 
    room-type="dm" 
    :room-id="dmRoomId" 
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ChatRoom from '@/components/ChatRoom.vue'

const route = useRoute()
const dmRoomId = computed(() => route.params.dm_room_id as string)
</script>


