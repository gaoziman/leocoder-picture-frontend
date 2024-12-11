import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import ACCESS_ENUM from '@/access/accessEnum.ts'
import NoAuth from '@/pages/404/NoAuth.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: HomePage,
      meta: {
        title: '首页'
      },
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
      meta: {
        title: '用户登录'
      },
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
      meta: {
        title: '用户注册'
      },
    },
    {
      path: '/admin/userManage',
      name: 'adminUserManage',
      component: UserManagePage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
        title : '用户管理'
      },
    },
    {
      path: '/noAuth',
      name: '404',
      component: NoAuth,
    },
  ],
})

export default router
