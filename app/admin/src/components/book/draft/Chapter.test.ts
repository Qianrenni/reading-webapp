// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';

vi.mock('@guga-reading/shares', () => ({
  useApiAudit: {
    getAuditBookChapter: vi.fn(),
    getAuditBook: vi.fn(),
  },
}));

vi.mock('@/route', () => ({
  default: { push: vi.fn() },
}));

vi.mock('qyani-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('qyani-components')>();
  return { ...actual, useShowLoading: { show: vi.fn(), hide: vi.fn() } };
});

import { useApiAudit } from '@guga-reading/shares';
import Chapter from './Chapter.vue';

describe('draft/Chapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('并行加载章节与书籍信息并填充 bookMap', async () => {
    vi.mocked(useApiAudit.getAuditBookChapter).mockResolvedValue({
      success: true,
      data: [{ id: 11, bookId: 1, title: '第一章', order: 1 }],
      message: null,
    });
    vi.mocked(useApiAudit.getAuditBook).mockResolvedValue({
      success: true,
      data: [{ id: 1, name: '书名', author: '作者' }],
      message: null,
    });

    const wrapper = mount(Chapter, {
      global: { stubs: { QFormTable: true, QIcon: true } },
    });
    await flushPromises();

    const vm = wrapper.vm as unknown as {
      bookchapters: { id: number; bookId: number }[];
      bookMap: Record<number, { name: string }>;
    };
    expect(vm.bookchapters).toHaveLength(1);
    expect(vm.bookchapters[0].bookId).toBe(1);
    expect(vm.bookMap[1]?.name).toBe('书名');
  });
});
