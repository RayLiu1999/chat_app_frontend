<template>
  <div class="bg-#161f73 relative flex w-16 flex-col items-center py-4">
    <div>
      <div class="channel-group flex items-center">
        <span class="host-border-none"></span>
        <RouterLink v-slot="{ navigate }" to="/channels/@me" custom>
          <el-tooltip effect="dark" content="私人訊息" placement="left-start">
            <button @click="navigate">
              <span
                class="bg-#5865f2 flex size-10 cursor-pointer items-center justify-center rounded-lg"
              >
                <i class="bi bi-chat-dots-fill" style="font-size: 1.5rem; color: white"></i>
              </span>
            </button>
          </el-tooltip>
        </RouterLink>
      </div>
      <hr class="border-white-300 my-2 border-t" />
    </div>
    <div class="flex flex-col space-y-3">
      <div v-for="item in 10" :key="item" class="channel-group flex items-center">
        <span class="host-border-active"></span>
        <RouterLink v-slot="{ navigate }" :to="`/channels/@me/${item}`" custom>
          <el-tooltip effect="dark" content="私人訊息" placement="left-start">
            <button @click="navigate">
              <div class="default-image w-40px h-40px">
                <img
                  alt="User"
                  class="size-10 cursor-pointer rounded-full"
                  src="@/assets/images/user1.jpg"
                />
              </div>
            </button>
          </el-tooltip>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
  .channel-group:hover .host-border-active,
  .channel-group:hover .host-border-none {
    height: 10px;
  }
</style>
