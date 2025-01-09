<template>
  <a-flex justify="space-between">
    <h2>图片管理</h2>
    <a-space>
      <!-- 批量删除按钮 -->
      <a-button
        type="primary"
        danger
        @click="handleBatchDelete"
        :disabled="selectedRowKeys.length === 0"
        :icon="h(DeleteOutlined)"
      >
        批量删除
      </a-button>
      <a-button type="primary" href="/add_picture" :icon="h(PlusOutlined)" target="_blank"
        >创建图片
      </a-button>
      <a-button
        type="primary"
        href="/add_picture/batch"
        :icon="h(PlusOutlined)"
        target="_blank"
        ghost
        >批量创建图片
      </a-button>
    </a-space>
  </a-flex>
  <a-form layout="inline" :model="searchParams" @finish="doSearch" style="margin-bottom: 20px">
    <a-form-item label="关键词" name="searchText">
      <a-input
        v-model:value="searchParams.searchText"
        placeholder="从名称和简介搜索"
        allow-clear
        style="width: 160px"
      />
    </a-form-item>
    <a-form-item label="类型" name="category">
      <a-input
        v-model:value="searchParams.category"
        placeholder="请输入类型"
        allow-clear
        style="width: 130px"
      />
    </a-form-item>
    <a-form-item label="标签" name="tags">
      <a-select
        v-model:value="searchParams.tags"
        mode="tags"
        placeholder="请输入标签"
        style="min-width: 180px"
        allow-clear
      />
    </a-form-item>
    <a-form-item label="审核状态" name="reviewStatus">
      <a-select
        v-model:value="searchParams.reviewStatus"
        :options="PIC_REVIEW_STATUS_OPTIONS"
        placeholder="请输入审核状态"
        style="min-width: 140px"
        allow-clear
      />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit" :icon="h(SearchOutlined)">搜索</a-button>
      <a-button type="primary" danger @click="refreshCache" style="margin-left: 10px">刷新缓存 </a-button>
    </a-form-item>
  </a-form>

  <a-table
    :columns="columns"
    :data-source="dataList"
    :pagination="pagination"
    :scroll="{ x: 2000 }"
    :row-selection="rowSelection"
    rowKey="id"
    :expand-column-width="100"
    @change="doTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'url'">
        <a-image :src="record.url" :width="120" />
      </template>
      <!-- 标签 -->
      <template v-if="column.dataIndex === 'tags'">
        <a-space wrap>
          <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag" :color="getTagColor(tag)"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <!-- 图片信息 -->
      <template v-if="column.dataIndex === 'picInfo'">
        <div>格式：{{ record.picFormat }}</div>
        <div>宽度：{{ record.picWidth }}</div>
        <div>高度：{{ record.picHeight }}</div>
        <div>宽高比：{{ record.picScale }}</div>
        <div>大小：{{ (record.picSize / 1024).toFixed(2) }}KB</div>
      </template>
      <!-- 审核信息 -->
      <template v-if="column.dataIndex === 'reviewMessage'">
        <div>审核状态：{{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
        <div>审核信息：{{ record.reviewMessage }}</div>
        <div>审核人：{{ record.reviewerId }}</div>
      </template>

      <template v-else-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.dataIndex === 'editTime'">
        {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space direction="vertical">
          <!--  通过     -->
          <a-tooltip placement="left" title="审核通过" color="geekblue">
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
              size="large"
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
            >
              <template #icon>
                <icon-font type="icon-pass-1-copy" />
              </template>
            </a-button>
          </a-tooltip>

          <!--  拒绝-->
          <a-tooltip placement="left" title="审核拒绝" color="geekblue">
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              size="large"
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
            >
              <template #icon>
                <icon-font type="icon-weitongguo" />
              </template>
            </a-button>
          </a-tooltip>
          <!--  编辑-->
          <a-tooltip placement="left" title="编辑" color="geekblue">
            <a-button size="large" :href="`/add_picture?id=${record.id}`" target="_blank">
              <template #icon>
                <icon-font type="icon-bianji4" />
              </template>
            </a-button>
          </a-tooltip>
          <!--  删除-->
          <a-tooltip placement="left" title="删除" color="geekblue">
            <a-popconfirm
              title="你确定要删除这张图片吗?"
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
import { computed, onMounted, reactive, ref, h } from 'vue'
import {
  deleteBatchPictureUsingPost,
  deletePictureUsingPost,
  doPictureReviewUsingPost,
  listPictureByPageUsingPost,
  refreshCacheUsingPost,
} from '@/api/tupianguanli.ts'
import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  createFromIconfontCN,
} from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import wrapperRaf from 'ant-design-vue/es/_util/raf'
import cancel = wrapperRaf.cancel
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS,
} from '@/constants/picture.ts'
import { getTagColor } from '@/utils/tagColorUtil.ts'
import { Message } from '@arco-design/web-vue'
import { SCRIPT_URL } from '@/constants/url.ts'
import { useCacheStore } from '@/stores/cache'

const cacheStore = useCacheStore()

const IconFont = createFromIconfontCN({
  scriptUrl: SCRIPT_URL,
})
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
    fixed: 'left',
  },
  {
    title: '图片',
    dataIndex: 'url',
    width: 160,
    fixed: 'left',
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    ellipsis: true,
    width: 180,
  },
  {
    title: '类型',
    dataIndex: 'category',
    width: 80,
  },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 100,
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
    width: 140,
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 200,
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
    width: 180,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 140,
  },

  {
    title: '编辑时间',
    dataIndex: 'editTime',
    width: 140,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 80, // 设置固定宽度
    align: 'center', // 水平居中
  },
]

// 数据
const dataList = ref([])
const total = ref(0)

// 用于存储选中的行的 ID
const selectedRowKeys = ref<string[]>([])

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  pageNum: 1,
  pageSize: 4,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const pagination = computed(() => {
  return {
    pageNum: searchParams.pageNum ?? 1,
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
  const res = await listPictureByPageUsingPost({
    ...searchParams,
    nullSpaceId: true,
  })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0 // 确保是数字
  } else {
    Message.error('获取数据失败，' + res.data.message)
  }
}

// 获取数据
const doSearch = () => {
  // 重置搜索条件
  searchParams.pageNum = 1
  fetchData()
}

// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.pageNum = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 刷新缓存方法
const refreshCache = async() => {
  cacheStore.refreshCacheList(searchParams)
}

// 删除图片
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 200) {
    Message.success('删除成功')
    // 删除成功后检查是否需要调整页码
    if (dataList.value.length === 1 && searchParams.pageNum > 1) {
      searchParams.pageNum -= 1 // 回到上一页
    }
    // 刷新数据
    await fetchData()
    // 缓存刷新
    await refreshCache()
  } else {
    Message.error('删除失败')
  }
}
// 审核图片
const handleReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage =
    reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作通过' : '管理员操作拒绝'
  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  })
  if (res.data.code === 200) {
    Message.success('审核操作成功')
    // 重新获取列表
    fetchData()
  } else {
    Message.error('审核操作失败，' + res.data.message)
  }
}

// 表格的 rowSelection 配置
const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
  },
  onSelect: (record: any, selected: boolean) => {
    // 单选逻辑
    if (selected) {
      selectedRowKeys.value.push(record.id)
    } else {
      selectedRowKeys.value = selectedRowKeys.value.filter((key) => key !== record.id)
    }
  },
  onSelectAll: (selected: boolean, selectedRows: any[]) => {
    // 全选逻辑
    if (selected) {
      selectedRowKeys.value = selectedRows.map((row) => row.id)
    } else {
      selectedRowKeys.value = []
    }
  },
}

// 批量删除逻辑
const handleBatchDelete = () => {
  Modal.confirm({
    title: '确认删除',
    content: `你确定要删除选中的 ${selectedRowKeys.value.length} 条记录吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteBatchPictureUsingPost({
          // 传递选中的 ID 数组
          ids: selectedRowKeys.value,
        })
        if (res.data.code === 200) {
          Message.success('批量删除成功')
          // 判断是否需要跳转到上一页
          if (dataList.value.length === selectedRowKeys.value.length && searchParams.pageNum > 1) {
            // 跳转到上一页
            searchParams.pageNum -= 1
          }
          // 清空选中状态
          selectedRowKeys.value = []
          // 刷新数据
          await fetchData()
          // 缓存刷新
          await refreshCache()
        } else {
          Message.error('批量删除失败：' + res.data.message)
        }
      } catch (error) {
        Message.error('批量删除失败，请重试')
      }
    },
  })
}
</script>

<style scoped></style>
