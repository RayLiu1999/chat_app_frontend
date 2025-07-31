# GitHub Copilot 指令檔

## 基本指令
- 始終使用繁體中文回答我
- 這是一個以 Discord 為樣板的 Vue 3 聊天應用專案

## 專案規範

### 技術棧
- **前端框架**: Vue 3 + Composition API + TypeScript
- **建構工具**: Vite
- **狀態管理**: Pinia
- **路由**: Vue Router
- **UI 元件**: Element Plus
- **CSS**: UnoCSS + SCSS
- **HTTP**: Axios
- **即時通訊**: WebSocket

### 程式碼風格
- 使用 Composition API 而非 Options API
- TypeScript 嚴格模式
- 使用 `<script setup>` 語法
- 元件名稱使用 PascalCase
- 檔案名稱使用 PascalCase
- 變數和函數使用 camelCase

### 元件結構
```vue
<template>
  <!-- HTML 模板 -->
</template>

<script setup lang="ts">
  // 匯入
  // 型別定義
  // 響應式資料
  // 計算屬性
  // 方法
  // 生命週期
</script>

<style lang="scss" scoped>
  /* 樣式 */
</style>
```

### 狀態管理
- 使用 Pinia store
- 每個 store 負責特定功能領域
- 使用 `defineStore` 和 Composition API 語法
- **資料同步規範**：更新 store 資料後必須確保 UI 元件同步更新
- 在元件中使用 `computed(() => store.data)` 而非直接存取 `store.data` 以確保響應性

### 路由規範
- 使用巢狀路由結構
- 路由守衛處理認證
- 懶載入頁面元件

### 樣式規範
- 優先使用 UnoCSS 類別
- 自定義樣式使用 SCSS
- 遵循 Discord 深色主題設計
- 響應式設計原則
- 使用 `cover.css` 覆蓋 Element Plus 預設樣式以符合 Discord 主題
- 全域 CSS 覆蓋使用 `@layer overrides` 確保樣式優先權

### API 規範
- 使用 Axios instance
- 統一錯誤處理
- 型別安全的 API 介面

### WebSocket 規範
- 自動重連機制
- 訊息序列化/反序列化
- 連線狀態管理

## 專案特定指令

### 元件開發
- 新增元件時同步更新 components.d.ts
- 使用 `AvatarImage` 元件顯示頭像
- 訊息顯示使用現有的訊息元件模式

### 聊天功能
- DM 聊天室路由格式：`/channels/@me/:dm_room_id`
- 伺服器頻道路由格式：`/channels/:server_id/:channel_id`
- 使用 `useChatStore` 管理聊天狀態

### 使用者資料管理
- **個人資料元件**：`UserProfileSetting.vue` 負責完整的使用者資料編輯
- **帳號設定元件**：`AccountSetting.vue` 負責帳號管理和簡化的個人資料顯示
- **資料同步**：所有使用者資料更新都必須同步到 `userStore.userData`
- **圖片上傳**：支援頭像 (`picture_url`) 和橫幅 (`banner_url`) 上傳
- **表單驗證**：實施即時表單驗證和錯誤處理
- **預覽功能**：提供即時預覽功能以提升使用者體驗

### 使用者介面
- 右鍵選單使用 `PositionMenu` 元件
- **對話框系統**：
  - 使用自定義 `EditFieldDialog` 和 `ConfirmDialog` 元件
  - 避免直接使用 `ElMessageBox`，改用自定義對話框元件
  - 對話框支援 Discord 風格的深色主題
  - 使用 `cover.css` 確保對話框樣式符合設計規範
- 保持 Discord 風格的設計語言

### 開發提示
- 新增功能前檢查 `功能.md` 檔案
- 遵循現有的程式碼結構和命名慣例
- 確保型別安全和響應式設計
- 測試 WebSocket 連線和斷線情況
- **Store 資料同步**：更新任何 store 資料後，確保相關 UI 元件能正確響應變化
- **對話框使用**：優先使用專案自定義的對話框元件而非原生 Element Plus 對話框
- **圖片處理**：遵循專案的圖片上傳和預覽模式
- **型別定義**：確保所有新功能都有適當的 TypeScript 型別定義