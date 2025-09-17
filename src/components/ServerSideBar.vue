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
                  <img src="@/assets/images/logo.png" alt="Chat App Logo" class="h-10 w-10" />
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
      </div>
      <el-tooltip effect="dark" content="新增一個伺服器" placement="left-start">
        <button @click="AddServerDialogVisible = true">
          <div
        class="hover:bg-#2b3375 flex size-12 items-center justify-center rounded-full bg-[rgba(128,128,128,0.5)]"
          >
        <span class="font-size-6 color-white">
          <i class="bi bi-plus-lg"></i>
        </span>
          </div>
        </button>
            </el-tooltip>
            <el-tooltip effect="dark" content="探索伺服器" placement="left-start">
        <button @click="ExploreServersDialogVisible = true">
          <div
        class="hover:bg-#2b3375 flex size-12 items-center justify-center rounded-full bg-[rgba(128,128,128,0.5)]"
          >
        <span class="font-size-6 color-white">
          <i class="bi bi-compass-fill"></i>
        </span>
          </div>
        </button>
      </el-tooltip>
      </div>
    </div>
  <!-- 新增伺服器對話框 -->
  <AddServerDialog
    :dialog-visible="AddServerDialogVisible"
    @update-visible="handleAddServerDialog"
  />
  <!-- 探索伺服器對話框 -->
  <ExploreServersDialog
    :dialog-visible="ExploreServersDialogVisible"
    @update-visible="handleExploreServersDialog"
  />
  <!-- 右鍵選單 -->
  <PositionMenu ref="menuRef">
    <template #item>
      <li @click="handleInvite"><i class="bi bi-person-plus-fill mr-2"></i>邀請好友</li>
      <li @click="handleSettings"><i class="bi bi-gear-fill mr-2"></i>伺服器設定</li>
      <li @click="handleNotification"><i class="bi bi-bell-fill mr-2"></i>通知設定</li>
      <li @click="handleLeave" class="danger"><i class="bi bi-door-open-fill mr-2"></i>離開伺服器</li>
      <li @click="handleDeleteServer" class="danger"><i class="bi bi-trash-fill mr-2"></i>刪除伺服器</li>
    </template>
  </PositionMenu>

  <!-- 確認對話框 -->
  <ConfirmDialog
    v-model:visible="showConfirmDialog"
    :title="confirmData.title"
    :message="confirmData.message"
    :type="confirmData.type"
    :confirm-text="confirmData.confirmText"
    @confirm="confirmData.onConfirm"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useServerStore } from '@/stores/server'
import PositionMenu from './PositionMenu.vue'
import ExploreServersDialog from './dialogs/ExploreServersDialog.vue'
import AvatarImage from './AvatarImage.vue'
import AddServerDialog from './dialogs/AddServerDialog.vue'
import { useFetchData } from '@/composables/useFetchData'
import { ElMessage } from 'element-plus'
import ConfirmDialog from './dialogs/ConfirmDialog.vue'

const route = useRoute()
const serverStore = useServerStore()
const servers = computed(() => serverStore.servers || [])
const { isLoading, fetchData } = useFetchData(serverStore.fetchServerList)
const showConfirmDialog = ref(false)
const confirmData = ref<{
  title: string
  message: string
  type: 'info' | 'warning' | 'danger' | 'success'
  confirmText: string
  onConfirm: () => void
}>({
  title: '',
  message: '',
  type: 'info',
  confirmText: '確認',
  onConfirm: () => {}
})

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
    fetchData()
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
    ElMessage.info('敬請期待此功能！')
    hideServerMenu()
  }

  const handleSettings = () => {
    // 處理伺服器設定的邏輯
    ElMessage.info('敬請期待此功能！')
    hideServerMenu()
  }

  const handleNotification = () => {
    // 處理通知設定的邏輯
    ElMessage.info('敬請期待此功能！')
    hideServerMenu()
  }

  const handleLeave = async () => {
    confirmData.value = {
      title: '離開伺服器',
      message: '確定要離開此伺服器嗎？',
      type: 'danger',
      confirmText: '離開',
      onConfirm: async () => {
        try {
          await serverStore.fetchLeaveServer(currentServerId.value)
          await fetchData()
          ElMessage.success('已離開伺服器')
        } catch (error) {
          console.error(error)
        }
        finally {
          showConfirmDialog.value = false
        }
      }
    }
    hideServerMenu()
    showConfirmDialog.value = true
  }

  const handleDeleteServer = async () => {
    confirmData.value = {
      title: '刪除伺服器',
      message: '確定要刪除此伺服器嗎？此操作無法復原。',
      type: 'danger',
      confirmText: '刪除',
      onConfirm: async () => {
        try {
          await serverStore.fetchDeleteServer(currentServerId.value)
          await fetchData()
          ElMessage.success('伺服器已刪除')
        } catch (error) {
          console.error(error)
        }
        finally {
          showConfirmDialog.value = false
        }
      }
    }
    hideServerMenu()
    showConfirmDialog.value = true
  }

  const hideServerMenu = () => {
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
