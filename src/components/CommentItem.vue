<template>
  <div
    :style="{
      marginLeft: level === 0 ? '0px' : level === 1 ? '20px' : '40px',
      marginBottom: '16px',
    }"
  >
    <!-- 评论信息展示 -->
    <div style="display: flex; align-items: flex-start; gap: 12px">
      <a-avatar :src="comment.userAvatar" size="large" />
      <div style="flex: 1">
        <!-- 用户名与父评论或子评论内容区分 -->
        <div v-if="level === 0">
          <strong style="font-size: 15px; color: #262626;">{{ comment.userName }}</strong>
          <span v-if="comment.author" style="font-size: 12px; color: #1890ff; margin-left: 8px; border: 1px solid #1890ff; padding: 2px 4px; border-radius: 4px;">
              作者
            </span>
          <div style="margin-top: 4px; font-size: 15px; color: #262626; line-height: 1.5">
            {{ comment.content }}
          </div>
        </div>
        <div v-else>
          <div style="display: flex; align-items: baseline; gap: 8px">
            <span style="font-size: 15px; color: #262626;">
              {{ comment.userName }}
              <span v-if="comment.author" style="font-size: 12px; color: #1890ff; margin-left: 8px; border: 1px solid #1890ff; padding: 2px 4px; border-radius: 4px;">
                作者
              </span>
            </span>
            <span style="font-size: 14px; color: #262626;">
              回复 <span>{{ comment.parentUserName }} :</span>  <span style="margin-top: 4px; font-size: 15px; color: #262626; line-height: 1.5">{{ comment.content }}</span>
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
          <a-button
            v-if="level === 0 || level === 1"
            type="text"
            @click="replyToComment(comment.id)"
            style="padding: 0; height: auto"
          >
            <MessageOutlined />
            <span style="margin-left: 4px">回复</span>
          </a-button>
        </div>
      </div>
    </div>

    <!-- 子评论列表 -->
    <div v-if="comment.children?.length > 0" style="margin-top: 16px">
      <comment-item
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        :level="level === 0 ? 1 : 1"
        @reply="$emit('reply', child)"
        @like-updated="$emit('like-updated', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { LikeFilled, MessageOutlined,LikeOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { toggleLikeUsingPost }  from '@/api/tupianpinglunguanli.ts'

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const emit = defineEmits(['reply', 'like-updated']);
const props = defineProps({
  comment: Object,
  level: Number,
});


const replyToComment = () => {
  console.log('当前评论:', props.comment);
  emit('reply', props.comment);
};

const formatTime = (time) => {
  return dayjs(time).fromNow();
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
</style>
