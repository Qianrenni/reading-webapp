import { get, post, put, del, patch } from '../utils/request';
import type {
  Permission,
  Role,
  AdminUserResponse,
  UserRole,
  PageResult,
} from '@guga-reading/types';

export const useApiRight = {
  // ===== 权限 =====
  getPermissions: () => get<Permission[]>('/admin/permissions'),
  reloadPermissions: () => post<null>('/admin/permissions/reload'),

  // ===== 角色 =====
  getRoles: () => get<Role[]>('/admin/roles'),
  createRole: (data: { name: string; code: string; description?: string }) =>
    post<Role>('/admin/roles', data),
  updateRole: (id: number, data: { name?: string; description?: string }) =>
    put<Role>(`/admin/roles/${id}`, data),
  deleteRole: (id: number) => del<null>(`/admin/roles/${id}`),

  // ===== 角色权限 =====
  getRolePermissions: (roleId: number) =>
    get<Permission[]>(`/admin/roles/${roleId}/permissions`),
  assignRolePermissions: (roleId: number, permissionIds: number[]) =>
    post<null>(`/admin/roles/${roleId}/permissions`, { permissionIds }),
  revokeRolePermissions: (roleId: number, permissionIds: number[]) =>
    del<null>(`/admin/roles/${roleId}/permissions`, {
      data: { permissionIds },
    }),

  // ===== 角色继承 =====
  getRoleParents: (roleId: number) =>
    get<Role[]>(`/admin/roles/${roleId}/parents`),
  addRoleParent: (roleId: number, parentId: number) =>
    post<null>(`/admin/roles/${roleId}/parents`, { parentId }),
  removeRoleParent: (roleId: number, parentId: number) =>
    del<null>(`/admin/roles/${roleId}/parents?parentId=${parentId}`),

  // ===== 用户管理 =====
  getUsers: (page: number, size: number, keyword?: string) =>
    get<PageResult<AdminUserResponse>>('/admin/users', {
      params: { page, size, keyword },
    }),
  getUserDetail: (id: number) => get<AdminUserResponse>(`/admin/users/${id}`),
  updateUserStatus: (id: number, isActive: boolean) =>
    patch<null>(`/admin/users/${id}/status`, { isActive }),

  // ===== 用户角色 =====
  getUserRoles: (userId: number) =>
    get<UserRole[]>(`/admin/users/${userId}/roles`),
  addUserRole: (userId: number, roleId: number) =>
    post<null>(`/admin/users/${userId}/roles`, { roleId }),
  removeUserRole: (userId: number, roleId: number) =>
    del<null>(`/admin/users/${userId}/roles?roleId=${roleId}`),
};
