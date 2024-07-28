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
  ],
})
