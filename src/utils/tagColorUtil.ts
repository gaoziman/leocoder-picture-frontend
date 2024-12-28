/**
 * 根据标签名称返回对应的颜色
 * @param tag 标签名称
 * @returns 标签对应的颜色
 */
export const getTagColor = (() => {
  // 已知标签与颜色映射表
  const tagColorMap: Record<string, string> = {
    热门: 'red',
    头像: 'gold',
    搞笑: 'orange',
    动漫风景: 'green',
    高清: 'blue',
    艺术: 'purple',
    校园: 'cyan',
    风景: 'geekblue',
    简历: 'magenta',
    创意: 'volcano',
    资料: 'lime',
    Mac壁纸: 'grey'
  };

  // 颜色池，循环分配颜色
  const colorPool = [
    'red', 'gold', 'orange', 'green', 'blue', 'purple', 'cyan', 'geekblue', 'magenta',
    'volcano', 'lime', 'grey', 'pink', 'yellow', 'brown', 'teal', 'indigo'
  ];
  let colorIndex = 0;

  // 返回标签颜色
  return (tag: string): string => {
    // 如果标签已有颜色，直接返回
    if (tagColorMap[tag]) {
      return tagColorMap[tag];
    }
    // 如果没有颜色，为其动态分配颜色
    const newColor = colorPool[colorIndex % colorPool.length];
    tagColorMap[tag] = newColor; // 缓存颜色
    colorIndex += 1; // 更新索引
    return newColor;
  };
})();
/**
 * 根据分类名称返回对应的深色颜色
 * @param category 分类名称
 * @returns 分类对应的颜色
 */
export const getCategoryColor = (category: string): string => {
  // 自定义分类与深色颜色映射表
  const categoryColorMap: Record<string, string> = {
    个人: '#1E90FF',          // 深蓝色
    动漫: '#2E8B57',          // 深绿色
    星球: '#008B8B',          // 深青色
    面试题: '#CD5C5C',        // 深火山色
    表情包: '#DAA520',        // 深金色
    素材: '#6A5ACD',          // 深紫色
    学习: '#483D8B',          // 深蓝紫色
    Bugs: '#8B0000',          // 深红色
    壁纸: '#4288a8',          // 深橄榄绿
    海报: '#8B008B',          // 深品红
  }
  // 如果分类存在映射颜色，则返回，否则默认返回灰色
  return categoryColorMap[category] || '#555555'
}
