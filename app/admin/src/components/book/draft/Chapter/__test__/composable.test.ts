// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineComponent } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';

const mocks = vi.hoisted(() => ({
  getAuditBookChapter: vi.fn(),
  getAuditBook: vi.fn(),
}));

vi.mock('@guga-reading/shares', () => ({
  useApiAudit: {
    getAuditBookChapter: mocks.getAuditBookChapter,
    getAuditBook: mocks.getAuditBook,
  },
}));

vi.mock('qyani-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('qyani-components')>();
  return { ...actual, useShowLoading: { show: vi.fn(), hide: vi.fn() } };
});

import { buildBookMap, useChapterAuditList } from '../composable';

describe('buildBookMap', () => {
  it('将书籍数组转换为 id → Book 映射', () => {
    const map = buildBookMap([
      { id: 1, name: '书名一' } as never,
      { id: 2, name: '书名二' } as never,
    ]);
    expect(map[1]?.name).toBe('书名一');
    expect(map[2]?.name).toBe('书名二');
  });
});

describe('useChapterAuditList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('并行加载章节与书籍信息并填充 bookMap', async () => {
    mocks.getAuditBookChapter.mockResolvedValue({
      success: true,
      data: [{ id: 11, bookId: 1, title: '第一章', order: 1 }],
      message: null,
    });
    mocks.getAuditBook.mockResolvedValue({
      success: true,
      data: [{ id: 1, name: '书名', author: '作者' }],
      message: null,
    });

    let ctx!: ReturnType<typeof useChapterAuditList>;
    const Host = defineComponent({
      setup() {
        ctx = useChapterAuditList();
        return () => null;
      },
    });
    mount(Host);
    await flushPromises();

    expect(ctx.bookchapters.value).toHaveLength(1);
    expect(ctx.bookchapters.value[0]!.bookId).toBe(1);
    expect(ctx.bookMap.value[1]?.name).toBe('书名');
  });
});
