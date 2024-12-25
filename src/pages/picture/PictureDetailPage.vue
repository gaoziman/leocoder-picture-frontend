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

    <!--    <a-row :gutter="[16, 16]">
          &lt;!&ndash; 评论区 &ndash;&gt;
          <a-col :sm="24" :md="16" :xl="18" class="comment-section">
            <h3>发表评论</h3>
            <div class="comment-input-wrapper">
              <a-textarea
                v-model:value="commentInput"
                placeholder="我来说两句..."
                :maxLength="1000"
                :rows="5"
                showCount
                class="comment-textarea"
              />
              <a-button
                type="primary"
                class="comment-submit-button"
                @click="submitComment"
              >
                发布
              </a-button>
            </div>

            <div class="comment-list">
              <h3>评论 ({{ comments.length }} 条)</h3>
              <template v-if="comments.length === 0">
                <div class="no-comments">暂无评论</div>
              </template>
              <template v-else>
                <a-list bordered>
                  <a-list-item v-for="(comment, index) in comments" :key="index">
                    <a-list-item-meta
                      :avatar="comment.avatar || 'https://via.placeholder.com/40'"
                      :title="comment.user"
                      :description="comment.time"
                    />
                    <div>{{ comment.content }}</div>
                  </a-list-item>
                </a-list>
              </template>
            </div>
          </a-col>
        </a-row>-->

    <a-row :gutter="[16, 16]">
      <a-col :span="24" class="comment-section">
        <h3>发表评论</h3>
        <div class="comment-input-wrapper">
          <a-textarea
            v-model:value="commentInput"
            placeholder="我来说两句..."
            :maxLength="1000"
            :rows="5"
            showCount
            class="comment-textarea"
          />
          <a-button type="primary" class="comment-submit-button" @click="submitComment">
            发布
          </a-button>
        </div>

        <div class="comment-list">
          <h3>评论 ({{ comments.length }} 条)</h3>
          <template v-if="comments.length === 0">
            <div class="no-comments">暂无评论</div>
          </template>
          <template v-else>
            <a-list bordered>
              <a-list-item v-for="comment in comments" :key="comment.id">
                <!-- 主评论 -->
                <div>
                  <div style="display: flex; align-items: center">
                    <!-- 头像 -->
                    <a-avatar
                      :src="comment.userAvatar || 'https://via.placeholder.com/40'"
                      size="large"
                    />
                    <div style="margin-left: 12px">
                      <strong>{{ comment.userName }}</strong>
                    </div>
                  </div>
                  <p style="margin-left: 48px; margin-top: 8px">{{ comment.content }}</p>
                  <div
                    style="display: flex; align-items: center; margin-left: 48px; margin-top: 8px"
                  >
                    <span style="margin-left: 12px; color: #999; font-size: 12px">{{
                      formatDate(comment.createTime)
                    }}</span>
                    <a-button type="text" @click="likeComment(comment.id)">
                      <component :is="comment.liked ? LikeFilled : LikeOutlined" />
                      {{ comment.likeCount }}
                    </a-button>
                    <a-button type="text" @click="openReplyModal(comment.id)">
                      <MessageOutlined />
                      回复
                    </a-button>
                  </div>
                </div>
                <!-- 子评论 -->
                <template v-if="comment.children && comment.children.length > 0">
                  <div style="margin-left: 48px; margin-top: 16px">
                    <a-list bordered>
                      <a-list-item v-for="child in comment.children" :key="child.id">
                        <div style="display: flex; align-items: center">
                          <a-avatar
                            :src="child.userAvatar || 'https://via.placeholder.com/40'"
                            size="small"
                          />
                          <div style="margin-left: 12px">
                            <strong>{{ child.userName }}</strong>
                          </div>
                        </div>
                        <p style="margin-left: 48px; margin-top: 8px">{{ child.content }}</p>
                        <div
                          style="
                            display: flex;
                            align-items: center;
                            margin-left: 48px;
                            margin-top: 8px;
                          "
                        >
                          <span style="margin-left: 12px; color: #999; font-size: 12px">{{
                            formatDate(child.createTime)
                          }}</span>
                          <a-button type="text" @click="likeComment(child.id)">
                            <component :is="child.liked ? LikeFilled : LikeOutlined" />
                            {{ child.likeCount }}
                          </a-button>
                          <a-button type="text" @click="openReplyModal(child.id)">
                            <MessageOutlined />
                            回复
                          </a-button>
                        </div>
                      </a-list-item>
                    </a-list>
                  </div>
                </template>
              </a-list-item>
            </a-list>
          </template>
        </div>
      </a-col>
    </a-row>

    <!-- 回复框 -->
    <a-modal
      v-model:visible="replyModalVisible"
      title="回复评论"
      width="500px"
      centered
      :footer="null"
      @cancel="closeReplyModal"
    >
      <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px">
        <a-textarea
          v-model:value="replyInput"
          placeholder="请输入回复内容..."
          :maxLength="500"
          :rows="4"
          showCount
          style="border-radius: 8px"
        />
        <a-button
          type="primary"
          block
          @click="submitReply"
          style="border-radius: 8px; height: 40px; font-size: 16px"
        >
          提交回复
        </a-button>
      </div>
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
  DownloadOutlined,
  LikeOutlined,
  LikeFilled,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  MessageOutlined,
} from '@ant-design/icons-vue'

import { computed, onMounted, ref } from 'vue'
import { useLoginUserStore } from '@/stores/user'
import router from '@/router'
import { downloadImage, formatSize } from '@/utils'
import { getCategoryColor, getTagColor } from '@/utils/tagColorUtil.ts'
import { usePictureStore } from '@/stores/picture'
import { addCommentUsingPost, getCommentPageUsingPost } from '@/api/tupianpinglunguanli.ts'
import { formatDate } from 'compatx'

const pictureStore = usePictureStore()

const props = defineProps<{
  id: string | number
}>()

const commentInput = ref('') // 主评论框内容
const replyInput = ref('') // 回复框内容
const replyModalVisible = ref(false) // 回复弹窗可见性
const currentCommentIndex = ref(null) // 当前回复的评论索引

const comments = ref([
  // {
  //   user: 'LonePlayer',
  //   avatar: 'https://via.placeholder.com/40',
  //   time: '4个月前',
  //   content: '老板想自己开个公众号，被我_________',
  //   likes: 13,
  //   replies: [],
  // },
  // {
  //   user: 'leocoder',
  //   avatar: 'https://via.placeholder.com/40',
  //   time: '4个月前',
  //   content: '遇到问题解决问题，不知道为什么现在总是劝人知难而退绕一大圈。 看来过来人的建议也不一定都是对的，过来人总是想你把他们走过的路重新走一遍，然后再尝试新的东西。',
  //   likes: 13,
  //   replies: [],
  // },
])

onMounted(() => {
  pictureStore.fetchPictureDetail(props.id) // 获取图片详情
  loadComments()
})

// 加载评论列表
const loadComments = async () => {
  const res = await getCommentPageUsingPost({ pageNum: 1, pageSize: 10, pictureId: props.id }) // 请求评论接口
  console.log('res:' + JSON.stringify(res.data))
  if (res.data.code === 200) {
    comments.value = res.data.data.records || []
  } else {
    message.error('评论加载失败')
  }
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
    parentId: currentCommentIndex.value,
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

// 添加子评论
const submitReply = async () => {
  if (!replyInput.value || replyInput.value.trim().length < 4) {
    message.error('回复内容不能少于 4 个字符！')
    return
  }
  // 添加评论
  const res = await addCommentUsingPost({
    pictureId: props.id,
    content: replyInput.value,
    parentId: currentCommentIndex.value,
  })
  if (res.data.code === 200) {
    message.success('回复成功！')
    replyInput.value = ''
    replyModalVisible.value = false
    await loadComments() // 刷新评论列表
  } else {
    message.error('回复失败，请稍后重试！')
  }
}


// 点赞评论
const likeComment = (index) => {
  comments.value[index].likes += 1
  message.success('点赞成功！')
}

// 打开回复框
const openReplyModal = (index) => {
  currentCommentIndex.value = index
  replyModalVisible.value = true
}

// 关闭回复框
const closeReplyModal = () => {
  replyInput.value = ''
  replyModalVisible.value = false
}

// 从 Store 中获取当前图片的点赞数据
const picture = computed(() => pictureStore.pictureDetail[props.id] || {})
const likeCount = computed(() => pictureStore.pictureData[props.id]?.likeCount || 0)
const isLiked = computed(() => pictureStore.pictureData[props.id]?.isLiked || false)

// 从 Store 中获取当前图片的收藏数据
const favoriteCount = computed(() => pictureStore.pictureData[props.id]?.favoriteCount || 0)
const isFavorited = computed(() => pictureStore.pictureData[props.id]?.isFavorited || false)

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

.comment-submit-button {
  align-self: flex-end;
  width: 100px;
  height: 40px;
  border-radius: 8px;
  background-color: #1890ff;
  color: white;
  font-size: 16px;
}

.comment-submit-button:disabled {
  background-color: #d9d9d9;
  color: #ffffff;
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
</style>
