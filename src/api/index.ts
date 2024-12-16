// @ts-ignore
/* eslint-disable */
// API 更新时间：
// API 唯一标识：
import * as wenjianshangchuan from './wenjianshangchuan'
import * as ceshiguanli from './ceshiguanli'
import * as tupianguanli from './tupianguanli'
import * as yonghuguanli from './yonghuguanli'
import * as dengluguanli from './dengluguanli'
import { saveAs } from 'file-saver';

/**
 * 下载图片
 * @param url 图片下载地址
 * @param fileName 要保存为的文件名
 */
export function downloadImage(url?: string, fileName?: string) {
  if (!url) {
    return
  }
  saveAs(url, fileName)
}

/**
 * 格式化文件大小
 * @param size
 */
export const formatSize = (size?: number) => {
  if (!size) return '未知'
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

export default {
  wenjianshangchuan,
  ceshiguanli,
  tupianguanli,
  yonghuguanli,
  dengluguanli,
}
