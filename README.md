# Discord 聊天應用前端

以 Discord 為樣板製作的即時聊天應用前端專案，支援私人訊息、伺服器頻道聊天等功能。

## 🚀 技術棧

- **前端框架**: Vue 3 + Composition API
- **開發語言**: TypeScript 
- **建構工具**: Vite
- **狀態管理**: Pinia
- **路由管理**: Vue Router
- **UI 元件庫**: Element Plus
- **CSS 框架**: UnoCSS
- **樣式預處理器**: SCSS
- **HTTP 客戶端**: Axios
- **即時通訊**: WebSocket
- **測試框架**: Vitest
- **代碼規範**: ESLint + Prettier

## 📋 功能特色

### ✅ 已完成功能
- **會員系統**
  - 使用者註冊、登入
  - JWT Token 認證
  - 自動保持登入狀態
  - 好友系統
  
- **伺服器管理**
  - 顯示伺服器清單
  - 伺服器圖標與 Tooltip
  - 右鍵選單功能

- **即時通訊**
  - WebSocket 即時訊息傳送
  - 私人訊息（DM）
  - 頻道訊息
  - 訊息歷史記錄載入
  - 自動滾動至最新訊息

- **使用者介面**
  - Discord 風格的深色主題
  - 響應式設計
  - 頭像顯示系統
  - 右鍵選單禁用

### 🔄 開發中功能
- 語音/視訊通話
- 直播串流
- 檔案上傳
- 表情符號支援
- 通知系統

## 🏗️ 專案結構

```
src/
├── api/           # API 介面
├── assets/        # 靜態資源 (圖片、音效、樣式)
├── components/    # Vue 元件
│   ├── dialogs/   # 對話框元件
│   └── icons/     # 圖標元件
├── composables/   # 組合式函數
├── router/        # 路由配置
├── stores/        # Pinia 狀態管理
├── types/         # TypeScript 型別定義
├── utils/         # 工具函數
└── views/         # 頁面元件
```

## 🛠️ 開發環境設置

### 前置需求
- Node.js >= 18
- pnpm >= 8

### 推薦開發工具
- [VS Code](https://code.visualstudio.com/)
- [Volar 擴充套件](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (需停用 Vetur)

### 安裝依賴

```sh
pnpm install
```

### 開發模式 (熱重載)

```sh
pnpm dev
```

### 編譯生產版本

```sh
pnpm build
```

### 類型檢查

```sh
pnpm type-check
```

### 執行測試

```sh
pnpm test:unit
```

### 代碼檢查與修復

```sh
pnpm lint
```

### 代碼格式化

```sh
pnpm format
```

## 🌐 環境變數

創建 `.env` 檔案並設置以下變數：

```bash
VITE_APP_PORT=3000
VITE_APP_DOMAIN=localhost
VITE_API_DOMAIN=your-api-domain.com
VITE_ONLINE=false  # 設定為 true 使用 HTTPS/WSS
```

## 📱 核心功能說明

### 即時通訊
- 基於 WebSocket 的即時訊息系統
- 支援私人訊息和伺服器頻道
- 自動重連機制
- 訊息分頁載入

### 使用者介面
- 三欄式布局：伺服器列表 | 頻道/好友列表 | 聊天區域
- Discord 風格的深色主題
- 自適應頭像顯示系統
- 流暢的動畫效果

### 狀態管理
- 使用 Pinia 管理應用狀態
- 模組化的 Store 設計
- 響應式資料綁定

## 📄 授權條款

本專案僅供學習和展示用途。
