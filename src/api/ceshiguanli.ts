// @ts-ignore
/* eslint-disable */
import request from '@/utils/request'

/** 测试接口 测试接口 GET /api/hello */
export async function helloUsingGet(options?: { [key: string]: any }) {
  return request<API.ResultString_>('/api/hello', {
    method: 'GET',
    ...(options || {}),
  })
}
