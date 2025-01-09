// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 新增分类 POST /api/category/add */
export async function addCategoryUsingPost(
  body: API.CategoryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultBoolean_>('/api/category/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除分类 POST /api/category/delete */
export async function deleteCategoryUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultBoolean_>('/api/category/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 获取分类列表 POST /api/category/get/list */
export async function listCategoryUsingPost(options?: { [key: string]: any }) {
  return request<API.ResultListCategory_>('/api/category/get/list', {
    method: 'POST',
    ...(options || {}),
  })
}

/** 分页获取分类列表 POST /api/category/get/page/list */
export async function listCategoryByPageUsingPost(
  body: API.CategoryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPageCategory_>('/api/category/get/page/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 修改分类 POST /api/category/update */
export async function updateCategoryUsingPost(
  body: API.CategoryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultBoolean_>('/api/category/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
