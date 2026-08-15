import { get, post, put, patch } from '../utils';
import type { AdminBook, PageResult } from '@guga-reading/types';

export const useApiAdminBooks = {
  prefix: '/admin/books',

  /**
   * 分页获取所有书籍（管理员视图）
   */
  getBooks: (page: number, size: number, keyword?: string) =>
    get<PageResult<AdminBook>>(`${useApiAdminBooks.prefix}`, {
      params: { page, size, keyword },
    }),

  /**
   * 获取单本书籍详情
   */
  getBookById: (id: number) =>
    get<AdminBook>(`${useApiAdminBooks.prefix}/${id}`),

  /**
   * 更新书籍基本信息（multipart）
   */
  updateBook: (id: number, formData: FormData) =>
    put<null>(`${useApiAdminBooks.prefix}/${id}`, formData),

  /**
   * 上传书籍（metadata + TXT 文件）
   */
  uploadBook: (formData: FormData) =>
    post<number>(`${useApiAdminBooks.prefix}/upload`, formData),

  /**
   * 切换书籍激活状态
   */
  toggleBookStatus: (id: number, isActive: boolean) =>
    patch<null>(`${useApiAdminBooks.prefix}/${id}/status`, { isActive }),
};
