// src/stores/tab/tabStore.ts
import { defineStore } from 'pinia'

export const useTabStore = defineStore('tabStore', {
  state: () => ({
    selectedTopMenu: '/',  // 默认选中的顶部菜单
    selectedLeftMenu: '/', // 默认选中的左侧菜单
  }),
  actions: {
    // 设置顶部菜单
    setTopMenu(menu: string) {
      this.selectedTopMenu = menu
      this.selectedLeftMenu = menu // 保证顶部菜单和左侧菜单同步选中
    },
    // 设置左侧菜单
    setLeftMenu(menu: string) {
      this.selectedLeftMenu = menu
      this.selectedTopMenu = menu // 保证顶部菜单和左侧菜单同步选中
    },
  },
  persist: {
    enabled: true, // 启用持久化
  },
})
