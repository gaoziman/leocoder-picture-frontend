/**
 * 根据标签名称返回对应的颜色
 * @param tag 标签名称
 * @returns 标签对应的颜色
 */
export const getTagColor = (tag: string): string => {
  // 自定义标签与颜色映射表
  const tagColorMap: Record<string, string> = {
    热门: 'red',
    搞笑: 'orange',
    生活: 'default',
    高清: 'blue',
    艺术: 'purple',
    校园: 'cyan',
    背景: 'geekblue',
    简历: 'magenta',
    创意: 'volcano',
    头像: 'gold',
    临时: 'black',
  }
  // 如果标签存在映射颜色，则返回，否则默认返回 'default'
  return tagColorMap[tag] || 'default'
}
