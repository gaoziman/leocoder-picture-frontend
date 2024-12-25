// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 取消点赞图片 POST /api/like/cancelLike */
export async function cancelLikeUsingPost(body: API.LikeRequest, options?: { [key: string]: any }) {
  return request<API.ResultBoolean_>('/api/like/cancelLike', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 点赞图片 POST /api/like/like */
export async function likeUsingPost(body: API.LikeRequest, options?: { [key: string]: any }) {
  return request<API.ResultBoolean_>('/api/like/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
