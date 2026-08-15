/**
 * BookDetail 路由参数解析纯函数
 * 从 BookDetail.vue 中解耦，便于单元测试。
 */

/**
 * 从路由 params.id 解析书籍 ID
 * - string：parseInt 失败返回 null
 * - string[]：取首项解析
 * - number：原样返回
 * - 其他：null
 */
export function parseBookId(id: unknown): number | null {
  if (typeof id === 'string') {
    const numId = parseInt(id, 10);
    return isNaN(numId) ? null : numId;
  } else if (Array.isArray(id)) {
    const firstId = id[0];
    if (typeof firstId === 'string') {
      const numId = parseInt(firstId, 10);
      return isNaN(numId) ? null : numId;
    }
    return null;
  } else if (typeof id === 'number') {
    return id;
  }
  return null;
}
