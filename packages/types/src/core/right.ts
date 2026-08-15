import { User } from './user';

/**
 * 权限
 */
export interface Permission {
  id: number;
  name: string;
  resourceType: string;
  action: string;
  scope: string;
  bitPosition: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 角色
 */
export interface Role {
  id: number;
  name: string;
  code: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 角色详情（含权限）
 */
export interface RoleDetail extends Role {
  permissions: Permission[];
  permissionCount?: number;
  userCount?: number;
}

/**
 * 用户角色信息
 */
export interface UserRole {
  userId: number;
  roleId: number;
  grantedBy: number | null;
  grantedAt: string;
}

/**
 * 管理后台用户响应（含角色）
 */
export interface AdminUserResponse {
  user: User;
  roles: UserRole[];
}

/**
 * 分页结果
 */
export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}
