/**
 * 根据标签名称返回对应的颜色
 * @param tag 标签名称
 * @returns 标签对应的颜色
 */
export const getTagColor = (tag: string): string => {
  // 自定义标签与颜色映射表
  const tagColorMap: Record<string, string> = {
    热门: 'red', // 红色
    头像: 'gold', // 金色
    搞笑: 'orange', // 橙色
    生活: 'green', // 绿色（新颜色）
    高清: 'blue', // 蓝色
    艺术: 'purple', // 紫色
    校园: 'cyan', // 青色
    风景: 'geekblue', // 极客蓝（新标签）
    简历: 'magenta', // 品红色
    创意: 'volcano', // 火山色
    资料: 'lime', // 青柠色（新标签）
    临时: 'grey', // 灰色（修改为浅灰色）
  }
  // 如果标签存在映射颜色，则返回，否则默认返回 'default'
  return tagColorMap[tag] || 'default'
}

/**
 * 根据分类名称返回对应的深色颜色
 * @param category 分类名称
 * @returns 分类对应的颜色
 */
export const getCategoryColor = (category: string): string => {
  // 自定义分类与深色颜色映射表
  const categoryColorMap: Record<string, string> = {
    个人: '#1E90FF',          // 深蓝色
    模板: '#2E8B57',          // 深绿色
    星球: '#008B8B',          // 深青色
    面试题: '#CD5C5C',        // 深火山色
    表情包: '#DAA520',        // 深金色
    素材: '#6A5ACD',          // 深紫色
    学习: '#483D8B',          // 深蓝紫色
    Bugs: '#8B0000',          // 深红色
    动物: '#556B2F',          // 深橄榄绿
    海报: '#8B008B',          // 深品红
  }
  // 如果分类存在映射颜色，则返回，否则默认返回灰色
  return categoryColorMap[category] || '#555555'
}
