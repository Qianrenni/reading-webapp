import { describe, it, expect, vi, beforeEach } from 'vitest';

// right.ts 直接从 '../utils/request' 导入 http 方法
const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
  patch: vi.fn(),
}));

vi.mock('../utils/request', () => ({
  get: mocks.get,
  post: mocks.post,
  put: mocks.put,
  del: mocks.del,
  patch: mocks.patch,
}));

import { useApiRight } from './right';

describe('useApiRight', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.get.mockResolvedValue({ success: true, data: [], message: null });
    mocks.post.mockResolvedValue({ success: true, data: null, message: null });
    mocks.put.mockResolvedValue({ success: true, data: null, message: null });
    mocks.del.mockResolvedValue({ success: true, data: null, message: null });
    mocks.patch.mockResolvedValue({ success: true, data: null, message: null });
  });

  it('权限与角色查询', async () => {
    await useApiRight.getPermissions();
    expect(mocks.get).toHaveBeenCalledWith('/admin/permissions');

    await useApiRight.reloadPermissions();
    expect(mocks.post).toHaveBeenCalledWith('/admin/permissions/reload');

    await useApiRight.getRoles();
    expect(mocks.get).toHaveBeenCalledWith('/admin/roles');
  });

  it('角色增删改', async () => {
    await useApiRight.createRole({ name: 'x', code: 'X' });
    expect(mocks.post).toHaveBeenCalledWith('/admin/roles', {
      name: 'x',
      code: 'X',
    });

    await useApiRight.updateRole(1, { name: 'y' });
    expect(mocks.put).toHaveBeenCalledWith('/admin/roles/1', { name: 'y' });

    await useApiRight.deleteRole(1);
    expect(mocks.del).toHaveBeenCalledWith('/admin/roles/1');
  });

  it('角色权限分配', async () => {
    await useApiRight.getRolePermissions(1);
    expect(mocks.get).toHaveBeenCalledWith('/admin/roles/1/permissions');

    await useApiRight.assignRolePermissions(1, [1, 2]);
    expect(mocks.post).toHaveBeenCalledWith('/admin/roles/1/permissions', {
      permissionIds: [1, 2],
    });

    await useApiRight.revokeRolePermissions(1, [1]);
    expect(mocks.del).toHaveBeenCalledWith('/admin/roles/1/permissions', {
      data: { permissionIds: [1] },
    });
  });

  it('角色继承', async () => {
    await useApiRight.getRoleParents(1);
    expect(mocks.get).toHaveBeenCalledWith('/admin/roles/1/parents');

    await useApiRight.addRoleParent(1, 2);
    expect(mocks.post).toHaveBeenCalledWith('/admin/roles/1/parents', {
      parentId: 2,
    });

    await useApiRight.removeRoleParent(1, 2);
    expect(mocks.del).toHaveBeenCalledWith('/admin/roles/1/parents?parentId=2');
  });

  it('用户管理', async () => {
    await useApiRight.getUsers(1, 20, 'kw');
    expect(mocks.get).toHaveBeenCalledWith('/admin/users', {
      params: { page: 1, size: 20, keyword: 'kw' },
    });

    await useApiRight.getUserDetail(1);
    expect(mocks.get).toHaveBeenCalledWith('/admin/users/1');

    await useApiRight.updateUserStatus(1, false);
    expect(mocks.patch).toHaveBeenCalledWith('/admin/users/1/status', {
      isActive: false,
    });
  });

  it('用户角色', async () => {
    await useApiRight.getUserRoles(1);
    expect(mocks.get).toHaveBeenCalledWith('/admin/users/1/roles');

    await useApiRight.addUserRole(1, 2);
    expect(mocks.post).toHaveBeenCalledWith('/admin/users/1/roles', {
      roleId: 2,
    });

    await useApiRight.removeUserRole(1, 2);
    expect(mocks.del).toHaveBeenCalledWith('/admin/users/1/roles?roleId=2');
  });
});
