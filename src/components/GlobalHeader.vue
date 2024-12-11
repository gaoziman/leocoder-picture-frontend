<template>
  <a-row :wrap="false">
    <a-col flex="200px">
      <RouterLink to="/">
        <div class="title-bar">
          <img class="logo" src="../assets/logo.png" alt="logo" />
          <div class="title"> 智存协作云图库 </div>
        </div>
      </RouterLink>
    </a-col>
    <a-col flex="auto">
      <a-menu
        v-model:selectedKeys="current"
        mode="horizontal"
        :items="items"
        @click="doMenuClick"
      />
    </a-col>
    <a-col flex="120px">
      <div v-if="loginUserStore.loginUser.id">
        <a-dropdown>
          <ASpace>
            <a-avatar :src="loginUserStore.loginUser.userAvatar" />
            {{ loginUserStore.loginUser.userName ?? '无名' }}
          </ASpace>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="doLogout">
                <LogoutOutlined />
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { AppstoreOutlined, UserOutlined, GlobalOutlined,LogoutOutlined } from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/user'
import { userLogoutUsingPost } from '@/api/dengluguanli.ts'

const loginUserStore = useLoginUserStore()
const current = ref<string[]>(['home'])
const originItems = [
  {
    key: '/',
    icon: () => h(AppstoreOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManage',
    icon: () => h(UserOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: 'others',
    icon: () => h(GlobalOutlined),
    label: h(
      'a',
      { href: 'https://gaoziman.github.io/toLeoJavaer/', target: '_blank' },
      '知识导航',
    ),
    title: '知识导航',
  },
]


// 过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    if (menu.key.startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== "admin") {
        return false
      }
    }
    return true
  })
}

// 展示在菜单的路由数组
const items = computed<MenuProps['items']>(() => filterMenus(originItems))


const router = useRouter()

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({
    path: key,
  })
}

// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

// 用户注销
const doLogout = async () =>{
  const res = await userLogoutUsingPost()
  if (res.data.code === 200) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}

</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>
