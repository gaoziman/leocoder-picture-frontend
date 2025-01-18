import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 80, // 如果你需要修改端口，可以直接在这里设置
    host: '0.0.0.0', // 确保外部可以访问
    open: 'http://myserver.coder',
    proxy: {
      '/api': process.env.VITE_API_URL || 'http://myserver.coder:18888', // 使用环境变量来设置代理地址
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
