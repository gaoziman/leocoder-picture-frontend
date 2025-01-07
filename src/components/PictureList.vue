<template>
  <div class="picture-list">
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- 单张图片 -->
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img
                style="height: 180px; object-fit: cover"
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                loading="lazy"
              />
            </template>
            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag :color="getCategoryColor(picture.category)">
                    {{ picture.category ?? '默认' }}
                  </a-tag>
                  <a-tag v-for="tag in picture.tags" :key="tag" :color="getTagColor(tag)">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getCategoryColor, getTagColor } from '@/utils/tagColorUtil.ts'


interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  source?: 'public' | 'space'
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  source: 'public', // 默认值为公共图片
})

// 跳转至图片详情
const router = useRouter()
const doClickPicture = (picture) => {
  const query = props.source === 'space' ? { from: 'space' } : {}
  router.push({
    path: `/picture/${picture.id}`,
    query
  })
}
</script>

<style scoped></style>
