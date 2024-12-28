<template>
  <a-flex justify="space-between">
    <h2>分类管理</h2>
    <a-space>
      <a-button type="primary" @click="openModal">+ 创建分类</a-button>
    </a-space>
  </a-flex>
  <a-form layout="inline" :model="searchParams" @finish="doSearch" style="margin-bottom: 20px">
    <a-form-item label="分类名称">
      <a-input v-model:value="searchParams.name" placeholder="输入分类名称"/>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">搜索</a-button>
    </a-form-item>
  </a-form>

  <a-table
    :columns="columns"
    :data-source="dataList"
    :pagination="pagination"
    @change="doTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'name'">
        <a-space wrap>
          <a-tag  :color="getCategoryColor(record.name)">{{record.name}}</a-tag>
        </a-space>
      </template>
      <template v-if="column.dataIndex === 'createTime'">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space>
          <a-button @click="openModal(record)" >编辑</a-button>
          <a-button danger @click="doDelete(record.id)">删除</a-button>
        </a-space>
      </template>
    </template>
  </a-table>


  <!-- 添加/编辑弹框 -->
  <a-modal
    v-model:visible="modalVisible"
    :title="editForm.id ? '编辑分类' : '创建分类'"
    ok-text="保存"
    cancel-text="取消"
    @ok="handleSave"
    @cancel="handleCancel"
  >
    <a-form  ref="formRef" :model="editForm"  :rules="formRules" v-bind="formItemLayout">
      <a-form-item label="分类名称" name="name">
        <a-input v-model:value="editForm.name" placeholder="请输入分类名称" style="width: 100%" />
      </a-form-item>
      <a-form-item label="描述">
        <a-input v-model:value="editForm.description" placeholder="请输入分类描述"  style="width: 100%" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {
  deleteCategoryUsingPost,
  updateCategoryUsingPost,
  listCategoryUsingPost, addCategoryUsingPost
} from '@/api/fenleiguanli.ts'
import { computed, onMounted, reactive, ref } from 'vue'
import { type FormInstance, message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { getCategoryColor } from '@/utils/tagColorUtil.ts'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: '分类名称',
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
const searchParams = reactive({
  pageNum: 1,
  pageSize: 5,
  categoryName: '',
})

const formRef = ref<FormInstance>();

// 弹框相关
const modalVisible = ref(false)


const editForm = reactive({
  id: '',
  name: '',
  description: '',
})

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}

// 获取分类数据
const fetchData = async () => {
  const res = await listCategoryUsingPost({
    ...searchParams,
  })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}



// 打开弹框
const openModal = (record?: any) => {
  modalVisible.value = true
  open.value = true;
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

// 保存逻辑（区分创建和编辑）
const handleSave = async () => {
  if (!editForm.name.trim()) {
    message.error('分类名称不能为空')
    return
  }

  if (editForm.id) {
    // 编辑逻辑
    const res = await updateCategoryUsingPost({
      id: editForm.id,
      name: editForm.name,
      description: editForm.description,
    })
    if (res.data.code === 200) {
      message.success('修改成功')
      modalVisible.value = false
      fetchData()
    } else {
      message.error('编辑失败: ' + res.data.message)
    }
  } else {
    // 创建逻辑
    const res = await addCategoryUsingPost({
      name: editForm.name,
      description: editForm.description,
    })
    if (res.data.code === 200) {
      message.success('创建成功')
      modalVisible.value = false
      fetchData()
    } else {
      message.error('创建失败: ' + res.data.message)
    }
  }
}

// 取消弹框
const handleCancel = () => {
  modalVisible.value = false
}


const pagination = computed(() => ({
  current: searchParams.pageNum,
  pageSize: searchParams.pageSize,
  total: total.value,
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 条`,
}))

const doTableChange = (page: any) => {
  searchParams.pageNum = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

const doSearch = () => {
  searchParams.pageNum = 1
  fetchData()
}

// 删除分类
const doDelete = async (id: string) => {
  if (!id) return
  const res = await deleteCategoryUsingPost({ id })
  if (res.data.code === 200) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error('删除失败')
  }
}

// 编辑分类
const doEdit = async (record: any) => {
  const newName = prompt('请输入新的分类名称', record.categoryName)
  if (!newName || newName === record.categoryName) return
  const res = await updateCategoryUsingPost({ id: record.id, categoryName: newName })
  if (res.data.code === 200) {
    message.success('编辑成功')
    fetchData()
  } else {
    message.error('编辑失败')
  }
}

onMounted(fetchData)
</script>

<style scoped></style>
