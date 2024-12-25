// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 新增评论 POST /api/comment/add */
export async function addCommentUsingPost(
  body: API.CommentAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultBoolean_>('/api/comment/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除评论 POST /api/comment/delete} */
export async function deleteCommentUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCommentUsingPOSTParams,
  options?: { [key: string]: any }
) {
  const { requestParam: param0, ...queryParams } = params
  return request<API.ResultBoolean_>('/api/comment/delete}', {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 分页获取评论列表 POST /api/comment/list/page/vo */
export async function getCommentPageUsingPost(
  body: API.CommentQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultIPageCommentVO_>('/api/comment/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 点赞/取消点赞评论 POST /api/comment/toggleLike */
export async function toggleLikeUsingPost(body: API.LikeRequest, options?: { [key: string]: any }) {
  return request<API.ResultBoolean_>('/api/comment/toggleLike', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
