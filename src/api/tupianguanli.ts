// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 删除图片 POST /api/picture/delete */
export async function deletePictureUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultBoolean_>('/api/picture/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 编辑图片（给用户使用） POST /api/picture/edit */
export async function editPictureUsingPost(
  body: API.PictureEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultBoolean_>('/api/picture/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 根据 id 获取图片（仅管理员可用） GET /api/picture/get */
export async function getPictureByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPictureByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultPicture_>('/api/picture/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 根据 id 获取图片（封装类） GET /api/picture/get/vo */
export async function getPictureVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPictureVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.ResultPictureVO_>('/api/picture/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 分页获取图片列表（仅管理员可用） POST /api/picture/list/page */
export async function listPictureByPageUsingPost(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPagePicture_>('/api/picture/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页获取图片列表（封装类） POST /api/picture/list/page/vo */
export async function listPictureVoByPageUsingPost(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultPagePictureVO_>('/api/picture/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 初始化标签分类 GET /api/picture/tag_category */
export async function listPictureTagCategoryUsingGet(options?: { [key: string]: any }) {
  return request<API.ResultPictureTagCategory_>('/api/picture/tag_category', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 更新图片（仅管理员可用） POST /api/picture/update */
export async function updatePictureUsingPost(
  body: API.PictureUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.ResultBoolean_>('/api/picture/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 上传图片（可重新上传） POST /api/picture/upload */
export async function uploadPictureUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadPictureUsingPOSTParams,
  body: {},
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.ResultPictureVO_>('/api/picture/upload', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}
