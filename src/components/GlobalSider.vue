<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      class="sider"
      width="200"
      breakpoint="lg"
      collapsed-width="0"
    >
      <a-menu
        mode="inline"
        v-model:selectedKeys="currentLeftMenu"
        :items="menuItems"
        @click="doLeftMenuClick"
      />
    </a-layout-sider>
  </div>
</template>

<script setup lang="ts">
import { h, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/user'

import { createFromIconfontCN } from '@ant-design/icons-vue'
import { SCRIPT_URL } from '@/constants/url.ts'
import { useTabStore } from '@/stores/tab/useTabStore.ts'

const tabStore = useTabStore()

const loginUserStore = useLoginUserStore()

const router = useRouter()

// 当前选中菜单
const current = ref<string[]>([])

// 当前左侧菜单选中项
const currentLeftMenu = ref<string[]>([tabStore.selectedLeftMenu || '/'])

// 菜单列表
const menuItems = [
  {
    key: '/',
    label: '公共图库',
    icon: () => h(IconFont, { type: 'icon-tupianguanli' }),
  },
  {
    key: '/my_space',
    label: '我的空间',
    icon: () => h(IconFont, { type: 'icon-wodekongjian' }),
  },
]

const IconFont = createFromIconfontCN({
  scriptUrl: SCRIPT_URL,
})


// 监听左侧菜单选中状态变化
watch(
  () => tabStore.selectedLeftMenu,
  (newMenu) => {
    if (newMenu) {
      currentLeftMenu.value = [newMenu]
    } else {
      currentLeftMenu.value = []
    }
  }
)


// 监听路由变化，更新当前左侧菜单选中状态
router.afterEach((to) => {
  // 检查路径是否匹配左侧菜单项
  const isLeftMenuItem = menuItems.some(item => item.key === to.path)

  if (isLeftMenuItem) {
    // 如果是左侧菜单项，更新选中状态
    currentLeftMenu.value = [to.path]
    tabStore.setLeftMenu(to.path)  // 更新左侧菜单选中状态
  } else if (tabStore.selectedLeftMenu) {
    // 否则使用存储的值
    currentLeftMenu.value = [tabStore.selectedLeftMenu]
  } else {
    // 清除左侧菜单选中
    currentLeftMenu.value = []
  }
})

// 点击左侧菜单时
const doLeftMenuClick = ({ key }: { key: string }) => {
  currentLeftMenu.value = [key]
  tabStore.setLeftMenu(key) // 更新左侧菜单选中状态
  router.push({ path: key })  // 路由跳转
}
</script>

<style scoped></style>
