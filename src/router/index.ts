import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import ACCESS_ENUM from '@/access/accessEnum.ts'
import NoAuth from '@/pages/404/NoAuth.vue'
import AddPicturePage from '@/pages/picture/AddPicturePage.vue'
import PictureManagePage from '@/pages/admin/PictureManagePage.vue'
import PictureDetailPage from '@/pages/picture/PictureDetailPage.vue'
import UserProfile from '@/pages/user/UserProfile.vue'
import AddPictureBatchPage from '@/pages/picture/AddPictureBatchPage.vue'
import UserInfo from '@/pages/user/UserInfo.vue'
import CategoryManagePage from '@/pages/category/CategoryManagePage.vue'
import TagManagePage from '@/pages/tag/TagManagePage.vue'
import SpaceManagePage from '@/pages/admin/SpaceManagePage.vue'
import AddSpacePage from '@/pages/space/AddSpacePage.vue'
import MySpacePage from '@/pages/space/MySpacePage.vue'
import SpaceDetailPage from '@/pages/space/SpaceDetailPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: HomePage,
      meta: {
        title: '首页',
      },
    },
    {
      path: '/user/login',
      name: '用户登录',
      component: UserLoginPage,
      meta: {
        title: '用户登录',
      },
    },
    {
      path: '/user/register',
      name: '用户注册',
      component: UserRegisterPage,
      meta: {
        title: '用户注册',
      },
    },
    {
      path: '/admin/userManage',
      name: 'adminUserManage',
      component: UserManagePage,
      meta: {
        access: ACCESS_ENUM.ADMIN,
        title: '用户管理',
      },
    },
    {
      path: '/add_picture',
      name: '创建图片',
      component: AddPicturePage,
      meta: { title: '创建图片' },
    },
    {
      path: '/admin/pictureManage',
      name: '图片管理',
      component: PictureManagePage,
      meta: { title: '图片管理' },
    },
    {
      path: '/admin/categoryManage',
      name: '分类管理',
      component: CategoryManagePage,
      meta: { title: '分类管理' },
    },
    {
      path: '/admin/taqManage',
      name: '标签管理',
      component: TagManagePage,
      meta: { title: '标签管理' },
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: SpaceManagePage,
      meta: { title: '空间管理' }
    },
    {
      path: '/add_space',
      name: '创建空间',
      component: AddSpacePage,
      meta: { title: '创建空间' }
    },
    {
      path: '/my_space',
      name: '我的空间',
      component: MySpacePage,
      meta: { title: '我的空间' }
    },
    {
      path: '/space/:id',
      name: '空间详情',
      component: SpaceDetailPage,
      props: true,
    },

    {
      path: '/picture/:id',
      name: '图片详情',
      component: PictureDetailPage,
      meta: { title: '图片详情' },
      props: true,
    },
    {
      path: '/add_picture/batch',
      name: '批量创建图片',
      component: AddPictureBatchPage,
      meta: { title: '批量创建图片' },
    },
    {
      path: '/user/profile',
      name: 'UserProfile',
      component: UserProfile,
      meta: { title: '个人中心' },
    },
    {
      path: '/user/info',
      name: 'UserInfo',
      component: UserInfo,
      meta: { title: '修改基本信息' },
    },
    {
      path: '/noAuth',
      name: '404',
      component: NoAuth,
    },
  ],
})

export default router
