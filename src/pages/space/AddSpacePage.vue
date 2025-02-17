<template>
  <a-form layout="vertical" :model="formData" @finish="handleSubmit" style="max-width: 1000px; margin: auto; padding: 20px;">
    <a-form-item label="空间名称" name="spaceName">
      <a-input v-model:value="formData.spaceName" placeholder="请输入空间名称" allow-clear />
    </a-form-item>
    <a-form-item label="空间级别" name="spaceLevel">
      <a-select
        v-model:value="formData.spaceLevel"
        :options="SPACE_LEVEL_OPTIONS"
        placeholder="请输入空间级别"
        style="min-width: 180px"
        allow-clear
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">
        提交
      </a-button>
    </a-form-item>
  </a-form>
  <a-card title="空间级别介绍" style="max-width: 1000px; margin: auto; padding: 20px;">
    <a-typography-paragraph>
      * 目前仅支持开通普通版，如需升级空间，请联系
      <a href="https://gaoziman.github.io/toLeoJavaer/" target="_blank">程序员Leo</a>。
    </a-typography-paragraph>
    <a-typography-paragraph v-for="spaceLevel in spaceLevelList">
      {{ spaceLevel.text }}： 大小 {{ formatSize(spaceLevel.maxSize) }}， 数量
      {{ spaceLevel.maxCount }}
    </a-typography-paragraph>
  </a-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SPACE_LEVEL_ENUM, SPACE_LEVEL_OPTIONS } from '@/constants/space.ts'
import { formatSize } from '@/utils'
import {
  addSpaceUsingPost,
  getSpaceVoByIdUsingGet,
  listSpaceLevelUsingGet,
  updateSpaceUsingPost,
} from '@/api/kongjianguanli.ts'
import { Message } from '@arco-design/web-vue'

const loading = ref(false)
const router = useRouter()
const route = useRoute()
const oldSpace = ref<API.SpaceVO>()

// 空间级别列表
const spaceLevelList = ref<API.SpaceLevel[]>([])

// 表单数据
const formData = reactive<API.SpaceAddRequest | API.SpaceUpdateRequest>({
  spaceName: '',
  spaceLevel: SPACE_LEVEL_ENUM.COMMON,
})

onMounted(() => {
  fetchSpaceLevelList()
  getOldSpace()
})

// 提交表单
const handleSubmit = async (values: any) => {
  if (formData.spaceName.trim() === ''){
    Message.error('空间名称不能为空')
    return
  }

  const spaceId = oldSpace.value?.id
  loading.value = true
  let res
  // 更新
  if (spaceId) {
    res = await updateSpaceUsingPost({
      id: spaceId,
      ...formData,
    })
  } else {
    // 创建
    res = await addSpaceUsingPost({
      ...formData,
    })
  }
  if (res.data.code === 200 && res.data.data) {
    Message.success('创建成功')
    let path = `/space/${spaceId ?? res.data.data}`
    router.push({
      path,
    })
  } else {
    Message.error('创建失败，' + res.data.message)
  }
  loading.value = false
}

// 获取空间级别
const fetchSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet()
  if (res.data.code === 200 && res.data.data) {
    spaceLevelList.value = res.data.data
  } else {
    Message.error('加载空间级别失败，' + res.data.message)
  }
}
// 获取老数据
const getOldSpace = async () => {
  // 获取数据
  const id = route.query?.id
  if (id) {
    const res = await getSpaceVoByIdUsingGet({
      id: id,
    })
    if (res.data.code === 200 && res.data.data) {
      const data = res.data.data
      oldSpace.value = data
      formData.spaceName = data.spaceName
      formData.spaceLevel = data.spaceLevel
    }
  }
}
</script>

<style scoped></style>
