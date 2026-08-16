import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';

vi.mock('@/route', () => ({
  default: { push: vi.fn() },
}));

const mocks = vi.hoisted(() => ({
  bookchapters: [] as Array<{ id: number; bookId: number; title: string }>,
  bookMap: {} as Record<number, { name: string }>,
  load: vi.fn(),
}));

vi.mock('../composable', () => ({
  useChapterAuditList: () => ({
    bookchapters: mocks.bookchapters,
    bookMap: mocks.bookMap,
    load: mocks.load,
  }),
}));

import Chapter from '../Chapter.vue';

const stubs = {
  QFormTable: {
    props: ['data'],
    template:
      '<div class="table-stub"><div v-for="row in data" :key="row.id" class="row">{{ row.title }}</div></div>',
  },
  QIcon: true,
};

describe('draft/Chapter', () => {
  beforeEach(() => {
    mocks.bookchapters = [];
    mocks.bookMap = {};
    mocks.load.mockClear();
  });

  it('渲染章节审核列表', async () => {
    mocks.bookchapters = [{ id: 11, bookId: 1, title: '第一章' }];
    const screen = await render(Chapter, { global: { stubs } });
    await expect.element(screen.getByText('第一章')).toBeVisible();
  });
});
