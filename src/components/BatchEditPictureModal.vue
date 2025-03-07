<template>
  <a-modal v-model:visible="visible" title="批量编辑图片" :footer="false" @cancel="closeModal">
    <a-typography-paragraph type="secondary">* 只对当前页面的图片生效</a-typography-paragraph>
    <!-- 表单项 -->
    <a-form layout="vertical" :model="formData" @finish="handleSubmit">
      <a-form-item label="分类" name="category">
        <a-auto-complete
          v-model:value="formData.category"
          :options="categoryOptions"
          placeholder="请输入分类"
          allowClear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="formData.tags"
          :options="tagOptions"
          mode="tags"
          placeholder="请输入标签"
          allowClear
        />
      </a-form-item>
      <a-form-item label="命名规则" name="nameRule">
        <a-input
          v-model:value="formData.nameRule"
          placeholder="请输入命名规则，输入 {序号} 可动态生成"
        />
        <div class="dynamic-buttons">
          <a-button @click="insertDynamicVariable('{序号}')">序号</a-button>
          <a-button @click="insertDynamicVariable('{图片名称}')">图片名称</a-button>
          <a-button @click="insertDynamicVariable('{上传时间}')">上传时间</a-button>
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, ref, withDefaults, defineExpose, reactive, onMounted } from 'vue'
import { listTagsUsingPost } from '@/api/biaoqianguanli.ts'
import { listCategoryUsingPost } from '@/api/fenleiguanli.ts'
import { Message } from '@arco-design/web-vue'
import { editPictureByBatchUsingPost } from '@/api/tupianguanli.ts'

// 定义组件属性类型
interface Props {
  pictureList: API.PictureVO[]
  spaceId: number
  onSuccess: () => void
}

// 给组件指定初始值
const props = withDefaults(defineProps<Props>(), {})

// 控制弹窗可见性
const visible = ref(false)

// 打开弹窗
const openModal = () => {
  visible.value = true
}

// 关闭弹窗
const closeModal = () => {
  visible.value = false
}

// 暴露函数给父组件
defineExpose({
  openModal,
})

// 初始化表单数据
const formData = reactive({
  category: '', // 分类
  tags: [], // 标签
  nameRule: '', // 命名规则
})

const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

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

// 动态插入变量
const insertDynamicVariable = (variable: string) => {
  formData.nameRule += variable;
}

// 提交表单时处理
const handleSubmit = async (values: any) => {
  if (!props.pictureList) {
    return
  }
  const res = await editPictureByBatchUsingPost({
    pictureIdList: props.pictureList.map((picture) => picture.id),
    spaceId: props.spaceId,
    ...values,
  })
  if (res.data.code === 200 && res.data.data) {
    Message.success('操作成功')
    closeModal()
    props.onSuccess?.()
  } else {
    Message.error('操作失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})
</script>

<style scoped>
.dynamic-buttons {
  margin-top: 10px;
}

.dynamic-buttons a-button {
  margin-right: 8px;
}
</style>
