<template>
  <div class="url-picture-upload">
    <a-input-group compact style="margin-bottom: 16px">
      <a-input
        v-model:value="fileUrl"
        style="width: calc(100% - 120px)"
        placeholder="请输入图片 URL"
      />
      <a-button type="primary" :loading="loading" @click="handleUpload" style="width: 120px"
        >提交
      </a-button>
    </a-input-group>
    <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadPictureByUrlUsingPost, uploadPictureUsingPost } from '@/api/tupianguanli.ts'
import { Message } from '@arco-design/web-vue'

const loading = ref<boolean>(false)
const fileUrl = ref<string>()

interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

// 上传时传递 spaceId
const props = defineProps<Props>()

// 上传成功的图片信息
const handleUpload = async () => {
  loading.value = true
  try {
    const params: API.PictureUploadRequest = { fileUrl: fileUrl.value }
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await uploadPictureByUrlUsingPost(params)
    if (res.data.code === 200 && res.data.data) {
      Message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
    } else {
      Message.error('图片上传失败，' + res.data.message)
    }
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.url-picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-height: 152px;
  min-width: 152px;
}

.url-picture-upload img {
  max-width: 100%;
  max-height: 480px;
}
</style>
