// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';

vi.mock('@guga-reading/shares', () => ({
  useApiAudit: {
    getAuditBook: vi.fn(),
  },
}));

vi.mock('@/route', () => ({
  default: { push: vi.fn() },
}));

import { useApiAudit } from '@guga-reading/shares';
import type { Book } from '@guga-reading/types';
import Book from './Book.vue';

const book = (id: number, status: string): Book => ({
  id,
  name: `书${id}`,
  author: '作者',
  cover: '',
  description: '',
  category: '',
  totalChapter: 0,
  tags: '',
  createdAt: '',
  updatedAt: '',
  isActive: true,
  isEnded: false,
  wordsCount: 0,
  parentId: null,
  status: status as Book['status'],
});

describe('draft/Book', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('只保留未发布（非 PUBLISHED）的草稿书籍', async () => {
    vi.mocked(useApiAudit.getAuditBook).mockResolvedValue({
      success: true,
      data: [book(1, 'PUBLISHED'), book(2, 'PENDING'), book(3, 'REJECTED')],
      message: null,
    });

    const wrapper = mount(Book, {
      global: { stubs: { QFormTable: true, QIcon: true } },
    });
    await flushPromises();

    const vm = wrapper.vm as unknown as { books: ReturnType<typeof book>[] };
    expect(vm.books.map((b) => b.id)).toEqual([2, 3]);
  });

  it('请求失败时书籍列表为空', async () => {
    vi.mocked(useApiAudit.getAuditBook).mockResolvedValue({
      success: false,
      data: null,
      message: 'err',
    });

    const wrapper = mount(Book, {
      global: { stubs: { QFormTable: true, QIcon: true } },
    });
    await flushPromises();

    const vm = wrapper.vm as unknown as { books: ReturnType<typeof book>[] };
    expect(vm.books).toEqual([]);
  });
});
