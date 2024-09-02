// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  shortcuts: [
    // 底線未選擇狀態
    [
      'border-hover',
      'group-hover:absolute group-hover:bottom-0 group-hover:left-0 group-hover:right-0 group-hover:h-[1px] group-hover:bg-white',
    ],
    // 底線選擇狀態
    ['border-current', 'absolute bottom-0 left-0 right-0 h-[1px] bg-white'],
    // 頻道選擇狀態
    ['host-border-none', 'absolute w-3px h-0px bg-white rounded left-0'],
    ['host-border-active', 'absolute w-3px h-5px bg-white rounded left-0'],
    ['host-border-current', 'absolute w-3px h-30px bg-white rounded left-0'],
    ['host-border-hover', 'absolute w-3px hover: h-10px bg-white rounded left-0'],
    // 按鈕選擇狀態
    ['button-hover', 'hover:bg-#313557 rounded cursor-pointer'],
    ['button-current', 'bg-#313557 rounded cursor-pointer'],
    // 文字樣式
    ['text', 'text-gray-2'],
    ['weak-text', 'text-gray-5'],
  ],
})
