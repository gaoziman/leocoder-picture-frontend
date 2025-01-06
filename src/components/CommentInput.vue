<template>
  <div class="comment-input-container" ref="commentContainer">
    <!-- 输入框 -->
    <div class="input-box">
      <!-- 输入文本 -->
      <a-textarea
        v-model:value="localInputValue"
        placeholder="我来说两句..."
        :maxLength="1000"
        class="comment-textarea"
        :rows="3"
        @input="handleInput"
      />

      <!-- 工具栏 -->
      <div class="input-toolbar">
        <!-- 左侧按钮 -->
        <div class="left-actions">
          <a-button
            type="text"
            class="emoji-button"
            @click="toggleEmojiPicker"
          >
            <MehOutlined />
          </a-button>

          <a-button
            type="text"
            class="upload-button"
            @click="openImageUploader"
          >
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
          <span class="char-count">{{ localInputValue.length }} / 1000</span>
          <a-button
            :type="submitButtonType"
            class="submit-button"
            @click="handleSubmit"
          >
            {{ submitButtonText }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MehOutlined, CloudUploadOutlined } from '@ant-design/icons-vue';
import 'emoji-picker-element';
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { Message } from '@arco-design/web-vue'

// Props
const props = defineProps({
  userAvatar: String,
  inputValue: String,
  submitButtonText: {
    type: String,
    default: '发布',
  },
  submitButtonType: {
    type: String,
    default: 'primary',
  },
  resetInput: Boolean,
});

// Emits
const emit = defineEmits(['submit', 'input-update']);

// 本地状态
const showEmojiPicker = ref(false);
const commentContainer = ref(null);
const localInputValue = ref('');

// 初始化
onMounted(() => {
  localInputValue.value = props.inputValue || '';
  document.addEventListener('click', handleDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});

// 监听 props.inputValue 的变化
watch(() => props.inputValue, (newVal) => {
  localInputValue.value = newVal || ''; // 当父组件更新 inputValue 时，同步更新本地值
});

// 输入事件
const handleInput = (event) => {
  localInputValue.value = event.target.value; // 使用事件目标的值
  emit('input-update', localInputValue.value); // 更新父组件
};

// 提交事件
const handleSubmit = () => {
  if (!localInputValue.value.trim()) {
    Message.error('回复内容不能为空！');
    return;
  }
  if (localInputValue.value.length < 4) {
    Message.error('回复内容不能少于4个字符！');
    return;
  }
  emit('submit', localInputValue.value); // 通知父组件提交评论
};



const toggleEmojiPicker = (event) => {
  event.stopPropagation();
  showEmojiPicker.value = !showEmojiPicker.value;
};

const addEmoji = (event) => {
  const emoji = event.detail.unicode || event.detail.emoji; // 确保从事件中正确获取 emoji
  if (emoji) {
    localInputValue.value += emoji; // 在当前输入值中追加 Emoji
    emit('input-update', localInputValue.value); // 通知父组件更新
  }
  showEmojiPicker.value = false; // 点击后关闭 Emoji Picker
};


// 展示emoji picker
const handleDocumentClick = (event) => {
  if (!commentContainer.value || commentContainer.value.contains(event.target)) {
    return;
  }
  showEmojiPicker.value = false;
};


const openImageUploader = () => {
  console.log('图片上传功能');
};
</script>

<style scoped>
.comment-input-container {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px; /* 限制评论框宽度 */
  position: relative; /* 保证定位 */
}

.input-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.comment-textarea {
  border-radius: 8px;
  font-size: 14px;
  padding: 12px;
  border: 1px solid #d9d9d9;
  resize: none;
  transition: all 0.3s;
  min-height: 100px; /* 增加评论框高度 */
}

.comment-textarea:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 5px rgba(24, 144, 255, 0.3);
}
.input-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.left-actions {
  display: flex;
  gap: 10px;
  align-items: center; /* 确保左侧图标对齐 */
}

.right-actions {
  display: flex;
  align-items: center; /* 确保右侧对齐 */
  gap: 12px;
  /* 去掉 position: absolute; */
  /* bottom: 16px; */
  /* right: 16px; */
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

.emoji-picker {
  position: absolute;
  z-index: 1000;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 8px;
  width: 300px; /* 缩小 Emoji 框宽度 */
  height: 250px; /* 缩小 Emoji 框高度 */
  overflow-y: auto;
}
</style>
