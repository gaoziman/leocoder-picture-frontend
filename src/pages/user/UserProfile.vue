<template>
  <div class="profile-page">
    <!-- 背景部分 -->
    <div class="profile-header">
      <a-card class="profile-card">
        <a-row gutter="20" align="middle">
          <!-- 左侧用户信息 -->
          <a-col flex="auto">
            <a-row gutter="20">
              <a-col>
                <a-avatar :size="100" :src="userInfo.avatar" />
              </a-col>
              <a-col>
                <div class="profile-info">
                  <h2 class="profile-nickname">{{ userInfo.nickname }}</h2>
                  <p class="profile-bio">{{ userInfo.profile || '分享思想，留下痕迹。' }}</p>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <!-- 积分等信息 -->
        <a-row class="profile-stats" align="middle" justify="start" gutter="16">
          <a-col v-for="(stat, index) in stats" :key="index" class="stat-wrapper">
            <div class="stat-item">
              <span class="stat-label">{{ stat.label }}</span>
              <span class="stat-value">{{ stat.value }}</span>
            </div>
            <!-- 竖线分隔符 -->
            <span v-if="index < stats.length - 1" class="divider">|</span>
          </a-col>
          <!-- 右侧修改资料按钮 -->
          <a-col class="edit-profile-container" style="text-align: right; flex: auto">
            <a-button type="primary" @click="goToEditProfile">修改资料</a-button>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <div class="profile-header">
      <a-card class="profile-card2">
        <!-- Tab 栏 -->
        <a-tabs v-model:activeKey="activeTab" class="tab-section" @change="handleTabChange">
          <a-tab-pane key="userPictures" tab="发布">
            <!-- 自己上传的图片 -->
            <a-list
              :grid="{ gutter: 24, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4 }"
              :data-source="userPictures"
            >
              <template #renderItem="{ item: picture }">
                <a-list-item style="padding: 0">
                  <!-- 单张图片 -->
                  <a-card hoverable @click="doClickPicture(picture.id)">
                    <template #cover>
                      <img
                        style="height: 180px; object-fit: cover"
                        :alt="picture.name"
                        :src="picture.url"
                      />
                    </template>
                    <a-card-meta :title="picture.name">
                      <template #description>
                        <a-flex>
                          <a-tag :color="getCategoryColor(picture.category)">
                            {{ picture.category ?? '默认' }}
                          </a-tag>
                          <a-tag v-for="tag in picture.tags" :key="tag" :color="getTagColor(tag)">
                            {{ tag }}
                          </a-tag>
                        </a-flex>
                      </template>
                    </a-card-meta>
                  </a-card>
                </a-list-item>
              </template>
            </a-list>
            <!-- 分页 -->
            <a-pagination
              :total="userPagination.total"
              :current="userPagination.pageNum"
              :pageSize="userPagination.pageSize"
              @change="handlePageChange"
              @showSizeChange="handlePageSizeChange"
              showSizeChanger
              class="pagination"
            />
          </a-tab-pane>
          <a-tab-pane key="info" tab="资料">
            <div class="profile-info-section">
              <a-row justify="space-between" align="middle" class="info-header">
                <!-- 左侧基本信息标题 -->
                <a-col>
                  <h3 class="info-title">基本信息</h3>
                </a-col>
                <!-- 右侧编辑按钮 -->
                <a-col>
                  <a-button class="edit-button" @click="goToEditProfile">
                    <icon-font type="icon-km-edit" />
                    编辑
                  </a-button>
                </a-col>
              </a-row>
              <!-- 信息内容 -->
              <a-card class="info-card">
                <a-row :gutter="[16, 16]">
                  <a-col :span="12" v-for="item in infoItems" :key="item.label">
                    <div class="info-item">
                      <div class="info-label">{{ item.label }}</div>
                      <div class="info-value">{{ item.value }}</div>
                    </div>
                  </a-col>
                </a-row>
              </a-card>
            </div>
          </a-tab-pane>
          <a-tab-pane key="favorites" tab="收藏">
            <!-- 收藏页面 -->
            <a-list
              :grid="{ gutter: 24, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4 }"
              :data-source="favorites"
            >
              <template #renderItem="{ item: picture }">
                <a-list-item style="padding: 0">
                  <!-- 单张图片 -->
                  <a-card hoverable @click="doClickPicture(picture.pictureId)">
                    <template #cover>
                      <img
                        style="height: 180px; object-fit: cover"
                        :alt="picture.name"
                        :src="picture.url"
                      />
                    </template>
                    <a-card-meta :title="picture.name">
                      <template #description>
                        <a-flex>
                          <a-tag :color="getCategoryColor(picture.category)">
                            {{ picture.category ?? '默认' }}
                          </a-tag>
                          <a-tag v-for="tag in picture.tags" :key="tag" :color="getTagColor(tag)">
                            {{ tag }}
                          </a-tag>
                        </a-flex>
                      </template>
                    </a-card-meta>
                  </a-card>
                </a-list-item>
              </template>
            </a-list>
            <!-- 分页 -->
            <a-pagination
              :total="pagination.total"
              :current="pagination.pageNum"
              :pageSize="pagination.pageSize"
              @change="handlePageChange"
              @showSizeChange="handlePageSizeChange"
              showSizeChanger
              class="pagination"
            />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useLoginUserStore } from '@/stores/user'
import { favoriteListUsingPost } from '@/api/yonghushoucang.ts'
import { message } from 'ant-design-vue'
import { getCategoryColor, getTagColor } from '@/utils/tagColorUtil.ts'
import { useRouter } from 'vue-router'
import { listPictureVoByUserUsingPost } from '@/api/tupianguanli.ts'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { SCRIPT_URL } from '@/constants/url.ts'

const IconFont = createFromIconfontCN({
  scriptUrl: SCRIPT_URL,
})

const userInfo = ref({
  avatar: '',
  nickname: '',
  profile: '',
})
const activeTab = ref('userPictures') // 默认选中收藏
const favorites = ref([])
const userPictures = ref([])
const pagination = ref({
  total: 0,
  pageNum: 1,
  pageSize: 12,
})

const userPagination = ref({
  total: 0,
  pageNum: 1,
  pageSize: 8,
})

// 获取收藏数据
const fetchFavorites = async () => {
  try {
    const params = {
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize,
    }
    const res = await favoriteListUsingPost(params)
    if (res.data.code === 200) {
      console.log(res.data.data)
      favorites.value = res.data.data.records ?? []
      pagination.value.total = Number(res.data.data.total) ?? 0 // 确保是数字;
    } else {
      message.error('获取收藏数据失败：' + res.data.message)
    }
  } catch (error) {
    message.error('系统异常，请稍后再试')
  }
}

// 获取用户上传的图片
const fetchUserPictures = async () => {
  try {
    const params = {
      pageNum: userPagination.value.pageNum,
      pageSize: userPagination.value.pageSize,
    }
    const res = await listPictureVoByUserUsingPost(params)
    if (res.data.code === 200) {
      userPictures.value = res.data.data.records ?? []
      userPagination.value.total = Number(res.data.data.total) ?? 0 // 确保是数字;
    } else {
      message.error('获取已发布图片数据失败：' + res.data.message)
    }
  } catch (error) {
    message.error('系统异常，请稍后再试')
  }
}

// 切换页码
const handlePageChange = (page: number) => {
  if (activeTab.value === 'favorites') {
    pagination.value.pageNum = page
    fetchFavorites()
  } else if (activeTab.value === 'userPictures') {
    userPagination.value.pageNum = page
    fetchUserPictures()
  }
}

// 切换每页显示数量
const handlePageSizeChange = (current: number, size: number) => {
  if (activeTab.value === 'favorites') {
    pagination.value.pageSize = size // 更新每页显示数量
    pagination.value.pageNum = 1 // 重置到第一页e
    fetchFavorites() // 重新请求数据
  } else if (activeTab.value === 'userPictures') {
    userPagination.value.pageSize = size
    userPagination.value.pageNum = 1 // 重置到第一页e
    fetchUserPictures()
  }
}

const handleTabChange = (key: string) => {
  activeTab.value = key
  if (key === 'favorites') {
    fetchFavorites()
  } else if (key === 'userPictures') {
    fetchUserPictures()
  }
}
const router = useRouter()

// 跳转至图片详情
const doClickPicture = (pictureId: string) => {
  router.push({
    path: `/picture/${pictureId}`,
  })
}

const stats = ref([
  { label: '积分', value: 1 },
  { label: '获赞', value: 999 },
  { label: '关注', value: 999 },
  { label: '粉丝', value: 999 },
])

// 用户的基本信息
const infoItems = ref([
  { label: '用户名', value: '程序员Leo' },
  { label: '简介', value: '分享思想，留下痕迹。' },
  { label: '手机', value: '199****3394' },
  { label: '邮箱', value: '暂无' },
  { label: '地区', value: '北京市' },
  { label: '会员编号', value: '12644' },
])

const loginUserStore = useLoginUserStore()

onMounted(() => {
  userInfo.value = {
    avatar: loginUserStore.loginUser.userAvatar,
    nickname: loginUserStore.loginUser.userName,
    profile: loginUserStore.loginUser.userProfile,
  }

  stats.value = [
    { label: '积分', value: loginUserStore.loginUser.points || 999 },
    { label: '获赞', value: loginUserStore.loginUser.likes || 999 },
    { label: '关注', value: loginUserStore.loginUser.following || 999 },
    { label: '粉丝', value: loginUserStore.loginUser.followers || 999 },
  ]

  fetchFavorites()
  fetchUserPictures()
})

const goToEditProfile = () => {
  window.location.href = '/user/info'
}
</script>

<style scoped>
.profile-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 始终左对齐 */
  justify-content: flex-start;
  width: 100%; /* 占据父容器的全部宽度 */
}

.profile-nickname {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 4px;
  white-space: nowrap; /* 防止用户名换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
}

.profile-bio {
  font-size: 14px;
  color: #666666;
  margin-top: 4px;
  word-break: break-word; /* 简介自动换行 */
}

.profile-page {
  width: 100%; /* 确保页面内容占满全宽 */
  min-height: 100vh;
  //background: linear-gradient(to bottom, #87cefa, #e0e7f7); /* 渐变背景 */
  padding: 0; /* 移除多余的填充 */
  margin: 0; /* 移除默认边距 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-header {
  width: 100%;
  padding: 0; /* 移除填充 */
  margin: 0 auto;
}

.profile-card,
.profile-card2 {
  width: 100%; /* 让卡片宽度自适应父容器 */
  max-width: none; /* 移除最大宽度限制 */
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

a-card {
  height: auto; /* 动态适应内容高度 */
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.profile-nickname {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 4px;
}

.profile-bio {
  font-size: 14px;
  color: #aaaaaa; /* 更浅的灰色 */
  margin-top: 4px;
  word-break: break-word; /* 简介自动换行 */
}

.profile-stats {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 靠左对齐 */
}

.stat-wrapper {
  display: flex;
  align-items: center;
}

.stat-item {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.stat-label {
  margin-right: 6px;
  font-weight: normal;
  color: #888;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
}

.divider {
  margin: 0 8px;
  color: #ccc;
  font-size: 14px;
}

.edit-profile-container {
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.pagination {
  margin-top: 16px;
  text-align: center;
}

a-card {
  height: auto; /* 动态适应内容高度 */
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-info-section {
  max-width: 100%;
  margin: 20px auto;
  height: 550px;
  padding: 0; /* 移除多余填充 */
}

.info-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.info-card {
  background: #f9f9f9;
  border: none;
  padding: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.edit-button {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
