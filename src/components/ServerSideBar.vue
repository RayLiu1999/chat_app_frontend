<template>
  <div class="bg-#161f73 relative flex w-16 flex-col items-center py-4">
    <div>
      <div class="channel-group flex items-center">
        <span class="host-border-none"></span>
        <RouterLink v-slot="{ navigate }" to="/channels/@me" custom>
          <el-tooltip effect="dark" content="私人訊息" placement="left-start">
            <button @click="navigate">
              <span
                class="bg-#5865f2 flex size-12 cursor-pointer items-center justify-center rounded-full"
              >
                <span class="font-size-6 color-white">
                  <i class="bi bi-chat-dots-fill"></i>
                </span>
              </span>
            </button>
          </el-tooltip>
        </RouterLink>
      </div>
      <hr class="border-white-300 my-2 border-t" />
    </div>
    <div class="flex flex-col space-y-3">
      <div v-if="servers.length > 0" v-for="server in servers" :key="server.id" class="channel-group flex items-center">
        <span class="host-border-active"></span>
        <RouterLink v-slot="{ navigate }" :to="`/channels/${server.id}`" custom>
          <el-tooltip
            effect="dark"
            :content="server.name"
            placement="left-start"
            :disabled="tooltipDisable"
          >
            <button @click="navigate" @contextmenu="handleRightClick($event)">
              <div class="default-image size-12">
                <img
                  alt="Server Image"
                  class="size-12 cursor-pointer rounded-full"
                  :src="server.picture_url"
                />
              </div>
            </button>
          </el-tooltip>
        </RouterLink>
        <!-- 自訂的下拉選單 -->
        <!-- <div v-if="showMenu" :style="{ top: menuY + 'px', left: menuX + 'px' }" class="custom-menu">
          <ul>
            <li @click="menuAction('Action 1')">選項 1</li>
            <li @click="menuAction('Action 2')">選項 2</li>
            <li @click="menuAction('Action 3')">選項 3</li>
          </ul>
        </div> -->
      </div>
      <el-tooltip effect="dark" content="新增一個伺服器" placement="left-start">
        <button @click="AddServerDialogVisible = true">
          <div
            class="hover:bg-#2b3375 flex size-12 items-center justify-center rounded-full bg-[rgba(128,128,128,0.5)]"
          >
            <span class="color-white">
              <i class="bi bi-plus"></i>
            </span>
          </div>
        </button>
      </el-tooltip>
      </div>
    </div>
  <AddServerDialog
    :dialog-visible="AddServerDialogVisible"
    @update-visible="handleAddServerDialog"
  />
  <PositionMenu :position="menuPosition" v-model:visible="contextMenuVisible">
    <template #item>
      <li @click="handleAddServerDialog(true)">新增伺服器</li>
      <li @click="handleInvite">邀請好友</li>
      <li @click="handleSettings">伺服器設定</li>
      <li @click="handleNotification">通知設定</li>
      <li @click="handleLeave" class="danger">離開伺服器</li>
    </template>
  </PositionMenu>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue'
  import { useChatStore } from '@/stores/chat'
  import type { Server } from '@/types/chat'

  const chatStore = useChatStore()
  const servers = ref<Server[]>([])

  // 伺服器設定下拉選單
  const menuPosition = ref({ x: 0, y: 0 }) // 定義選單顯示位置
  const contextMenuVisible = ref(false) // 控制選單顯示與否

  // 顯示tooltip
  const tooltipDisable = ref(false)

  // 使用 ref 來追蹤 AddServerDialog 的顯示狀態
  const AddServerDialogVisible = ref(false)

  onMounted(async () => {
    await chatStore.fetchServerList()
    if (chatStore.servers) {
      servers.value = chatStore.servers
    }
  })

  // 監聽contextMenuVisible判斷tooltip
  watch(contextMenuVisible, (value) => {
    tooltipDisable.value = value
  })

  const handleRightClick = (event: { clientX: number; clientY: number }) => {
    menuPosition.value = { x: event.clientX, y: event.clientY } // 設置選單位置
    contextMenuVisible.value = true // 顯示選單
  }

  // 更新 AddServerDialog 的顯示狀態
  const handleAddServerDialog = (value: boolean) => {
    AddServerDialogVisible.value = value
  }

  // 右鍵選單處理函數
  const handleInvite = () => {
    // 處理邀請好友的邏輯
    contextMenuVisible.value = false
  }

  const handleSettings = () => {
    // 處理伺服器設定的邏輯
    contextMenuVisible.value = false
  }

  const handleNotification = () => {
    // 處理通知設定的邏輯
    contextMenuVisible.value = false
  }

  const handleLeave = () => {
    // 處理離開伺服器的邏輯
    contextMenuVisible.value = false
  }
</script>

<style lang="scss" scoped>
  .channel-group:hover .host-border-active,
  .channel-group:hover .host-border-none {
    height: 10px;
  }
</style>
