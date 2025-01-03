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
        v-model:selectedKeys="current"
        :items="menuItems"
        @click="doMenuClick"
      />
    </a-layout-sider>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import { UserOutlined, PictureOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/user'

const loginUserStore = useLoginUserStore()
// 菜单列表
const menuItems = [
  {
    key: '/',
    label: '公共图库',
    icon: () => h(PictureOutlined),
  },
  {
    key: '/my_space',
    label: '我的空间',
    icon: () => h(UserOutlined),
  },
]

const router = useRouter()

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
// 初始化：读取 `localStorage` 中的当前选中菜单
onMounted(() => {
  const savedKey = localStorage.getItem('selectedMenuKey') || '/'
  current.value = [savedKey]
  // 刷新后跳转到保存的页面路径
  if (router.currentRoute.value.path !== savedKey) {
    router.push(savedKey)
  }
})

// 点击菜单项事件：保存到 `localStorage` 并跳转页面
const doMenuClick = ({ key }: { key: string }) => {
  current.value = [key]
  localStorage.setItem('selectedMenuKey', key) // 保存选中状态
  router.push({
    path: key,
  })
}
</script>

<style scoped>

</style>
