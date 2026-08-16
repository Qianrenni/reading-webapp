import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import type { Book } from '@guga-reading/types';
import BookItem from '../BookItem.vue';

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div/>' } },
      { path: '/book-detail/:id', component: { template: '<div/>' } },
    ],
  });
}

describe('BookItem', () => {
  it('渲染书名、作者与简介', async () => {
    const screen = await render(BookItem, {
      props: {
        book: {
          id: 1,
          name: '斗破苍穹',
          author: '天蚕土豆',
          cover: '',
          description: '玄幻简介',
        } as Book,
        width: 100,
        height: 150,
      },
      global: { plugins: [makeRouter()], stubs: { QLazyImage: true } },
    });

    await expect.element(screen.getByText('斗破苍穹')).toBeVisible();
    await expect.element(screen.getByText('作者: 天蚕土豆')).toBeVisible();
    await expect.element(screen.getByText('玄幻简介')).toBeVisible();
  });

  it('点击跳转书籍详情页', async () => {
    const router = makeRouter();
    const screen = await render(BookItem, {
      props: {
        book: {
          id: 42,
          name: '我的书',
          author: 'a',
          cover: '',
          description: 'd',
        } as Book,
        width: 100,
        height: 150,
      },
      global: { plugins: [router], stubs: { QLazyImage: true } },
    });

    await screen.getByText('我的书').click();
    await vi.waitFor(() => {
      expect(router.currentRoute.value.path).toBe('/book-detail/42');
    });
  });
});
