// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 新增标签 POST /api/tag/add */
export async function addTagUsingPost(body: API.TagRequest, options?: { [key: string]: any }) {
  return request<API.ResultBoolean_>('/api/tag/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除标签 POST /api/tag/delete */
export async function deleteTagUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultBoolean_>('/api/tag/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取标签列表 POST /api/tag/get/list */
export async function listTagsUsingPost(options?: { [key: string]: any }) {
  return request<API.ResultListTag_>('/api/tag/get/list', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 分页获取标签列表 POST /api/tag/get/page/list */
export async function listTagsByPageUsingPost(
  body: API.TagRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageTag_>('/api/tag/get/page/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改标签 POST /api/tag/update */
export async function updateTagUsingPost(body: API.TagRequest, options?: { [key: string]: any }) {
  return request<API.ResultBoolean_>('/api/tag/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
