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
                <h2 class="profile-nickname">{{ userInfo.nickname }}</h2>
                <p class="profile-bio">{{ userInfo.profile || '分享思想，留下痕迹。' }}</p>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useLoginUserStore } from '@/stores/user'

const userInfo = ref({
  avatar: '',
  nickname: '',
  profile: '',
})

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
})

const goToEditProfile = () => {
  window.location.href = '/user/info'
}
</script>

<style scoped>
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
  color: #666666;
  margin-top: 4px;
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
</style>
