<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '修改图片' : '创建图片' }}
    </h2>
    <a-typography-paragraph v-if="spaceId" type="secondary">
      保存至空间：<a :href="`/space/${spaceId}`" target="_blank">{{ spaceId }}</a>
    </a-typography-paragraph>

    <!-- 选择上传方式 -->
    <a-tabs v-model:activeKey="uploadType">
      <a-tab-pane key="file" tab="文件上传">
        <PictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL 上传" force-render>
        <UrlPictureUpload :picture="picture" :spaceId="spaceId" :onSuccess="onSuccess" />
      </a-tab-pane>
    </a-tabs>

    <a-form v-if="picture" layout="vertical" :model="pictureForm" @finish="handleSubmit">
      <a-form-item label="名称" name="name">
        <a-input v-model:value="pictureForm.name" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-textarea
          v-model:value="pictureForm.introduction"
          placeholder="请输入简介"
          :rows="2"
          autoSize
          allowClear
        />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-select
          v-model:value="pictureForm.category"
          :options="categoryOptions"
          placeholder="请选择或输入分类"
          :filterOption="false"
          allowClear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="pictureForm.tags"
          :options="tagOptions"
          placeholder="请选择或输入标签"
          mode="tags"
          allowClear
          @change="handleTagChange"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%">
          {{ route.query?.id ? '修改' : '创建' }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { editPictureUsingPost, getPictureVoByIdUsingGet } from '@/api/tupianguanli.ts'
import { addTagUsingPost, listTagsUsingPost } from '@/api/biaoqianguanli.ts'
import { listCategoryUsingPost } from '@/api/fenleiguanli.ts'
import { Message } from '@arco-design/web-vue'

const uploadType = ref<'file' | 'url'>('file')
const picture = ref<API.PictureVO>()
const pictureForm = reactive<API.PictureEditRequest>({})
const categoryOptions = ref<any[]>([])
const tagOptions = ref<any[]>([])
// 保存新增的标签
const newTags = ref<string[]>([])
const router = useRouter()
const route = useRoute()

// 空间 id
const spaceId = computed(() => {
  return route.query?.spaceId
})

onMounted(() => {
  getTagCategoryOptions()
  getOldPicture()
})

// 上传成功回调
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

// 处理标签变化
const handleTagChange = (tags: string[]) => {
  tags.forEach((tag) => {
    if (!tagOptions.value.some((option) => option.value === tag) && !newTags.value.includes(tag)) {
      // 将新增的标签保存到 newTags 中
      newTags.value.push(tag)
    }
  })
}

// 提交表单
const handleSubmit = async (values: any) => {
  if (!picture.value?.id) return

  // 同步新增的分类和标签
  await syncNewTags()

  const res = await editPictureUsingPost({
    id: picture.value.id,
    spaceId: spaceId.value,
    ...values,
  })
  if (res.data.code === 200) {
    Message.success('操作成功')
    router.push({
      path: `/picture/${picture.value.id}`,
      query: { fromSpace: true }, // 添加 fromSpace 参数
    })
  } else {
    Message.error({
      content: '操作失败: ' + res.data.message,
      closable: true,
    })
  }
}

// 同步新增的分类和标签到数据库
const syncNewTags = async () => {
  if (newTags.value.length > 0) {
    try {
      const res = await addTagUsingPost({ tags: newTags.value }) // 新增标签到数据库
      if (res.data.code !== 200) {
        Message.error({
          content: '同步标签失败: ' + res.data.message,
          closable: true,
        })
      } else {
        // 成功后将新标签加入 tagOptions
        newTags.value.forEach((tag) => {
          tagOptions.value.push({ label: tag, value: tag })
        })
        // 清空 newTags
        newTags.value = []
      }
    } catch (error) {
      Message.error({
        content: '标签同步请求失败: ',
        closable: true,
      })
    }
  }
}

// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const [tagRes, categoryRes] = await Promise.all([
    listTagsUsingPost({}),
    listCategoryUsingPost({}),
  ])

  if (tagRes.data.code === 200) {
    tagOptions.value = tagRes.data.data.map((item: any) => ({
      label: item.name,
      value: item.name,
    }))
  }

  if (categoryRes.data.code === 200) {
    categoryOptions.value = categoryRes.data.data.map((item: any) => ({
      label: item.name,
      value: item.name,
    }))
  }
}

// 获取图片数据
const getOldPicture = async () => {
  const id = route.query?.id
  if (id) {
    const res = await getPictureVoByIdUsingGet({ id })
    if (res.data.code === 200) {
      Object.assign(pictureForm, res.data.data)
      picture.value = res.data.data
    }
  }
}
</script>

<style scoped>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
