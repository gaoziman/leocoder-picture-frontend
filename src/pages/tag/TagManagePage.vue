<template>
  <a-flex justify="space-between">
    <h2>标签管理</h2>
    <a-space>
      <a-button type="primary" @click="openModal">+ 创建标签</a-button>
    </a-space>
  </a-flex>
  <a-form layout="inline" :model="searchParams" @finish="doSearch" style="margin-bottom: 20px">
    <a-form-item label="标签名称">
      <a-input v-model:value="searchParams.name" placeholder="输入标签名称" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">搜索</a-button>
    </a-form-item>
  </a-form>

  <a-table
    :columns="columns"
    :data-source="dataList"
    :pagination="pagination"
    row-key="id"
    @change="doTableChange"
  >
    <template #bodyCell="{ column, record }">
      <!-- 标签 -->
      <template v-if="column.dataIndex === 'name'">
        <a-space wrap>
          <a-tag :color="getTagColor(record.name)">{{ record.name }}</a-tag>
        </a-space>
      </template>
      <template v-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space>
          <a-button @click="openModal(record)">
            <template #icon>
              <icon-font type="icon-bianji" />
            </template>
            编辑
          </a-button>
          <a-popconfirm
            title="你确定要删除这个标签吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="() => doDelete(record.id)"
            @cancel="cancel"
          >
            <a-button danger size="middle">
              <template #icon>
                <icon-font type="icon-a-shanchu1" />
              </template>
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </template>
  </a-table>

  <!-- 添加/编辑弹框 -->
  <a-drawer
    v-model:visible="modalVisible"
    :title="editForm.id ? '编辑标签' : '创建标签'"
    placement="right"
    width="400"
    :destroy-on-close="true"
    @close="handleCancel"
  >
    <a-form ref="formRef" :model="editForm" :rules="formRules" v-bind="formItemLayout">
      <a-form-item label="标签名称" name="name">
        <a-input v-model:value="editForm.name" placeholder="请输入标签名称" style="width: 100%" />
      </a-form-item>
      <a-form-item label="描述">
        <a-input
          v-model:value="editForm.description"
          placeholder="请输入标签描述"
          style="width: 100%"
        />
      </a-form-item>
      <a-space style="margin-top: 20px; justify-content: flex-end; width: 100%">
        <a-button type="default" @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleSave">保存</a-button>
      </a-space>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import {
  deleteTagUsingPost,
  updateTagUsingPost,
  addTagUsingPost,
  listTagsByPageUsingPost,
} from '@/api/biaoqianguanli.ts'
import { computed, onMounted, reactive, ref } from 'vue'
import { type FormInstance } from 'ant-design-vue'
import dayjs from 'dayjs'
import { getTagColor } from '@/utils/tagColorUtil.ts'
import { Message } from '@arco-design/web-vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { SCRIPT_URL } from '@/constants/url.ts'
import wrapperRaf from 'ant-design-vue/es/_util/raf'
import cancel = wrapperRaf.cancel

const IconFont = createFromIconfontCN({
  scriptUrl: SCRIPT_URL,
})
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: '标签名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '描述',
    dataIndex: 'description',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
  },
]

const dataList = ref([])
const total = ref(0)
// 弹框相关
const modalVisible = ref(false)
const formRef = ref<FormInstance>()
const editForm = reactive({
  id: '',
  name: '',
  description: '',
})

// 搜索条件
const searchParams = reactive({
  pageNum: 1,
  pageSize: 5,
  name: '',
})

// 分页相关
const pagination = computed(() => ({
  current: searchParams.pageNum,
  pageSize: searchParams.pageSize,
  total: total.value,
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 条`,
}))

// 表单布局
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
}

const fetchData = async () => {
  const res = await listTagsByPageUsingPost({
    ...searchParams,
  })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0 // 确保是数字
  } else {
    Message.error('获取数据失败，' + res.data.message)
  }
}

// 打开弹框
const openModal = (record?: any) => {
  modalVisible.value = true
  // 重置表单验证状态
  formRef.value?.resetFields()

  if (record) {
    // 编辑
    editForm.id = record.id
    editForm.name = record.name
    editForm.description = record.description
  } else {
    // 创建
    editForm.id = ''
    editForm.name = ''
    editForm.description = ''
  }
}

// 获取标签颜色
const doTableChange = (page: any) => {
  searchParams.pageNum = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

const doSearch = () => {
  searchParams.pageNum = 1
  fetchData()
}

const doDelete = async (id: string) => {
  if (!id) return
  const res = await deleteTagUsingPost({ id })
  if (res.data.code === 200) {
    Message.success('删除成功')
    fetchData()
  } else {
    Message.error('删除失败')
  }
}

// 保存逻辑（区分创建和编辑）
const handleSave = async () => {
  if (!editForm.name) {
    Message.error('标签名称不能为空')
    return
  }
  if (editForm.id) {
    // 编辑逻辑
    const res = await updateTagUsingPost({
      id: editForm.id,
      name: editForm.name,
      description: editForm.description,
    })
    if (res.data.code === 200) {
      Message.success('修改成功')
      modalVisible.value = false
      fetchData()
    } else {
      Message.error('编辑失败: ' + res.data.message)
    }
  } else {
    // 创建逻辑
    const res = await addTagUsingPost({
      name: editForm.name,
      description: editForm.description,
    })
    if (res.data.code === 200) {
      Message.success('创建成功')
      modalVisible.value = false
      fetchData()
    } else {
      Message.error(res.data.message)
    }
  }
}

// 取消弹框
const handleCancel = () => {
  modalVisible.value = false
}

onMounted(fetchData)
</script>

<style scoped></style>
