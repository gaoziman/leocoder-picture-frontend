<template>
  <a-row :wrap="false">
    <a-col flex="200px">
      <RouterLink to="/">
        <div class="title-bar">
          <img class="logo" src="../assets/logo1.png" alt="logo" />
          <div class="title">智存协作云图库</div>
        </div>
      </RouterLink>
    </a-col>
    <a-col flex="auto">
      <a-menu
        v-model:selectedKeys="currentTopMenu"
        mode="horizontal"
        :items="items"
        @click="doTopMenuClick"
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
              <a-menu-item @click="goToProfile">
                <icon-font type="icon-yonghu" />
                个人中心
              </a-menu-item>
              <a-menu-item @click="goToMySpace">
                <IconFont type="icon-wodekongjian" />
                我的空间
              </a-menu-item>
              <a-menu-item @click="doLogout">
                <IconFont type="icon-tuichudenglu2" />
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <!-- 未登录状态下显示登录按钮 -->
      <div v-else>
        <a-button type="primary" @click="goToLogin">登录</a-button>
      </div>
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { MenuProps } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/user'
import { userLogoutUsingPost } from '@/api/dengluguanli.ts'
import { SCRIPT_URL } from '@/constants/url.ts'
import { Message } from '@arco-design/web-vue'
import { useTabStore } from '@/stores/tab/useTabStore.ts'

const loginUserStore = useLoginUserStore()
// 展示在菜单的路由数组
const items = computed(() => filterMenus(originItems))

const router = useRouter()

const tabStore = useTabStore()

// 当前顶部菜单选中项
const currentTopMenu = ref<string[]>([tabStore.selectedTopMenu || '/'])

const IconFont = createFromIconfontCN({
  scriptUrl: SCRIPT_URL,
})
const originItems = [
  {
    key: '/',
    label: '主页',
    title: '主页',
    icon: () => h(IconFont, { type: 'icon-zhuye4' }),
  },
  {
    key: '/add_picture',
    label: '创建图片',
    title: '创建图片',
    icon: () => h(IconFont, { type: 'icon-chuangjian' }),
  },
  {
    key: '/admin/userManage',
    label: '用户管理',
    title: '用户管理',
    icon: () => h(IconFont, { type: 'icon-yonghuguanli1' }),
  },
  {
    key: '/admin/pictureManage',
    label: '图片管理',
    title: '图片管理',
    icon: () => h(IconFont, { type: 'icon-tupian1' }),
  },
  {
    key: '/admin/categoryManage',
    label: '分类管理',
    title: '分类管理',
    icon: () => h(IconFont, { type: 'icon-fenlei' }),
  },
  {
    key: '/admin/taqManage',
    label: '标签管理',
    title: '标签管理',
    icon: () => h(IconFont, { type: 'icon-tag' }),
  },
  {
    key: '/admin/spaceManage',
    label: '空间管理',
    title: '空间管理',
    icon: () => h(IconFont, { type: 'icon-kongjianguanli1' }),
  },
  {
    key: 'others',
    icon: () => h(IconFont, { type: 'icon-icon_zhishiku' }),
    label: h('a', { href: 'https:/www.leocoder.cn/', target: '_blank' }, '知识导航'),
    title: '知识导航',
  },
]

const goToLogin = () => {
  router.push('/user/login') // 跳转到登录页面的路由
}

// 过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    if (menu.key.startsWith('/admin')) {
      const loginUser = loginUserStore.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
    }
    return true
  })
}

// 监听顶部菜单变化
watch(
  () => tabStore.selectedTopMenu,
  (newMenu) => {
    if (newMenu) {
      currentTopMenu.value = [newMenu]
    } else {
      // 当 selectedTopMenu 为空时，清除选中状态
      currentTopMenu.value = []
    }
  },
)

// 在顶部菜单点击时同步更新选中状态
const doTopMenuClick = ({ key }: { key: string }) => {
  currentTopMenu.value = [key]
  tabStore.setTopMenu(key) // 更新菜单选中状态
  router.push({ path: key })
}

// 路由变化监听器 - 修改这个以响应路由变化
router.afterEach((to) => {
  // 检查当前路径是否与左侧菜单匹配
  if (to.path === '/' || to.path === '/my_space') {
    // 如果匹配左侧菜单项，同步更新顶部菜单
    currentTopMenu.value = [to.path]
  } else if (tabStore.selectedTopMenu && tabStore.selectedTopMenu !== '') {
    // 否则使用存储的顶部菜单（确保不是空字符串）
    currentTopMenu.value = [tabStore.selectedTopMenu]
  } else {
    // 清除顶部菜单选中
    currentTopMenu.value = []
  }
})

// 用户注销
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.data.code === 200) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    Message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    Message.error('退出登录失败，' + res.data.message)
  }
}

// 跳转到个人中心页面
const goToProfile = () => {
  router.push('/user/profile') // 跳转到个人中心页面
}

// 跳转到我的空间页面
const goToMySpace = () => {
  router.push('/my_space') // 跳转到我的空间页面
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
  height: 38px;
}
</style>
