<template>
  <div class="bg-#070922 absolute bottom-0 w-60">
    <div class="flex items-center p-2">
      <div class="default-image size-8">
        <img alt="User" class="h-full w-full" src="@/assets/images/user1.jpg" />
      </div>
      <div class="ml-2">
        <div class="text text-sm">ホタル</div>
        <div class="text-xs text-green-500">線上</div>
      </div>
      <div class="weak-text ml-auto flex space-x-2">
        <el-tooltip
          effect="dark"
          :content="!micPermissionGranted ? '需要麥克風權限' : '關閉麥克風'"
          placement="top"
          v-if="!micMuted"
        >
          <span
            class="hover:bg-#2b3375 flex w-8 flex-1 cursor-pointer justify-center rounded"
            @click="handleMicMute"
          >
            <i class="bi bi-mic-fill" style="font-size: 1.2rem"></i>
          </span>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          :content="!micPermissionGranted ? '需要麥克風權限' : '開啟麥克風'"
          placement="top"
          v-else
        >
          <span
            class="hover:bg-#2b3375 text-#e83c40 flex w-8 flex-1 cursor-pointer justify-center rounded"
            @click="handleMicMute"
          >
            <i class="bi bi-mic-mute-fill" style="font-size: 1.2rem"></i>
          </span>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          :content="!audioPermissionGranted ? '需要音效權限' : '拒聽'"
          placement="top"
          v-if="!volumeMuted"
        >
          <span
            class="hover:bg-#2b3375 flex w-8 flex-1 cursor-pointer justify-center rounded"
            @click="handleVolumeMute"
          >
            <i class="bi bi-volume-down-fill" style="font-size: 2rem; line-height: 0rem"></i>
          </span>
        </el-tooltip>
        <el-tooltip
          effect="dark"
          :content="!audioPermissionGranted ? '需要音效權限' : '解除拒聽'"
          placement="top"
          v-else
        >
          <span
            class="hover:bg-#2b3375 text-#e83c40 flex w-8 flex-1 cursor-pointer justify-center rounded"
            @click="handleVolumeMute"
          >
            <i class="bi bi-volume-mute-fill" style="font-size: 2rem; line-height: 0rem"></i>
          </span>
        </el-tooltip>
        <el-tooltip effect="dark" content="設定" placement="top">
          <span
            class="hover:bg-#2b3375 flex w-8 flex-1 cursor-pointer justify-center rounded"
            @click="SettingDialogVisible = true"
          >
            <i class="bi bi-gear-fill" style="font-size: 1.2rem"></i>
          </span>
        </el-tooltip>
      </div>
    </div>
  </div>
  <SettingDialog :dialog-visible="SettingDialogVisible" @update-visible="handleUpdate" />
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import volumeOnSound from '@/assets/sounds/volume-on.mp3'
  import volumeOffSound from '@/assets/sounds/volume-off.mp3'

  const SettingDialogVisible = ref(false)
  const micMuted = ref(true) // 預設為關閉
  const volumeMuted = ref(false)
  const micStatusBeforeVolumeMute = ref(false)
  const micMutedByVolume = ref(false)
  const micPermissionGranted = ref(false)
  const audioPermissionGranted = ref(false)

  // 创建音频上下文
  const audioContext = ref<AudioContext | null>(null)

  // 预加载音频缓冲区
  const audioBuffers = ref<{
    on: AudioBuffer | null
    off: AudioBuffer | null
  }>({
    on: null,
    off: null,
  })

  // 初始化音频
  const initAudio = async () => {
    // 仅在浏览器环境中初始化
    if (typeof window !== 'undefined') {
      audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()

      try {
        // 预加载音频文件
        const [onBuffer, offBuffer] = await Promise.all([
          fetch(volumeOnSound)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => audioContext.value!.decodeAudioData(arrayBuffer)),
          fetch(volumeOffSound)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => audioContext.value!.decodeAudioData(arrayBuffer)),
        ])

        audioBuffers.value = {
          on: onBuffer,
          off: offBuffer,
        }
      } catch (err) {
        console.error('Failed to load audio buffers:', err)
      }
    }
  }

  // 播放音效
  const playSound = (type: 'on' | 'off') => {
    if (!audioContext.value || !audioBuffers.value[type]) {
      console.log('Audio not initialized')
      return
    }

    try {
      // 创建音频源
      const source = audioContext.value.createBufferSource()
      source.buffer = audioBuffers.value[type]

      // 连接到输出
      source.connect(audioContext.value.destination)

      // 播放
      source.start(0)
    } catch (err) {
      console.log('Failed to play sound:', err)
    }
  }

  // 檢查麥克風權限
  const checkMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop()) // 立即停止使用麥克風
      micPermissionGranted.value = true
    } catch (err) {
      console.log('Microphone permission denied:', err)
      micPermissionGranted.value = false
    }
  }

  // 檢查音效權限
  const checkAudioPermission = async () => {
    try {
      const audioContext = new AudioContext()
      await audioContext.resume()
      audioContext.close()
      audioPermissionGranted.value = true
    } catch (err) {
      console.log('Audio permission denied:', err)
      audioPermissionGranted.value = false
    }
  }

  onMounted(async () => {
    // await Promise.all([checkMicPermission(), checkAudioPermission()])
    initAudio()
  })

  // 更新 SettingDialog 的顯示狀態
  const handleUpdate = (value: boolean) => {
    SettingDialogVisible.value = value
  }

  const handleMicMute = async () => {
    if (!micPermissionGranted.value) {
      // 如果沒有麥克風權限，重新請求權限
      await checkMicPermission()
      if (!micPermissionGranted.value) return // 如果還是沒有權限，不做任何事
    }

    if (micMuted.value) {
      // 當要開啟麥克風時
      if (micMutedByVolume.value) {
        // 如果麥克風是被聲音關閉的，開啟麥克風時也要開啟聲音
        volumeMuted.value = false
        micMutedByVolume.value = false
      }
      micMuted.value = false
    } else {
      // 當要關閉麥克風時
      micMuted.value = true
    }
  }

  const handleVolumeMute = async () => {
    if (!audioPermissionGranted.value) {
      // 如果沒有音效權限，重新請求權限
      await checkAudioPermission()
      if (!audioPermissionGranted.value) return // 如果還是沒有權限，不做任何事
    }

    if (!volumeMuted.value) {
      // 當要關閉聲音時
      playSound('off')
      micStatusBeforeVolumeMute.value = !micMuted.value // 儲存當前麥克風狀態
      volumeMuted.value = true
      if (!micMuted.value) {
        micMuted.value = true // 如果麥克風開著才關閉
        micMutedByVolume.value = true // 標記麥克風是被聲音關閉的
      }
    } else {
      // 當要開啟聲音時
      playSound('on')
      volumeMuted.value = false
      if (micStatusBeforeVolumeMute.value) {
        micMuted.value = false // 只有當之前麥克風是開啟的才打開
        micMutedByVolume.value = false
      }
    }
  }
</script>
