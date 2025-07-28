<template>
  <ChatRoom 
    room-type="channel" 
    :room-id="channelId" 
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ChatRoom from '@/components/ChatRoom.vue'

const route = useRoute()
const channelId = computed(() => route.params.channel_id as string)
</script>
