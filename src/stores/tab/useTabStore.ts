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

      // 如果不是主页(/)，则清除左侧菜单选中状态
      if (menu !== '/' && menu !== '/my_space') {
        this.selectedLeftMenu = ''
      } else if (menu === '/') {
        // 如果是主页，同步选中左侧的公共图库
        this.selectedLeftMenu = '/'
      } else if (menu === '/my_space') {
        // 如果是我的空间，同步选中左侧的我的空间
        this.selectedLeftMenu = '/my_space'
      }
    },
    // 设置左侧菜单
    setLeftMenu(menu: string) {
      this.selectedLeftMenu = menu

      // 当选择左侧菜单时，如果是主页或我的空间，同步顶部菜单
      if (menu === '/' || menu === '/my_space') {
        this.selectedTopMenu = menu
      } else {
        // 其他情况清除顶部菜单选中状态
        this.selectedTopMenu = ''
      }
    },
  },
  persist: {
    enabled: true, // 启用持久化
  },
})
