<template>
  <div class="bg-#161f73 relative flex w-16 flex-col items-center py-4">
    <div>
      <div class="channel-group flex items-center">
        <span class="host-border-none"></span>
        <el-tooltip effect="dark" content="私人訊息" placement="left-start">
          <RouterLink to="/channels/@me">
            <div
              class="bg-#5865f2 flex size-10 cursor-pointer items-center justify-center rounded-lg"
            >
              <i class="bi bi-chat-dots-fill" style="font-size: 1.5rem; color: white"></i>
            </div>
          </RouterLink>
        </el-tooltip>
      </div>
      <hr class="border-white-300 my-2 border-t" />
    </div>
    <div class="flex flex-col space-y-3">
      <div v-for="item in 10" :key="item" class="channel-group flex items-center">
        <span class="host-border-active"></span>
        <el-tooltip effect="dark" content="私人訊息" placement="left-start">
          <RouterLink :to="`/channels/@me/${item}`">
            <div class="default-image w-40px h-40px">
              <img
                alt="User"
                class="size-10 cursor-pointer rounded-full"
                src="@/assets/images/user1.jpg"
              />
            </div>
          </RouterLink>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts"></script>

<style scoped></style>
