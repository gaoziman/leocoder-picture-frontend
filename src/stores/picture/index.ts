import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPictureVoByIdUsingGet } from '@/api/tupianguanli.ts'
import { likeUsingPost, cancelLikeUsingPost } from '@/api/yonghudianzan.ts'
import { addFavoriteUsingPost, removeFavoriteUsingPost } from '@/api/yonghushoucang.ts'

export const usePictureStore = defineStore('picture', () => {
  // 存储图片的完整信息（按图片ID存储）
  const pictureDetail = ref<Record<number, any>>({})
  // 存储图片的点赞数据（按图片ID存储）
  const pictureData = ref<Record<number, { likeCount: number; isLiked: boolean;favoriteCount: number; isFavorited: boolean }>>({})

  // 获取图片详情，并初始化点赞数据和完整信息
  async function fetchPictureDetail(pictureId: number) {
    try {
      const res = await getPictureVoByIdUsingGet({ id: pictureId })
      if (res.data.code === 200 && res.data.data) {
        const data = res.data.data
        // 存储完整的图片信息
        pictureDetail.value[pictureId] = data
        // 初始化点赞数据
        pictureData.value[pictureId] = {
          likeCount: data.likeCount || 0,
          isLiked: data.isLiked || false,
          favoriteCount: data.favoriteCount || 0,
          isFavorited: data.isFavorited || false,
        }
      } else {
        console.error('获取图片详情失败:', res.data.message)
      }
    } catch (error) {
      console.error('获取图片详情失败:', error)
    }
  }

  // 点赞/取消点赞功能
  async function toggleLike(pictureId: number) {
    if (!pictureData.value[pictureId]) {
      console.error('图片数据未初始化')
      return
    }

    const current = pictureData.value[pictureId]

    try {
      if (!current.isLiked) {
        // 点赞
        const res = await likeUsingPost({ pictureId ,likeType : 0})
        if (res.data.code === 200) {
          current.likeCount++
          current.isLiked = true
        } else {
          console.error('点赞失败:', res.data.message)
        }
      } else {
        // 取消点赞
        const res = await cancelLikeUsingPost({ pictureId,likeType : 0})
        if (res.data.code === 200) {
          current.likeCount--
          current.isLiked = false
        } else {
          console.error('取消点赞失败:', res.data.message)
        }
      }
    } catch (error) {
      console.error('操作失败:', error)
    }
  }

  // 收藏 /取消收藏功能
  async function toggleFavorite(pictureId: number) {
    if (!pictureData.value[pictureId]) {
      console.error('图片数据未初始化')
      return
    }

    const current = pictureData.value[pictureId]

    try {
      if (!current.isFavorited) {
        // 点赞
        const res = await addFavoriteUsingPost({ pictureId})
        if (res.data.code === 200) {
          current.favoriteCount++
          current.isFavorited = true
        } else {
          console.error('收藏失败:', res.data.message)
        }
      } else {
        // 取消点赞
        const res = await removeFavoriteUsingPost({ pictureId})
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

  return { pictureDetail, pictureData, fetchPictureDetail, toggleLike,toggleFavorite }
})
