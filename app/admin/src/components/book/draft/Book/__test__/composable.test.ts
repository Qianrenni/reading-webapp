// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineComponent } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';

const mocks = vi.hoisted(() => ({
  getAuditBook: vi.fn(),
}));

vi.mock('@guga-reading/shares', () => ({
  useApiAudit: { getAuditBook: mocks.getAuditBook },
}));

import { filterUnpublishedBooks, useDraftBookList } from '../composable';
import type { Book } from '@guga-reading/types';

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

describe('filterUnpublishedBooks', () => {
  it('只保留未发布（非 PUBLISHED）的书籍', () => {
    const result = filterUnpublishedBooks([
      book(1, 'PUBLISHED'),
      book(2, 'PENDING'),
      book(3, 'REJECTED'),
    ]);
    expect(result.map((b) => b.id)).toEqual([2, 3]);
  });

  it('空列表返回空列表', () => {
    expect(filterUnpublishedBooks([])).toEqual([]);
  });
});

describe('useDraftBookList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('加载并过滤草稿书籍', async () => {
    mocks.getAuditBook.mockResolvedValue({
      success: true,
      data: [book(1, 'PUBLISHED'), book(2, 'PENDING')],
      message: null,
    });

    let ctx!: ReturnType<typeof useDraftBookList>;
    const Host = defineComponent({
      setup() {
        ctx = useDraftBookList();
        return () => null;
      },
    });
    mount(Host);
    await flushPromises();

    expect(ctx.books.value.map((b) => b.id)).toEqual([2]);
  });

  it('请求失败时书籍列表为空', async () => {
    mocks.getAuditBook.mockResolvedValue({
      success: false,
      data: null,
      message: 'err',
    });

    let ctx!: ReturnType<typeof useDraftBookList>;
    const Host = defineComponent({
      setup() {
        ctx = useDraftBookList();
        return () => null;
      },
    });
    mount(Host);
    await flushPromises();

    expect(ctx.books.value).toEqual([]);
  });
});
