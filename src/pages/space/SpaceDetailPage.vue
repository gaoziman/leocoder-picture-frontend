<template>
  <!-- 空间信息 -->
  <a-flex justify="space-between">
    <h2>{{ space.spaceName }}（私有空间）</h2>
    <a-space size="middle">
      <a-button type="primary" :href="`/add_picture?spaceId=${id}`" target="_blank"  :icon="h(PlusOutlined)">
        创建图片
      </a-button>
      <a-tooltip :title="`占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`">
        <a-progress
          type="circle"
          :percent="((space.totalSize * 100) / space.maxSize).toFixed(1)"
          :size="42"
        />
      </a-tooltip>
    </a-space>
  </a-flex>
  <!-- 图片列表 -->
  <PictureList :dataList="dataList" :loading="loading" source="space" />
  <a-pagination
    style="text-align: right"
    v-model:pageNum="searchParams.pageNum"
    v-model:pageSize="searchParams.pageSize"
    :total="total"
    :show-total="() => `图片总数 ${total} / ${space.maxCount}`"
    @change="onPageChange"
  />
</template>

<script setup lang="ts">
import { h, onMounted, reactive, ref } from 'vue'

import PictureList from '@/components/PictureList.vue'
import { getSpaceVoByIdUsingGet } from '@/api/kongjianguanli.ts'
import { formatSize } from '@/utils'
import { listPictureVoByPageUsingPost } from '@/api/tupianguanli.ts'
import { Message } from '@arco-design/web-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  id: string | number
}>()
const space = ref<API.SpaceVO>({})

// 数据
const dataList = ref([])
const total = ref(0)
const loading = ref(true)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  pageNum: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 页面加载时请求一次
onMounted(() => {
  fetchData()
  fetchSpaceDetail()
})

// 获取空间详情
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 200 && res.data.data) {
      space.value = res.data.data
    } else {
      Message.error('获取空间详情失败，' + res.data.message)
    }
  } catch (e: any) {
    Message.error('获取空间详情失败：' + e.message)
  }
}

// 分页参数
const onPageChange = (page, pageSize) => {
  searchParams.pageNum = page
  searchParams.pageSize = pageSize
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id,
    ...searchParams,
  }
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0 // 确保是数字
  } else {
    Message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}
</script>

<style scoped></style>
