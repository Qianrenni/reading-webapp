import { get, patch, post } from '../utils';
import { AuthorApplication } from '@guga-reading/types';

export const useApiAuthorApplication = {
  prefix: '/author-application',

  /** 用户提交作者申请 */
  apply: async function (reason: string) {
    return await post<AuthorApplication>(`${this.prefix}`, { reason });
  },

  /** 用户查看自己的申请状态 */
  getMyApplication: async function () {
    return await get<AuthorApplication | null>(`${this.prefix}`);
  },

  /** 管理员获取所有申请（可按状态筛选） */
  getApplications: async function (status?: string) {
    return await get<AuthorApplication[]>(
      `${this.prefix}/admin${status ? `?status=${status}` : ''}`,
    );
  },

  /** 管理员审核通过 */
  approve: async function (id: number) {
    return await patch(`${this.prefix}/admin/${id}/approve`);
  },

  /** 管理员驳回 */
  reject: async function (id: number, rejectReason?: string) {
    return await patch(`${this.prefix}/admin/${id}/reject`, {
      rejectReason: rejectReason ?? null,
    });
  },
};
