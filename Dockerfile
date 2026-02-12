# ---------------------------------------------------
# 1. Base Stage: Node 環境
# ---------------------------------------------------
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

# ---------------------------------------------------
# 2. Development Stage: 開發環境
# ---------------------------------------------------
FROM base AS dev

# 開發環境依賴
COPY . .
# Vite 預設 port 5173
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---------------------------------------------------
# 3. Builder Stage: 編譯
# ---------------------------------------------------
FROM base AS builder

# Vite 編譯時需要的環境變數（透過 build args 注入）
ARG VITE_APP_DOMAIN
ARG VITE_API_DOMAIN
ARG VITE_ONLINE=true
ENV VITE_APP_DOMAIN=${VITE_APP_DOMAIN}
ENV VITE_API_DOMAIN=${VITE_API_DOMAIN}
ENV VITE_ONLINE=${VITE_ONLINE}

COPY . .
RUN npm run build

# ---------------------------------------------------
# 4. Production Stage: Nginx 服務靜態檔案
# ---------------------------------------------------
FROM nginx:alpine AS prod

# 複製 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 從 builder 複製編譯後的檔案 (dist)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
