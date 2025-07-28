<template>
  <div class="bg-#161f73 relative flex w-16 flex-col items-center py-4">
    <div>
      <div class="channel-group flex items-center">
        <span :class="isCurrentPage('@me') ? 'host-border-active' : 'host-border-none'"></span>
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
        <span :class="isCurrentPage(server.id) ? 'host-border-active' : 'host-border-none'"></span>
        <RouterLink v-slot="{ navigate }" :to="`/channels/${server.id}`" custom>
          <el-tooltip
            effect="dark"
            :content="server.name"
            placement="left-start"
            :disabled="tooltipDisable"
          >
            <button @click="navigate" @contextmenu="handleRightClick($event, server.id)">
              <AvatarImage :src="server.picture_url" alt="Server Image" size="xl" />
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
      <el-tooltip effect="dark" content="探索伺服器" placement="left-start">
        <button @click="ExploreServersDialogVisible = true">
          <div
            class="hover:bg-#2b3375 flex size-12 items-center justify-center rounded-full bg-[rgba(128,128,128,0.5)]"
          >
            <span class="color-white">
              <i class="bi bi-compass"></i>
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
  <ExploreServersDialog
    :dialog-visible="ExploreServersDialogVisible"
    @update-visible="handleExploreServersDialog"
  />
  <PositionMenu ref="menuRef">
    <template #item>
      <li @click="handleAddServerDialog(true)">新增伺服器</li>
      <li @click="handleInvite">邀請好友</li>
      <li @click="handleSettings">伺服器設定</li>
      <li @click="handleNotification">通知設定</li>
      <li @click="handleLeave" class="danger">離開伺服器</li>
      <li @click="handleDeleteServer" class="danger">刪除伺服器</li>
    </template>
  </PositionMenu>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useServerStore } from '@/stores/server'
import type { Server } from '@/types/chat'
import PositionMenu from './PositionMenu.vue'
import ExploreServersDialog from './dialogs/ExploreServersDialog.vue'
import AvatarImage from './AvatarImage.vue'
import AddServerDialog from './dialogs/AddServerDialog.vue'

const route = useRoute()
const serverStore = useServerStore()
const servers = computed(() => serverStore.servers || [])

// 判斷是否為當前頁面
const isCurrentPage = (pageId: string): boolean => {
  if (pageId === '@me') {
    // 檢查是否在私人訊息頁面
    return route.path.startsWith('/channels/@me')
  } else {
    // 檢查是否在對應的伺服器頁面
    return route.params.server_id === pageId
  }
}  // 伺服器設定下拉選單
  const menuRef = ref<InstanceType<typeof PositionMenu> | null>(null)
  // 顯示tooltip
  const tooltipDisable = ref(false)
  // 當前右鍵點擊的伺服器ID
  const currentServerId = ref<string>('')

  // 使用 ref 來追蹤 AddServerDialog 的顯示狀態
  const AddServerDialogVisible = ref(false)
  
  // 使用 ref 來追蹤 ExploreServersDialog 的顯示狀態
  const ExploreServersDialogVisible = ref(false)

  onMounted(async () => {
    await serverStore.fetchServerList()
    if (serverStore.servers) {
    }
  })

  // 監聽contextMenuVisible判斷tooltip
  const handleRightClick = (event: { clientX: number; clientY: number }, serverId: string) => {
    currentServerId.value = serverId
    menuRef.value?.showMenu({
      x: event.clientX,
      y: event.clientY
    })
  }

  // 更新 AddServerDialog 的顯示狀態
  const handleAddServerDialog = (value: boolean) => {
    AddServerDialogVisible.value = value
  }

  // 更新 ExploreServersDialog 的顯示狀態
  const handleExploreServersDialog = (value: boolean) => {
    ExploreServersDialogVisible.value = value
  }

  // 右鍵選單處理函數
  const handleInvite = () => {
    // 處理邀請好友的邏輯
    console.log('邀請好友到伺服器:', currentServerId.value)
    menuRef.value?.hideMenu()
  }

  const handleSettings = () => {
    // 處理伺服器設定的邏輯
    console.log('打開伺服器設定:', currentServerId.value)
    menuRef.value?.hideMenu()
  }

  const handleNotification = () => {
    // 處理通知設定的邏輯
    console.log('打開通知設定:', currentServerId.value)
    menuRef.value?.hideMenu()
  }

  const handleLeave = async () => {
    await serverStore.leaveServer(currentServerId.value)
    // 重新載入伺服器列表
    await serverStore.fetchServerList()
    menuRef.value?.hideMenu()
  }

  const handleDeleteServer = async () => {
    await serverStore.deleteServer(currentServerId.value)
    // 重新載入伺服器列表
    await serverStore.fetchServerList()
    menuRef.value?.hideMenu()
  }
</script>

<style lang="scss" scoped>
  .channel-group:hover .host-border-active,
  .channel-group:hover .host-border-none {
    height: 10px;
  }
  
  .host-border-active,
  .host-border-none {
    position: absolute;
    left: 0;
    width: 4px;
    background-color: white;
    border-radius: 0 4px 4px 0;
    transition: height 0.2s ease;
  }
  
  .host-border-active {
    height: 40px;
  }
  
  .host-border-none {
    height: 0;
  }
</style>
