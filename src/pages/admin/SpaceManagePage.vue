<template>
  <a-flex justify="space-between">
    <h2>空间管理</h2>
    <a-space>
      <a-button type="primary" href="/add_space"  :icon="h(PlusOutlined)">创建空间</a-button>
    </a-space>
  </a-flex>
  <a-form layout="inline" :model="searchParams" @finish="doSearch" style="margin-bottom: 20px">
    <a-form-item label="空间名称" name="spaceName">
      <a-input v-model:value="searchParams.spaceName" placeholder="请输入空间名称" allow-clear />
    </a-form-item>
    <a-form-item label="空间级别" name="spaceLevel">
      <a-select
        v-model:value="searchParams.spaceLevel"
        :options="SPACE_LEVEL_OPTIONS"
        placeholder="请输入空间级别"
        style="min-width: 180px"
        allow-clear
      />
    </a-form-item>
    <a-form-item label="用户 id" name="userId">
      <a-input v-model:value="searchParams.userId" placeholder="请输入用户 id" allow-clear />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" :icon="h(SearchOutlined)" html-type="submit">搜索</a-button>
    </a-form-item>
  </a-form>

  <a-table
    :columns="columns"
    :data-source="dataList"
    :pagination="pagination"
    @change="doTableChange"
  >
    <template #bodyCell="{ column, record }">
      <!-- 空间级别 -->
      <template v-if="column.dataIndex === 'spaceLevel'">
        <a-tag>{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</a-tag>
      </template>
      <!-- 使用情况 -->
      <template v-if="column.dataIndex === 'spaceUseInfo'">
        <div>大小：{{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
        <div>数量：{{ record.totalCount }} / {{ record.maxCount }}</div>
      </template>
      <template v-else-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.dataIndex === 'editTime'">
        {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space wrap>
          <a-tooltip placement="left" title="编辑" color="geekblue">
            <a-button size="large" :href="`/add_space?id=${record.id}`" target="_blank">
              <template #icon>
                <icon-font type="icon-bianji4" />
              </template>
            </a-button>
          </a-tooltip>

          <a-tooltip placement="right" title="删除" color="geekblue">
            <a-popconfirm
              title="你确定要删除这个分类吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="() => doDelete(record.id)"
              @cancel="cancel"
            >
              <a-button size="large">
                <template #icon>
                  <icon-font type="icon-a-shanchu1" />
                </template>
              </a-button>
            </a-popconfirm>
          </a-tooltip>
        </a-space>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { formatSize } from '@/utils'
import { SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS } from '@/constants/space.ts'
import { listSpaceVoByPageUsingPost } from '@/api/kongjianguanli.ts'
import wrapperRaf from 'ant-design-vue/es/_util/raf'
import cancel = wrapperRaf.cancel
import { SCRIPT_URL } from '@/constants/url.ts'
import { createFromIconfontCN, PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const IconFont = createFromIconfontCN({
  scriptUrl: SCRIPT_URL,
})
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

// 数据
const dataList = ref([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.pageNum ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

// 获取数据
const fetchData = async () => {
  const res = await listSpaceVoByPageUsingPost({
    ...searchParams,
  })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0 // 确保是数字
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 获取数据
const doSearch = () => {
  // 重置搜索条件
  searchParams.current = 1
  fetchData()
}

// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}
</script>

<style scoped></style>
