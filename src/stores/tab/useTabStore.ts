import { defineStore } from 'pinia'

export const useTabStore = defineStore('tabStore', {
  state: () => ({
    selectedTab: 'all', // 默认选中的 tab
  }),
  actions: {
    setTab(tab: string) {
      this.selectedTab = tab
    },
  },
  persist: {
    enabled: true, // 启用持久化（需要安装 pinia-plugin-persist 插件）
  },
})
