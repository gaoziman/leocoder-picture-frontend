<template>
  <div
    :style="{
      marginLeft: level === 0 ? '0px' : '20px',
      marginBottom: '16px',
    }"
    class="comment-item"
  >
    <!-- 评论信息展示 -->
    <div style="display: flex; align-items: flex-start; gap: 12px; position: relative; min-height: 60px;">
      <a-avatar :src="comment.userAvatar" size="large" />
      <div style="flex: 1;">
        <!-- 评论内容 -->
        <div v-if="level === 0">
          <strong style="font-size: 15px; color: #262626;">{{ comment.userName }}</strong>
          <span v-if="comment.author" class="author-tag">作者</span>
          <div style="margin-top: 4px; font-size: 15px; color: #262626; line-height: 1.5">
            {{ comment.content }}
          </div>
        </div>
        <div v-else>
          <div style="display: flex; align-items: baseline; gap: 8px">
            <span style="font-size: 15px; color: #262626;">
              {{ comment.userName }}
              <span v-if="comment.author" class="author-tag">作者</span>
            </span>
            <span style="font-size: 14px; color: #262626;">
              回复 <span>{{ comment.parentUserName }} :</span>
              <span style="margin-top: 4px; font-size: 15px; color: #262626; line-height: 1.5">{{ comment.content }}</span>
            </span>
          </div>
        </div>
        <!-- 操作按钮 -->
        <div style="display: flex; align-items: center; gap: 16px; margin-top: 8px">
          <span style="font-size: 12px; color: #999">
            {{ formatTime(comment.createTime) }}
          </span>
          <a-button type="text" @click="toggleLike" style="padding: 0; height: auto">
            <component :is="comment.liked ? LikeFilled : LikeOutlined" />
            <span style="margin-left: 4px">{{ comment.likeCount }}</span>
          </a-button>
          <!-- 父评论操作逻辑 -->
          <a-button
            v-if="level === 0"
            type="text"
            @click="replyToComment"
            style="padding: 0; height: auto"
          >
            <MessageOutlined />
            {{ calculateCommentCount(comment) > 0 ? calculateCommentCount(comment) : '评论' }}
          </a-button>
          <!-- 一级子评论操作逻辑 -->
          <a-button
            v-if="level === 1"
            type="text"
            @click="replyToComment"
          >
            <MessageOutlined />
            回复
          </a-button>
        </div>
      </div>

      <!-- 热评徽章 -->
      <div v-if="comment.likeCount > 5" class="hot-badge">热评</div>

      <!-- 更多按钮 -->
      <a-dropdown>
        <a-button type="text" class="more-options-btn">
          <EllipsisOutlined />
        </a-button>
        <template #overlay>
          <a-menu>
            <!-- 如果是当前用户，显示删除 -->
            <a-menu-item v-if="isOwner" @click="deleteComment">
              删除
            </a-menu-item>
            <!-- 如果不是当前用户，显示举报 -->
            <a-menu-item v-else @click="reportComment">
              举报
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <!-- 子评论列表 -->
    <div v-if="comment.children?.length > 0" class="child-comments">
      <comment-item
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        :level="level + 1"
        @reply="$emit('reply', $event)"
        @like-updated="$emit('like-updated', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { LikeFilled, MessageOutlined,LikeOutlined,EllipsisOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { deleteCommentUsingPost, toggleLikeUsingPost } from '@/api/tupianpinglunguanli.ts'
import { computed } from 'vue'
import { useLoginUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const emit = defineEmits(['reply', 'like-updated','delete']);
const props = defineProps({
  comment: Object,
  level: Number,
});

// 父评论操作逻辑
const replyToComment = () => {
  emit('reply', {
    id: props.comment.id, // 当前评论的 ID
    parentId: props.level === 0 ? null : props.comment.id, // 父评论的 ID
    userName: props.comment.userName, // 当前评论的用户名
    level: props.level, // 评论层级
  });
};

const loginUserStore = useLoginUserStore()

// 是否是当前用户的评论
const isOwner = computed(() => props.comment.userId === loginUserStore.loginUser.id);

// 删除评论
const deleteComment = async () => {
  const  id =  props.comment.id
    if (!id) {
      return
    }
    const res = await deleteCommentUsingPost({ id })
    if (res.data.code === 200) {
      message.success('删除成功')
      // 执行删除操作后触发事件
      emit('commentDeleted');
      emit('delete', props.comment.id); // 通知父组件删除成功
    } else {
      message.error('删除失败')
    }
};

// 举报评论
const reportComment = () => {
  emit('report', props.comment.id);
};

const formatTime = (time) => {
  return dayjs(time).fromNow();
};
const calculateCommentCount = (comment) => {
  if (!comment.children || comment.children.length === 0) {
    return 0; // 没有子评论
  }

  let count = comment.children.length;
  comment.children.forEach((child) => {
    count += calculateCommentCount(child); // 递归计算子评论数量
  });

  return count;
};
const toggleLike = async () => {
  try {
    // 更新后端
    const newLikedStatus = !props.comment.liked;
    // 判断当前状态，计算需要传递的 `isLiked` 值
    const isLiked = !props.comment.liked; // 当前状态取反
    const delta = newLikedStatus ? 1 : -1;

    const res = await toggleLikeUsingPost({
      pictureId: props.comment.id,
      likeType: 1, // 评论点赞类型
      delta,
      isLiked
    });

    // 本地更新状态
    props.comment.liked = newLikedStatus;
    props.comment.likeCount += delta;

    // 通知父组件更新
    emit('like-updated', props.comment);
  } catch (error) {
    console.error('点赞失败', error);
  }
};
</script>

<style scoped>
a-avatar {
  border: 1px solid #e5e5e5;
  border-radius: 50%;
}

a-button {
  font-size: 14px;
  color: #555;
}

a-button:hover {
  color: #1890ff;
}
 .author-tag {
   font-size: 12px;
   color: #1890ff;
   margin-left: 8px;
   border: 1px solid #1890ff;
   padding: 2px 4px;
   border-radius: 4px;
 }

:host {
  display: block;
  margin-left: 0;
}

[style*="margin-left"] {
  margin-left: 20px !important; /* 根据层级增加缩进 */
}

.comment-item {
  padding: 8px;
  border-bottom: 1px solid #eaeaea;
  position: relative; /* 确保子元素绝对定位有效 */
}

.comment-item .action-buttons {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px; /* 控制热评和更多按钮的间距 */
}

.comment-item .child-comments {
  margin-top: 8px;
  margin-left: 20px;
  padding-left: 16px;
  border-left: 2px solid #f0f0f0;
}

.hot-badge {
  background-color: #f5222d;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 8px;
  text-align: center;
}

.more-options-btn {
  font-size: 16px;
}
.hot-badge {
  position: absolute;
  top: -10px;
  right: 0;
  background-color: #f5222d;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 8px;
}

.more-options-btn {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
