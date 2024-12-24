import { defineStore } from 'pinia'
import { ref } from 'vue'
import { addFavoriteUsingPost, removeFavoriteUsingPost } from '@/api/yonghushoucang.ts'

export const useFavoriteStore = defineStore('favorite', () => {
  // 存储图片的收藏数据（按图片ID存储）
  const favoriteData = ref<Record<number, { favoriteCount: number; isFavorited: boolean }>>({})

  // 收藏 /取消收藏
  async function toggleLike(pictureId: number) {
    // 初始化数据
    if (!favoriteData.value[pictureId]) {
      favoriteData.value[pictureId] = {
        favoriteCount: 0, // 默认收藏数量为 0
        isFavorited: false, // 默认未收藏
      }
    }

    const current = favoriteData.value[pictureId]

    try {
      if (!current.isFavorited) {
        // 点赞
        const res = await addFavoriteUsingPost({ pictureId })
        if (res.data.code === 200) {
          current.favoriteCount++
          current.isFavorited = true
        } else {
          console.error('收藏失败:', res.data.message)
        }
      } else {
        // 取消点赞
        const res = await removeFavoriteUsingPost({ pictureId })
        if (res.data.code === 200) {
          current.favoriteCount--
          current.isFavorited = false
        } else {
          console.error('取消收藏失败:', res.data.message)
        }
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  return { favoriteData, toggleLike }
})
