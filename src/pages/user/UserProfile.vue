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
          <a-col flex="420px" class="edit-profile-container">
            <a-button type="primary" @click="goToEditProfile">修改资料</a-button>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <div class="profile-header" style="margin-top: 20px">
      <a-card class="profile-card">
        <!-- Tab 栏 -->
        <a-tabs v-model:activeKey="activeTab" class="tab-section" @change="handleTabChange">
          <a-tab-pane key="columns" tab="专栏"></a-tab-pane>
          <a-tab-pane key="info" tab="资料"></a-tab-pane>
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
                      <img style="height: 180px; object-fit: cover" :alt="picture.name" :src="picture.url" />
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


<!--            <a-row gutter="16" class="favorites-list">-->
<!--              <a-col-->
<!--                v-for="item in favorites"-->
<!--                :key="item.pictureId"-->
<!--                xs="24"-->
<!--                sm="12"-->
<!--                md="8"-->
<!--                lg="6"-->
<!--                class="favorite-item"-->
<!--              >-->
<!--                <a-card hoverable>-->
<!--                  <img :src="item.url" alt="图片" class="favorite-img" />-->
<!--                  <div class="favorite-content">-->
<!--                    <h3>{{ item.name }}</h3>-->
<!--                    <p>{{ item.introduction || '暂无简介' }}</p>-->
<!--                    &lt;!&ndash; 渲染分类和标签 &ndash;&gt;-->
<!--                    <div>-->
<!--                      <a-tag :color="getCategoryColor(item.category)" v-if="item.category">-->
<!--                        {{ item.category || '默认分类' }}-->
<!--                      </a-tag>-->
<!--                      <a-tag-->
<!--                        v-for="tag in item.tags"-->
<!--                        :key="tag"-->
<!--                        :color="getTagColor(tag)"-->
<!--                      >-->
<!--                        {{ tag }}-->
<!--                      </a-tag>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </a-card>-->
<!--              </a-col>-->
<!--            </a-row>-->
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

const userInfo = ref({
  avatar: '',
  nickname: '',
  profile: '',
})
const activeTab = ref('favorites') // 默认选中收藏
const favorites = ref([])
const pagination = ref({
  total: 0,
  pageNum: 1,
  pageSize: 4,
})


// 获取收藏数据
const fetchFavorites = async () => {
  try {
    const params = {
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize,
    };
    const res = await favoriteListUsingPost(params);
    if (res.data.code === 200) {
      favorites.value = res.data.data.records ?? [];
      pagination.value.total = res.data.data.total ?? 0;
    } else {
      message.error('获取收藏数据失败：' + res.data.message);
    }
  } catch (error) {
    console.error('获取收藏数据失败：', error);
    message.error('系统异常，请稍后再试');
  }
};


const handlePageChange = (page: number) => {
  pagination.value.pageNum = page
  fetchFavorites()
}

const handlePageSizeChange = (current: number, size: number) => {
  pagination.value.pageSize = size; // 更新每页显示数量
  pagination.value.pageNum = 1; // 重置到第一页
  fetchFavorites(); // 重新请求数据
};

const handleTabChange = (key: string) => {
  activeTab.value = key
  if (key === 'favorites') {
    fetchFavorites()
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
  background: linear-gradient(180deg, #e0f7fa, #4f8ad6);
  min-height: 100vh;
  padding-top: 20px; /* 减小顶部间距 */
}

.profile-header {
  padding: 0;
  text-align: center;
}

.profile-card {
  margin: 0 auto;
  max-width: 900px; /* 宽度调整为更宽 */
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
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
  margin-top: 20px;
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
</style>
