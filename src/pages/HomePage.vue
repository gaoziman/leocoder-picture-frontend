<template>
  <div id="homePage">
    <!-- 搜索框 -->
    <div class="search-bar">
      <a-input-search
        placeholder="从海量图片中搜索"
        v-model:value="searchParams.searchText"
        enter-button="搜索"
        size="large"
        @search="doSearch"
      />
    </div>

    <a-button
      v-if="loginUserStore.loginUser.userRole === 'admin'"
      type="primary"
      size="middle"
      @click="refreshCache"
      target="_blank"
      >+ 刷新缓存
    </a-button>

    <!-- 排序功能 -->
    <div class="sort-bar">
      <span style="margin-right: 8px; font-size: 16px">筛选排序：</span>
      <a-select v-model:value="searchParams.sortField" style="width: 120px" @change="doSearch">
        <a-select-option value="createTime">最新发布</a-select-option>
        <a-select-option value="viewCount"> 最多浏览</a-select-option>
        <a-select-option value="likeCount">最多点赞</a-select-option>
        <a-select-option value="favoriteCount">最多收藏</a-select-option>
      </a-select>
    </div>

    <!-- 分类 + 标签 -->
    <a-tabs v-model:activeKey="selectedCategory" @change="doSearch">
      <a-tab-pane key="all" tab="全部" />
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category" />
    </a-tabs>
    <div class="tag-bar">
      <span style="margin-right: 8px">标签：</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTagList[index]"
          @change="doSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>
  </div>

  <!-- 图片列表 -->
  <PictureList :dataList="dataList" :loading="loading" source="public" style="margin-top: 20px" />
  <a-pagination
    style="text-align: right"
    v-model:pageNum="searchParams.pageNum"
    v-model:pageSize="searchParams.pageSize"
    :total="total"
    @change="onPageChange"
  />
</template>

<script setup lang="ts">
// 数据
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import PictureList from '@/components/PictureList.vue'
import { listPictureVoByPageWithCacheUsingPost, refreshCacheUsingPost } from '@/api/tupianguanli.ts'
import { useRouter } from 'vue-router'
import { listTagsUsingPost } from '@/api/biaoqianguanli.ts'
import { listCategoryUsingPost } from '@/api/fenleiguanli.ts'
import { useLoginUserStore } from '@/stores/user'
import { Message } from '@arco-design/web-vue'
import { useCacheStore } from '@/stores/cache'

const cacheStore = useCacheStore()
const router = useRouter()
const dataList = ref([])
const total = ref(0)
const loading = ref(true)

const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<string[]>([])
const loginUserStore = useLoginUserStore()

// 搜索条件
const searchParams = reactive<API.PictureQueryRequest>({
  pageNum: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const onPageChange = (page, pageSize) => {
  searchParams.pageNum = page
  searchParams.pageSize = pageSize
  fetchData()
}

// 页面加载时请求一次
onMounted(() => {
  getTagCategoryOptions()
  // 检查是否需要刷新缓存
  const { query } = router.currentRoute.value
  if (query.refreshCache === 'true') {
    refreshCache()
  }
  fetchData()
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    ...searchParams,
    tags: [],
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagList.value[index])
    }
  })
  const res = await listPictureVoByPageWithCacheUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = Number(res.data.data.total) ?? 0 // 确保是数字
  } else {
    Message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

const doSearch = () => {
  // 重置搜索条件
  searchParams.pageNum = 1
  fetchData()
}

// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await listTagsUsingPost({})
  if (res.data.code === 200 && res.data.data) {
    tagList.value = res.data.data.map((item) => item.name) ?? []
    selectedTagList.value = tagList.value.map(() => false) // 初始化标签选择状态
  } else {
    Message.error('加载分类标签失败，' + res.data.message)
  }
  const response = await listCategoryUsingPost({})
  if (response.data.code === 200 && response.data.data) {
    categoryList.value = response.data.data.records.map((item) => item.name) ?? []
  } else {
    Message.error('加载分类标签失败，' + res.data.message)
  }
}

// 刷新缓存
const refreshCache = async () => {
  const success = await cacheStore.refreshCacheList(searchParams)
  if (success) {
    // 如果刷新成功，重新加载数据
    fetchData()
  }
  // try {
  //   const res = await refreshCacheUsingPost({
  //     ...searchParams,
  //   })
  //   if (res.data.code === 200) {
  //     // 刷新数据
  //     fetchData()
  //     // 清理 query 参数
  //     router.replace({ path: router.currentRoute.value.path, query: {} })
  //   } else {
  //     Message.error('刷新缓存失败：', res.data.Message)
  //   }
  // } catch (error) {
  //   Message.error('刷新缓存失败，请重试')
  // }
}
</script>

<style scoped>
/* 页面基础样式 */
#homePage .search-bar {
  max-width: 480px;
  margin: 0 auto 16px;
}

#homePage .sort-bar {
  margin: 16px 0;
  text-align: left;
}
</style>
