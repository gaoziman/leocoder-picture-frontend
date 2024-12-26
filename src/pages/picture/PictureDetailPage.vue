<template>
  <a-row :gutter="[16, 16]">
    <!-- 图片展示区 -->
    <a-col :sm="24" :md="16" :xl="18">
      <a-card title="图片预览">
        <!-- 判断是否为待审核状态 -->
        <template v-if="picture.reviewStatus === 0">
          <a-alert
            message="待审核"
            type="warning"
            show-icon
            style="margin-bottom: 16px; width: 200px"
          />
        </template>
        <!-- 操作区（红色框位置） -->
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px">
          <!-- 点赞按钮 -->
          <a-button type="link" @click="handleLike" style="display: flex; align-items: center">
            <component :is="isLiked ? LikeFilled : LikeOutlined" />
            <span style="margin-left: 4px">{{ likeCount }}</span>
          </a-button>

          <!-- 收藏按钮 -->
          <a-button type="link" @click="handleFavorite" style="display: flex; align-items: center">
            <component :is="isFavorited ? StarFilled : StarOutlined" />
            <span style="margin-left: 4px">{{ favoriteCount }}</span>
          </a-button>
          <!-- 分享按钮 -->
          <a-button
            type="link"
            style="display: flex; align-items: center"
            :disabled="picture.reviewStatus === 0"
            @click="(e) => doShare(picture, e)"
          >
            <ShareAltOutlined />
            <span style="margin-left: 4px">分享</span>
          </a-button>
        </div>
        <!-- 图片内容 -->
        <a-image style="max-height: 600px; object-fit: contain" :src="picture.url" />
      </a-card>
    </a-col>

    <ShareModal ref="shareModalRef" :link="shareLink" />

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
          <a-descriptions-item label="浏览量：">
            <template v-if="picture.reviewStatus === 0"> 图片待审核</template>
            <template v-else> {{ picture.viewCount || 0 }} 次浏览</template>
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

    <a-row :gutter="[16, 16]">
      <a-col :span="24" class="comment-section">
        <div class="comment-input-wrapper">
          <h3>评论 {{ totalComments }}</h3>
          <div class="comment-input-container" ref="commentContainer">
            <!-- 当前登录用户的头像 -->
            <a-avatar :src="loginUserAvatar" size="large" class="user-avatar" />

            <!-- 输入框 -->
            <div class="input-box">
              <!-- 输入文本 -->
              <a-textarea
                v-model:value="commentInput"
                placeholder="我来说两句..."
                :maxLength="1000"
                class="comment-textarea"
                :rows="3"
              />

              <!-- 工具栏 -->
              <div class="input-toolbar">
                <!-- 左侧按钮 -->
                <div class="left-actions">
                  <a-button type="text" class="emoji-button" @click="toggleEmojiPicker">
                    <MehOutlined />
                  </a-button>

                  <a-button type="text" class="upload-button" @click="openImageUploader">
                    <CloudUploadOutlined />
                  </a-button>
                </div>

                <!-- Emoji Picker -->
                <emoji-picker
                  v-if="showEmojiPicker"
                  class="emoji-picker"
                  @emoji-click="addEmoji"
                ></emoji-picker>

                <!-- 右侧统计与按钮 -->
                <div class="right-actions">
                  <span class="char-count">{{ commentInput.length }} / 1000</span>
                  <a-button type="primary" class="submit-button" @click="submitComment">
                    发布
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="comment-list">
          <template v-if="comments.length === 0">
            <div class="no-comments">暂无评论</div>
          </template>
          <template v-else>
            <div>
              <comment-item
                v-for="(comment, index) in comments"
                :key="comment.id"
                :comment="comment"
                :level="0"
                @reply="openReplyModal"
                @like-updated="handleLikeUpdated"
                @commentDeleted="loadComments"
                @delete="handleCommentDelete"
              />
            </div>
          </template>
        </div>
      </a-col>
    </a-row>

    <!-- 回复框 -->
    <a-modal
      v-model:visible="replyModalVisible"
      :title="`回复 ${currentReplyUser}`"
      width="500px"
      centered
      :footer="null"
      @close="closeReplyModal"
    >
      <CommentInput
        :userAvatar="loginUserAvatar"
        :inputValue="parentInputValue"
        @submit="submitReply"
        @input-update="updateInput"
        :resetInput="resetInput"
      />
<!--      <comment-input-->
<!--        :userAvatar="loginUserAvatar"-->
<!--        :inputValue="parentInputValue"-->
<!--        @submit="submitReply"-->
<!--        @input-update="(value) => (parentInputValue.value = value)"-->
<!--      />-->
    </a-modal>
  </a-row>
</template>

<script setup lang="ts">
import ShareModal from '@/components/ShareModal.vue'
// 分享弹窗引用
const shareModalRef = ref<InstanceType<typeof ShareModal> | null>(null)
// 分享链接
const shareLink = ref<string>('')

const doShare = (picture: API.PictureVO, e: Event) => {
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  } else {
    console.error('shareModalRef is not initialized')
  }
}

import { deletePictureUsingPost } from '@/api/tupianguanli.ts'
import { message } from 'ant-design-vue'
import {
  DeleteOutlined,
  EditOutlined,
  CloudUploadOutlined,
  MehOutlined,
  DownloadOutlined,
  LikeOutlined,
  LikeFilled,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
} from '@ant-design/icons-vue'

import 'emoji-picker-element'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useLoginUserStore } from '@/stores/user'
import router from '@/router'
import { downloadImage, formatSize } from '@/utils'
import { getCategoryColor, getTagColor } from '@/utils/tagColorUtil.ts'
import { usePictureStore } from '@/stores/picture'
import { addCommentUsingPost, deleteCommentUsingPost, getCommentPageUsingPost } from '@/api/tupianpinglunguanli.ts'
import CommentItem from '@/components/CommentItem.vue'
import CommentInput from '@/components/CommentInput.vue'

const pictureStore = usePictureStore()

const props = defineProps<{
  id: string | number
}>()

// 主评论框内容
const commentInput = ref('')

// 回复框内容
const replyInput = ref('')

const resetInput = ref(false);

// 回复弹窗可见性
const replyModalVisible = ref(false)

// 当前回复的评论索引
const currentCommentIndex = ref(null)

// 所有评论列表
const comments = ref([])

// 评论总条数
const totalComments = ref(0)

// 展示 Emoji Picker
const showEmojiPicker = ref(false)

// 本地输入框内容
const commentContainer = ref(null)

// 子组件传递的输入值
const parentInputValue = ref('')

// 当前回复的用户名
const currentReplyUser = ref('')

const updateInput = (value) => {
  parentInputValue.value = value
}

const loginUserStore = useLoginUserStore()

const loginUserAvatar = computed(() => loginUserStore.loginUser?.userAvatar || '默认头像链接') // 获取登录用户头像
// 从 Store 中获取当前图片的点赞数据
const picture = computed(() => pictureStore.pictureDetail[props.id] || {})
const likeCount = computed(() => pictureStore.pictureData[props.id]?.likeCount || 0)
const isLiked = computed(() => pictureStore.pictureData[props.id]?.isLiked || false)

// 从 Store 中获取当前图片的收藏数据
const favoriteCount = computed(() => pictureStore.pictureData[props.id]?.favoriteCount || 0)
const isFavorited = computed(() => pictureStore.pictureData[props.id]?.isFavorited || false)


onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
  pictureStore.fetchPictureDetail(props.id) // 获取图片详情
  loadComments()
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})

// 打开或关闭 Emoji Picker
const toggleEmojiPicker = (event) => {
  event.stopPropagation()
  showEmojiPicker.value = !showEmojiPicker.value
}

// 添加 Emoji 到输入框
const addEmoji = (event) => {
  const emoji = event.detail.unicode || event.detail.emoji
  commentInput.value += emoji // 添加 Emoji 到评论框
  showEmojiPicker.value = false // 选择后自动关闭
}

// 全局点击监听器，用于关闭 Emoji Picker
const handleDocumentClick = (event) => {
  // 如果 commentContainer 为空，直接返回
  if (!commentContainer.value) {
    showEmojiPicker.value = false // 确保 Emoji Picker 被关闭
    return
  }

  const isClickInside = commentContainer.value.contains(event.target)
  if (!isClickInside) {
    showEmojiPicker.value = false // 点击空白处关闭
  }
}

// 打开图片上传
const openImageUploader = () => {
  console.log('图片上传打开')
}

const handleCommentDelete = (id) => {
  const deleteFromTree = (comments, id) => {
    return comments.filter((comment) => {
      if (comment.id === id) {
        return false; // 当前评论被移除
      }
      if (comment.children) {
        comment.children = deleteFromTree(comment.children, id); // 递归处理子评论
      }
      return true;
    });
  };

  comments.value = deleteFromTree(comments.value, id); // 更新评论树
};

// 加载评论列表
const loadComments = async () => {
  const res = await getCommentPageUsingPost({
    pageNum: 1,
    pageSize: 10,
    pictureId: props.id,
  })
  if (res.data.code === 200) {
    comments.value = res.data.data.records.map((comment) => ({
      ...comment,
      children:
        comment.children?.map((child) => ({
          ...child,
          children: child.children || [], // 确保嵌套层级存在
          commentCount: comment.commentCount || 0,
        })) || [],
    }))
    // 计算总评论数
    totalComments.value = calculateTotalComments(comments.value)
  } else {
    message.error('评论加载失败')
  }
}

const calculateTotalComments = (comments) => {
  if (!comments || comments.length === 0) {
    return 0
  }
  return comments.reduce((total, comment) => {
    return total + 1 + calculateTotalComments(comment.children || [])
  }, 0)
}

// 提交评论
const submitComment = async () => {
  if (!commentInput.value || commentInput.value.trim().length < 4) {
    message.error('回复内容不能少于 4 个字符！')
    return
  }

  // 添加评论
  const res = await addCommentUsingPost({
    pictureId: props.id,
    content: commentInput.value,
    parentId: null,
  })
  if (res.data.code === 200) {
    message.success('回复成功！')
    commentInput.value = ''
    replyModalVisible.value = false
    await loadComments() // 刷新评论列表
  } else {
    message.error('回复失败，请稍后重试！')
  }
}

// 子评论回复
const submitReply = async (content) => {
  if (!content.trim()) {
    console.error('评论内容不能为空！')
    return
  }
  // 添加评论
  const res = await addCommentUsingPost({
    pictureId: props.id,
    content: content,
    parentId: currentCommentIndex.value,
  })
  if (res.data.code === 200) {
    message.success('回复成功！')
    parentInputValue.value = ''
    closeReplyModal(); // 关闭回复框
    await loadComments() // 刷新评论列表
    // location.reload()
  } else {
    message.error('回复失败，请稍后重试！')
  }
}

// 打开回复框
const openReplyModal = (comment) => {
  currentCommentIndex.value = comment.id;
  parentInputValue.value = ''; // 清空子评论框的内容
  currentReplyUser.value = comment.userName;
  replyModalVisible.value = true;
}

// 关闭回复框
const closeReplyModal = () => {
  replyModalVisible.value = false // 隐藏模态框
  currentCommentIndex.value = null; // 重置当前回复的评论索引
}

// 点赞/取消点赞
const handleLike = () => {
  if (picture.value.reviewStatus === 0) {
    message.warning('图片待审核，不能点赞！')
    return
  }
  pictureStore.toggleLike(props.id)
}

// 收藏/取消收藏
const handleFavorite = () => {
  if (picture.value.reviewStatus === 0) {
    message.warning('图片待审核，不能收藏！')
    return
  }
  pictureStore.toggleFavorite(props.id)
}

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
// 删除图片
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

const handleLikeUpdated = (updatedComment) => {
  // 根据 updatedComment.id 更新本地 comments 数据
  const updateCommentTree = (comments) => {
    return comments.map((comment) => {
      if (comment.id === updatedComment.id) {
        return updatedComment
      }
      if (comment.children && comment.children.length > 0) {
        comment.children = updateCommentTree(comment.children)
      }
      return comment
    })
  }

  comments.value = updateCommentTree(comments.value)
}
</script>
<style scoped>
.comment-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-textarea {
  border-radius: 8px;
  //border: 1px solid #d9d9d9;
  font-size: 16px;
  padding: 12px;
  transition: all 0.3s;
}

.comment-textarea:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 5px rgba(24, 144, 255, 0.3);
}

.comment-list {
  width: 1200px;
  margin-top: 20px;
}

.no-comments {
  text-align: center;
  color: #999;
  font-size: 14px;
  margin-top: 20px;
}

.comment-input-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.comment-input-container {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  border: 1px solid #e5e5e5;
  border-radius: 50%;
}

.input-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-textarea {
  border-radius: 8px;
  font-size: 16px;
  padding: 12px;
  border: 1px solid #d9d9d9;
  transition: all 0.3s;
  resize: none;
}

.comment-textarea:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 5px rgba(24, 144, 255, 0.3);
}

.input-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-actions {
  display: flex;
  gap: 10px;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.char-count {
  font-size: 14px;
  color: #999;
}

.submit-button {
  height: 36px;
  border-radius: 8px;
  font-size: 14px;
  padding: 0 16px;
}

.emoji-button,
.upload-button {
  font-size: 18px;
  color: #555;
}

.emoji-button:hover,
.upload-button:hover {
  color: #1890ff;
}

.emoji-picker {
  position: absolute;
  z-index: 1000;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 8px;
}

.comment-input-container {
  position: relative;
}
</style>
