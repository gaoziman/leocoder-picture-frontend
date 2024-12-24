// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 收藏图片 POST /api/favorite/add */
export async function addFavoriteUsingPost(
  body: API.FavoriteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultBoolean_>('/api/favorite/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}


/** 查询用户的收藏列表 GET /api/favorite/list */
export async function favoriteListUsingGet(options?: { [key: string]: any }) {
  return request<API.ResultListFavoritePictureVO_>('/api/favorite/list', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 取消收藏图片 POST /api/favorite/remove */
export async function removeFavoriteUsingPost(
  body: API.FavoriteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultBoolean_>('/api/favorite/remove', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
