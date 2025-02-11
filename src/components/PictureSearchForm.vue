<template>
  <div class="picture-search-form">
    <!-- 搜索表单 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="关键词" name="searchText">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="从名称和简介搜索"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="分类" name="category">
        <a-auto-complete
          v-model:value="searchParams.category"
          style="min-width: 180px"
          :options="categoryOptions"
          placeholder="请输入分类"
          allowClear
        />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="searchParams.tags"
          style="min-width: 180px"
          :options="tagOptions"
          mode="tags"
          placeholder="请输入标签"
          allowClear
        />
      </a-form-item>
      <a-form-item label="日期" name="">
        <a-range-picker
          style="width: 400px"
          show-time
          v-model:value="dateRange"
          :placeholder="['编辑开始日期', '编辑结束时间']"
          format="YYYY/MM/DD HH:mm:ss"
          :presets="rangePresets"
          @change="onRangeChange"
        />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value="searchParams.name" placeholder="请输入名称" allow-clear />
      </a-form-item>
      <a-form-item label="简介" name="introduction">
        <a-input v-model:value="searchParams.introduction" placeholder="请输入简介" allow-clear />
      </a-form-item>
      <a-form-item label="宽度" name="picWidth">
        <a-input-number v-model:value="searchParams.picWidth" min="0" />
      </a-form-item>
      <a-form-item label="高度" name="picHeight">
        <a-input-number v-model:value="searchParams.picHeight"  min="0"/>
      </a-form-item>
      <a-form-item label="格式" name="picFormat">
        <a-input v-model:value="searchParams.picFormat" placeholder="请输入格式" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" >搜索</a-button>
        <a-button html-type="reset" @click="doClear" style="margin-left: 10px">重置</a-button>
      </a-form-item>
      <!-- 按颜色搜索 -->
      <a-form-item label="按颜色搜索">
        <color-picker format="hex" @pureColorChange="onColorChange" />
      </a-form-item>
    </a-form>
  </div>

</template>



<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { onMounted, ref,reactive } from 'vue'
import PictureQueryRequest = API.PictureQueryRequest
import dayjs from 'dayjs'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import { listTagsUsingPost } from '@/api/biaoqianguanli.ts'
import { listCategoryUsingPost } from '@/api/fenleiguanli.ts'
import { searchPictureByColorUsingPost } from '@/api/tupianguanli.ts'

interface Props {
  onSearch?: (searchParams: PictureQueryRequest) => void
}

// 接收传递的 spaceId
const props = defineProps<{
  spaceId: string | number
}>();

const dataList = ref<API.ImageSearchResult[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({})

const dateRange = ref<[]>([])

const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

// 获取数据
const doSearch = () => {
  props.onSearch?.(searchParams)
}

/**
 * 日期范围更改时触发
 * @param dates
 * @param dateStrings
 */
const onRangeChange = (dates: any[], dateStrings: string[]) => {
  if (dates.length < 2) {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  } else {
    searchParams.startEditTime = dates[0].toDate()
    searchParams.endEditTime = dates[1].toDate()
  }
}

const rangePresets = ref([
  { label: '过去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '过去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '过去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '过去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
])



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

// 清理
const doClear = () => {
  // 取消所有对象的值
  Object.keys(searchParams).forEach((key) => {
    searchParams[key] = undefined
  })
  dateRange.value = []
  props.onSearch?.(searchParams)
}


// 颜色变化搜索
const onColorChange = async (color: string) => {
  const res = await searchPictureByColorUsingPost({
    picColor: color,
    spaceId: props.spaceId,
  })
  if (res.data.code === 200 && res.data.data) {
    const data = res.data.data ?? [];
    dataList.value = data;
    total.value = data.length;
  } else {
    Message.error('获取数据失败，' + res.data.message)
  }
}


onMounted(() => {
  getTagCategoryOptions()
})


</script>


<style scoped>
.picture-search-form .ant-form-item {
  margin-top: 16px;
}

</style>
