import { Message } from '@arco-design/web-vue'
import { refreshCacheUsingPost } from '@/api/tupianguanli.ts'
import { defineStore } from 'pinia'

export const useCacheStore = defineStore('cacheStore', () => {
  async function refreshCacheList(searchParams: any) {
    try {
      // 深拷贝参数，避免响应式问题
      const params = JSON.parse(JSON.stringify(searchParams))
      const res = await refreshCacheUsingPost(params)
      if (res.data.code === 200) {
        return true
      } else {
        Message.error(`刷新缓存失败：${res.data.message || '未知错误'}`)
        return false
      }
    } catch (error) {
      console.error('刷新缓存异常:', error) // 调试输出
      Message.error('刷新缓存失败，请重试')
      return false
    }
  }

  return { refreshCacheList }
})
