<template>
  <div id="searchPicturePage">
    <h2 style="margin-bottom: 16px">以图搜图</h2>
    <h3 style="margin: 16px 0">原图</h3>
    <a-card style="width: 240px">
      <template #cover>
        <img
          style="height: 180px; object-fit: cover"
          :alt="picture.name"
          :src="picture.thumbnailUrl ?? picture.url"
        />
      </template>
    </a-card>
    <h3 style="margin: 16px 0">识图结果</h3>

    <!-- 显示加载图标，直到所有图片加载完成 -->
    <a-spin v-if="loading" style="display: block; margin: 0 auto" />

    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
    >
      <template #renderItem="{ item }">
        <a-list-item style="padding: 0">
          <a :href="item.fromUrl" target="_blank">
            <a-card>
              <template #cover>
                <img style="height: 180px; object-fit: cover" :src="item.thumbUrl"  @load="onImageLoad" />
              </template>
            </a-card>
          </a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPictureVoByIdUsingGet, searchPictureByPictureUsingPost } from '@/api/tupianguanli.ts'
import { Message } from '@arco-design/web-vue'

const route = useRoute()

// 图片 id
const pictureId = computed(() => {
  return route.query?.pictureId
})

const picture = ref<API.PictureVO>({})

const dataList = ref<API.ImageSearchResult[]>([])

// 用于控制加载状态
const loading = ref(true)


// 页面加载时请求一次
onMounted(() => {
  fetchData()
  getOldPicture()
})


// 获取老数据
const getOldPicture = async () => {
  // 获取数据
  const id = route.query?.pictureId
  if (id) {
    const res = await getPictureVoByIdUsingGet({
      id: id,
    })
    if (res.data.code === 200 && res.data.data) {
      const data = res.data.data
      picture.value = data
    }
  }
}

// 获取搜图结果
const fetchData = async () => {
  const res = await searchPictureByPictureUsingPost({
    pictureId: pictureId.value,
  })
  if (res.data.code === 200 && res.data.data) {
    console.log(JSON.stringify(res.data.data))
    dataList.value = res.data.data ?? []
  } else {
    Message.error('获取数据失败，' + res.data.message)
  }
}

// 每个图片加载完成后，检查是否所有图片都已加载完成
const onImageLoad = () => {
  // 检查所有图片是否都已加载
  const images = document.querySelectorAll('img')
  const totalImages = images.length
  let loadedImages = 0

  images.forEach((image: HTMLImageElement) => {
    if (image.complete) {
      loadedImages++
    }
  })

  // 如果所有图片都加载完成，隐藏加载图标
  if (loadedImages === totalImages) {
    loading.value = false
  }
}

</script>



<style scoped>

</style>
