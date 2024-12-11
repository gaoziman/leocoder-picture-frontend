import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@/access'

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // 注册插件

app.use(Antd)
app.use(pinia)
app.use(router)

app.mount('#app')
