import '@unocss/reset/tailwind.css'
import './assets/main.css'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
// bootstrap icon
import 'bootstrap-icons/font/bootstrap-icons.css'
import { globalFunctionsPlugin } from './plugins/global-functions';

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 註冊全域函數插件
// app.use(globalFunctionsPlugin);

globalFunctionsPlugin(app);

app.mount('#app')
