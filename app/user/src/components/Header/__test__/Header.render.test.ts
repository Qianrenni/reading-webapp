import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@/route', () => ({
  default: {
    push: vi.fn(),
    replace: vi.fn(),
    currentRoute: { value: { path: '/' } },
  },
}));

vi.mock('@guga-reading/shares', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@guga-reading/shares')>();
  return { ...actual, toggleFullScreen: () => vi.fn() };
});

vi.mock('@qianrenni/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@qianrenni/core')>();
  return {
    ...actual,
    // 去掉防抖，让搜索直接触发
    useDebounce: (fn: (...args: never[]) => unknown) => fn as never,
  };
});

import router from '@/route';
import Header from '../Header.vue';

const qyaniStubs = {
  QIcon: true,
  QThemeToggle: true,
  QSearch: true,
};

describe('Header', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('渲染品牌与导航链接', async () => {
    const screen = await render(Header, {
      global: { plugins: [createPinia()], stubs: qyaniStubs },
    });
    await expect.element(screen.getByText('咕嘎阅读')).toBeVisible();
    await expect.element(screen.getByText('书城')).toBeVisible();
    await expect.element(screen.getByText('书架')).toBeVisible();
    await expect.element(screen.getByText('历史记录')).toBeVisible();
  });

  it('点击搜索框跳转搜索页', async () => {
    const screen = await render(Header, {
      global: { plugins: [createPinia()], stubs: qyaniStubs },
    });
    const search = screen.container.querySelector('q-search-stub');
    search?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(router.push).toHaveBeenCalledWith('/book-search');
  });
});
