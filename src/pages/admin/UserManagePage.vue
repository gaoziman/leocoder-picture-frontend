<template>
  <a-form layout="inline" :model="searchParams" @finish="doSearch" style="margin-bottom: 20px">
    <a-form-item label="账号">
      <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" />
    </a-form-item>
    <a-form-item label="用户名">
      <a-input v-model:value="searchParams.userName" placeholder="输入用户名" />
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
      <template v-if="column.dataIndex === 'userAvatar'">
        <a-image :src="record.userAvatar" :width="60" />
      </template>
      <template v-else-if="column.dataIndex === 'userRole'">
        <div v-if="record.userRole === 'admin'">
          <a-tag color="green">管理员</a-tag>
        </div>
        <div v-else>
          <a-tag color="blue">普通用户</a-tag>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <div v-if="record.userRole !== 'admin'">
          <a-tooltip placement="left" title="删除" color="geekblue">
            <a-popconfirm
              title="你确定要删除这个用户吗?"
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
        </div>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { deleteUserUsingPost, listUserVoByPageUsingPost } from '@/api/yonghuguanli.ts'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { createFromIconfontCN, PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { SCRIPT_URL } from '@/constants/url.ts'
import wrapperRaf from 'ant-design-vue/es/_util/raf'
import cancel = wrapperRaf.cancel
import { Message } from '@arco-design/web-vue'

const IconFont = createFromIconfontCN({
  scriptUrl: SCRIPT_URL,
})

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
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
const searchParams = reactive<API.UserQueryRequest>({
  pageNum: 1,
  pageSize: 4,
})

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

// 获取数据
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({
    ...searchParams,
  })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0 // 确保是数字
    // 确保当前页码在总页数范围内
    const maxPage = Math.ceil(total.value / searchParams.pageSize)
    if (searchParams.pageNum > maxPage) {
      searchParams.pageNum = maxPage
      fetchData() // 再次刷新数据
    }
  } else {
    Message.error('获取数据失败，' + res.data.message)
  }
}

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

// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.pageNum = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 获取数据
const doSearch = () => {
  // 重置页码
  searchParams.pageNum = 1
  fetchData()
}

// 删除数据
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deleteUserUsingPost({ id })
  if (res.data.code === 200) {
    // 删除成功后检查是否需要调整页码
    if (dataList.value.length === 1 && searchParams.pageNum > 1) {
      searchParams.pageNum -= 1 // 回到上一页
    }
    Message.success('删除成功')
    // 刷新数据
    await fetchData()
  } else {
    Message.error('删除失败')
  }
}
</script>

<style scoped></style>
