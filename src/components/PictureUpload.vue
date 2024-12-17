<template>
  <div class="picture-upload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="handleUpload"
      :before-upload="beforeUpload"
    >
      <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽上传图片</div>
      </div>
    </a-upload>
  </div>
</template>

<script setup lang="ts">
import { message, type UploadProps } from 'ant-design-vue'
import { ref } from 'vue'
import { uploadPictureUsingPost } from '@/api/tupianguanli.ts'

interface Props {
  picture?: API.PictureVO
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  // 定义支持上传的图片格式类型数组
  const supportedTypes = [
    'image/jpeg',   // jpeg格式
    'image/jpg',    // jpg格式（部分浏览器可能识别成jpeg，兼容写上）
    'image/png',    // png格式
    'image/webp',   // webp格式
    'image/heic'    // heic格式（需浏览器或前端处理支持）
  ]

  // 检查文件类型是否在支持列表中
  const isSupportedType = supportedTypes.includes(file.type)
  if (!isSupportedType) {
    message.error('不支持上传该格式的图片，推荐 jpg、jpeg、png、webp、heic 格式')
  }

  // 校验图片大小
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('不能上传超过 2M 的图片')
  }

  return isSupportedType && isLt2M
}
const loading = ref<boolean>(false)

/**
 * 上传
 * @param file
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params = props.picture ? { id: props.picture.id } : {}
    const res = await uploadPictureUsingPost(params, {}, file)
    if (res.data.code === 200 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败')
  } finally {
    loading.value = false
  }
}

const params = props.picture ? { id: props.picture.id } : {}
</script>

<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-height: 152px;
  min-width: 152px;
}

.picture-upload img {
  max-width: 100%;
  max-height: 480px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
