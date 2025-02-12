import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@/access'

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import { Message } from '@arco-design/web-vue';
import VueCropper from 'vue-cropper';
import 'vue-cropper/dist/index.css'
import 'ant-design-vue/dist/reset.css'
import '@arco-design/web-vue/dist/arco.css'; // 确保引入 Arco 样式



const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate) // 注册插件

app.use(Antd)
app.use(pinia)
app.use(router)
app.use(VueCropper)

app.mount('#app')

// Message 直接使用，不需要绑定到全局属性
export { Message };
