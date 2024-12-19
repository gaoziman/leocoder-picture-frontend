<template>
  <a-row :gutter="[16, 16]">
    <!-- 图片展示区 -->
    <a-col :sm="24" :md="16" :xl="18">
      <a-card title="图片预览">
        <!-- 操作区（红色框位置） -->
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
          <!-- 点赞按钮 -->
          <a-button type="link" @click="handleLike" style="display: flex; align-items: center;">
            <component :is="isLiked ? LikeFilled : LikeOutlined" />
            <span style="margin-left: 4px;">{{ likeCount }}</span>
          </a-button>

          <!-- 收藏按钮 -->
          <a-button type="link" style="display: flex; align-items: center;">
            <StarOutlined />
            <span style="margin-left: 4px;">收藏</span>
          </a-button>

          <!-- 分享按钮 -->
          <a-button type="link" style="display: flex; align-items: center;">
            <ShareAltOutlined />
            <span style="margin-left: 4px;">分享</span>
          </a-button>
        </div>
        <!-- 图片内容 -->
        <a-image style="max-height: 600px; object-fit: contain" :src="picture.url" />
      </a-card>
    </a-col>

    <!-- 图片信息区 -->
    <a-col :sm="24" :md="8" :xl="6">
      <a-card title="图片信息">
        <a-descriptions :column="1">
          <a-descriptions-item label="作者">
            <a-space>
              <a-avatar :size="24" :src="picture.user?.userAvatar" />
              <div>{{ picture.user?.userName }}</div>
            </a-space>
          </a-descriptions-item>
          <a-descriptions-item label="名称">
            {{ picture.name ?? '未命名' }}
          </a-descriptions-item>
          <a-descriptions-item label="简介">
            {{ picture.introduction ?? '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="分类">
            <a-tag :color="getCategoryColor(picture.category)">
              {{ picture.category ?? '默认' }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="标签">
            <a-tag v-for="tag in picture.tags" :key="tag" :color="getTagColor(tag)">
              {{ tag }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="格式">
            {{ picture.picFormat ?? '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="宽度">
            {{ picture.picWidth ?? '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="高度">
            {{ picture.picHeight ?? '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="宽高比">
            {{ picture.picScale ?? '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="大小">
            {{ formatSize(picture.picSize) }}
          </a-descriptions-item>
        </a-descriptions>
        <a-space wrap>
          <a-button type="primary" @click="doDownload">
            免费下载
            <template #icon>
              <DownloadOutlined />
            </template>
          </a-button>

          <a-button v-if="canEdit" type="default" @click="doEdit">
            编辑
            <template #icon>
              <EditOutlined />
            </template>
          </a-button>
          <a-button v-if="canEdit" danger @click="doDelete">
            删除
            <template #icon>
              <DeleteOutlined />
            </template>
          </a-button>
        </a-space>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { deletePictureUsingPost, getPictureVoByIdUsingGet } from '@/api/tupianguanli.ts'
import { message } from 'ant-design-vue'
import { DeleteOutlined, EditOutlined, DownloadOutlined,LikeOutlined, LikeFilled,StarOutlined,ShareAltOutlined } from '@ant-design/icons-vue'

import { computed, onMounted, ref } from 'vue'
import { useLoginUserStore } from '@/stores/user'
import router from '@/router'
import { downloadImage, formatSize } from '@/utils'
import { getCategoryColor, getTagColor } from '@/utils/tagColorUtil.ts'
import { cancelLikeUsingPost, likeUsingPost } from '@/api/yonghudianzan.ts'
import { usePictureStore } from '@/stores/picture'
const pictureStore = usePictureStore()
const props = defineProps<{
  id: string | number
}>()

// const picture = ref<API.PictureVO>({})
// const likeCount = ref(0) // 当前图片的点赞数
// const isLiked = ref(false) // 当前用户是否已点赞


onMounted(() => {
  pictureStore.fetchPictureDetail(props.id) // 获取图片详情
})

// 从 Store 中获取当前图片的点赞数据
const picture = computed(() => pictureStore.pictureDetail[props.id] || {})
const likeCount = computed(() => pictureStore.pictureData[props.id]?.likeCount || 0)
const isLiked = computed(() => pictureStore.pictureData[props.id]?.isLiked || false)

// 点赞/取消点赞
const handleLike = () => {
  pictureStore.toggleLike(props.id)
}

// 获取图片详情
// const fetchPictureDetail = async () => {
//   try {
//     const res = await getPictureVoByIdUsingGet({
//       id: props.id,
//     })
//     if (res.data.code === 200 && res.data.data) {
//       picture.value = res.data.data
//       isLiked.value = res.data.data.isLiked; // 初始化是否已点赞
//     } else {
//       message.error('获取图片详情失败，' + res.data.message)
//     }
//   } catch (e: any) {
//     message.error('获取图片详情失败：' + e.message)
//   }
// }

const loginUserStore = useLoginUserStore()
// 是否具有编辑权限
const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser
  // 未登录不可编辑
  if (!loginUser.id) {
    return false
  }
  // 仅本人或管理员可编辑
  const user = picture.value.user || {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})

// 编辑
const doEdit = () => {
  router.push('/add_picture?id=' + picture.value.id)
}
// 删除
const doDelete = async () => {
  const id = picture.value.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 200) {
    message.success('删除成功')
    router.push('/')
  } else {
    message.error('删除失败')
  }
}

// 处理下载
const doDownload = () => {
  downloadImage(picture.value.url)
}

// 点赞/取消点赞处理
// const handleLike = async () => {
//   try {
//     if (isLiked.value) {
//       // 取消点赞
//       const res = await cancelLikeUsingPost({pictureId: picture.value.id })
//       if (res.data.code === 200) {
//         message.success('取消点赞成功')
//         likeCount.value--
//         isLiked.value = false
//       } else {
//         message.error('取消点赞失败')
//       }
//     } else {
//       // 点赞
//       const res = await likeUsingPost({ pictureId: picture.value.id })
//       if (res.data.code === 200) {
//         message.success('点赞成功')
//         likeCount.value++
//         isLiked.value = true
//       } else {
//         message.error('点赞失败')
//       }
//     }
//   } catch (e: any) {
//     message.error('操作失败：' + e.message)
//   }
// }

</script>

<style scoped></style>
