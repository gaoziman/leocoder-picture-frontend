<template>
  <div id="addPictureBatchPage">
    <h2 style="margin-bottom: 16px">批量创建图片</h2>
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item label="关键词" name="searchText">
        <a-input v-model:value="formData.searchText" placeholder="请输入关键词" />
      </a-form-item>
      <a-form-item label="抓取数量" name="count">
        <a-input-number
          v-model:value="formData.count"
          placeholder="请输入数量"
          style="min-width: 180px"
          :min="1"
          :max="30"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="抓取源">
        <a-select v-model:value="formData.source" placeholder="请选择抓取源" style="width: 280px">
          <a-select-option value="baidu">百度</a-select-option>
          <a-select-option value="google">谷歌</a-select-option>
          <a-select-option value="bing">必应</a-select-option>
          <a-select-option value="wallhaven">wallhaven</a-select-option>
          <a-select-option value="pexels">pexels</a-select-option>
          <a-select-option value="haowallpaper">haowallpaper</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="名称前缀" name="namePrefix">
        <a-input v-model:value="formData.namePrefix" placeholder="请输入名称前缀，会自动补充序号" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
          执行任务
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { uploadPictureByBatchUsingPost } from '@/api/tupianguanli.ts'
import { Message } from '@arco-design/web-vue'

const router = useRouter()
const loading = ref(false)
const formData = reactive<API.PictureUploadByBatchRequest>({
  count: 10,
  source: 'baidu',
})

const handleSubmit = async (values: any) => {
  if (!formData.searchText) {
    Message.error('请填写搜索关键字！')
    return
  }

  if (!formData.source) {
    Message.error('请选择抓取源！')
    return
  }
  loading.value = true
  const res = await uploadPictureByBatchUsingPost({
    ...formData,
  })
  if (res.data.code === 200 && res.data.data) {
    Message.success(`创建成功，共 ${res.data.data} 条`)
    router.push({
      path: '/',
    })
  } else {
    Message.error('创建失败，' + res.data.message)
  }
  loading.value = false
}
</script>

<style scoped>
#addPictureBatchPage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
