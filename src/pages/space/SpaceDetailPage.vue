<template>
  <!-- 空间信息 -->
  <a-flex justify="space-between" align="middle">
    <div>
      <h2>
        {{ space.spaceName }}（{{ getSpaceLevelText(space.spaceLevel) }}）
        <span class="space-badge">
          {{ getSpaceBadge(space.spaceLevel) }}
        </span>
      </h2>
    </div>
    <!--    <h2>{{ space.spaceName }}（私有空间）</h2>-->
    <a-space size="middle">
      <a-button type="primary" @click="showCreatePictureModal" :icon="h(PlusOutlined)">
        创建图片
      </a-button>
      <a-button :icon="h(EditOutlined)" @click="doBatchEdit"> 批量编辑</a-button>
      <a-tooltip
        placement="bottom"
        :title="`占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`"
      >
        <a-progress
          type="circle"
          :percent="((space.totalSize * 100) / space.maxSize).toFixed(1)"
          :size="42"
        />
      </a-tooltip>
    </a-space>
  </a-flex>

  <!-- 搜索表单 -->
  <PictureSearchForm :onSearch="onSearch" />
  <!-- 按颜色搜索，跟其他搜索条件独立 -->
  <a-form-item label="按颜色搜索" style="margin-top: 20px">
    <color-picker format="hex" @pureColorChange="onColorChange" />
  </a-form-item>

  <div style="margin-top: 15px"></div>

  <!-- 图片列表 -->
  <PictureList
      :dataList="dataList"
      :loading="loading"
      source="space"
  />
  <a-pagination
    style="text-align: right"
    v-model:pageNum="searchParams.pageNum"
    v-model:pageSize="searchParams.pageSize"
    :total="total"
    :show-total="() => `图片总数 ${total} / ${space.maxCount}`"
    @change="onPageChange"
  />

  <!-- 创建图片的弹窗 -->
  <a-modal
    v-model:visible="isModalVisible"
    title="创建图片"
    :footer="null"
    width="720px"
    @cancel="closeCreatePictureModal"
  >
    <AddPictureForm
      ref="addPictureFormRef"
      :space="space"
      :spaceId="space.id"
      @success="onPictureCreateSuccess"
    />
  </a-modal>


  <!--  批量编辑图片  -->
  <BatchEditPictureModal
    ref="batchEditPictureModalRef"
    :spaceId="id"
    :pictureList="dataList"
    :onSuccess="onBatchEditPictureSuccess"
  />
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue'

import PictureList from '@/components/PictureList.vue'
import { getSpaceVoByIdUsingGet } from '@/api/kongjianguanli.ts'
import { formatSize } from '@/utils'
import { listPictureVoByPageUsingPost, searchPictureByColorUsingPost } from '@/api/tupianguanli.ts'
import { Message } from '@arco-design/web-vue'
import { EditOutlined, PlusOutlined } from '@ant-design/icons-vue'
import AddPictureForm from '@/components/AddPictureForm.vue'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import BatchEditPictureModal from '@/components/BatchEditPictureModal.vue'

const props = defineProps<{
  id: string | number
}>()

const space = ref<API.SpaceVO>({})

// 数据
const dataList = ref([])
const total = ref(0)
const loading = ref(true)
// 弹窗状态
const isModalVisible = ref(false)
const addPictureFormRef = ref() // 引用子组件

// 分享弹窗引用
const batchEditPictureModalRef = ref()




// 搜索条件
const searchParams = ref<API.PictureQueryRequest>({
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

// 通用权限检查函数
/*function createPermissionChecker(permission: string) {
  return computed(() => {
    return (space.value.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)
const canUploadPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD)
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)*/

// 打开批量编辑弹窗
const doBatchEdit = () => {
  if (batchEditPictureModalRef.value) {
    batchEditPictureModalRef.value.openModal()
  }
}

// 批量编辑成功后，刷新数据
const onBatchEditPictureSuccess = () => {
  fetchData()
}

// 获取空间详情
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 200 && res.data.data) {
      space.value = res.data.data
    } else {
      Message.error({
        content: '获取空间详情失败，' + res.data.message,
        closable: true,
      })
    }
  } catch (e: any) {
    Message.error({
      content: '获取空间详情失败，' + e.message,
      closable: true,
    })
  }
}

// 分页参数
const onPageChange = (page, pageSize) => {
  searchParams.value.pageNum = page
  searchParams.value.pageSize = pageSize
  fetchData()
}

// 搜索
const onSearch = (newSearchParams: API.PictureQueryRequest) => {
  searchParams.value = {
    ...searchParams.value,
    ...newSearchParams,
    pageNum: 1,
  }
  fetchData()
}

// 打开弹窗
const showCreatePictureModal = () => {
  isModalVisible.value = true
}

// 关闭弹窗
const closeCreatePictureModal = () => {
  isModalVisible.value = false
  // 调用子组件方法，清空状态
  addPictureFormRef.value?.resetFormState()
}

// 图片创建成功后的回调
const onPictureCreateSuccess = () => {
  Message.success({
    content: '图片创建成功！',
    closable: true,
  })
  closeCreatePictureModal()
  // 重置到第一页
  searchParams.pageNum = 1
  fetchData() // 刷新图片列表
  fetchSpaceDetail() // 重新获取空间详情，更新容量和进度条
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id,
    ...searchParams.value,
  }
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0 // 确保是数字
  } else {
    Message.error({
      content: '获取数据失败' + res.data.message,
      closable: true,
    })
  }
  loading.value = false
}

// 根据空间级别返回标志
const getSpaceBadge = (level: string | number) => {
  switch (level) {
    case 2:
      return '💎'
    case 1:
      return '🌟'
    case 0:
      return '📦'
    default:
      return ''
  }
}

// 根据空间级别返回文本
const getSpaceLevelText = (level: string | number) => {
  switch (level) {
    case 2:
      return '尊贵的旗舰版'
    case 1:
      return '优质的专业版'
    case 0:
      return '基础的普通版'
    default:
      return '未知级别'
  }
}

const onColorChange = async (color: string) => {
  const res = await searchPictureByColorUsingPost({
    picColor: color,
    spaceId: props.id,
  })
  if (res.data.code === 200 && res.data.data) {
    const data = res.data.data ?? []
    dataList.value = data
    total.value = data.length
  } else {
    Message.error('获取数据失败，' + res.data.message)
  }
}
</script>

<style scoped></style>
