import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';

vi.mock('@/route', () => ({
  default: { push: vi.fn() },
}));

const mocks = vi.hoisted(() => ({
  books: [] as Array<{ id: number; name: string }>,
  load: vi.fn(),
}));

vi.mock('../composable', () => ({
  useDraftBookList: () => ({ books: mocks.books, load: mocks.load }),
}));

import Book from '../Book.vue';

const stubs = {
  QFormTable: {
    props: ['data'],
    template:
      '<div class="table-stub"><div v-for="row in data" :key="row.id" class="row">{{ row.name }}</div></div>',
  },
  QIcon: true,
};

describe('draft/Book', () => {
  beforeEach(() => {
    mocks.books = [];
    mocks.load.mockClear();
  });

  it('渲染草稿书籍列表', async () => {
    mocks.books = [
      { id: 2, name: '草稿书一' },
      { id: 3, name: '草稿书二' },
    ];
    const screen = await render(Book, { global: { stubs } });
    await expect.element(screen.getByText('草稿书一')).toBeVisible();
    await expect.element(screen.getByText('草稿书二')).toBeVisible();
  });
});
