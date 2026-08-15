export type StatusEnum =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'REVIEWING'
  | 'PUBLISHED';

/**
 * 状态枚举
    - pending: 搁置中
    - approved: 审核通过
    - rejected: 审核拒绝
    - reviewing: 审核中
 */
export const TranslationStatus: Record<StatusEnum, string> = {
  PENDING: '搁置',
  APPROVED: '审核通过',
  REJECTED: '审核拒绝',
  REVIEWING: '审核中',
  PUBLISHED: '已发布',
};

/**
 * 操作枚举
    - create: 创建
    - update: 修改
    - delete: 删除
 */
export type ActionEnum = 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH';
export const TranslationAction: Record<ActionEnum, string> = {
  CREATE: '创建',
  UPDATE: '修改',
  DELETE: '删除',
  PUBLISH: '发布',
};
