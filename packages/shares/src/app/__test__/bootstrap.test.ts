// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import axios from 'axios';
import type { Router } from 'vue-router';

vi.mock('qyani-components', () => ({
  IconConfig: { setBase: vi.fn() },
}));

import { setupGugaApp } from '../bootstrap';
import { useAuthStore } from '../../store/useAuthStore';
import { useMenuStore } from '../../store/useMenuStore';
import { IconConfig } from 'qyani-components';

const setBaseMock = vi.mocked(IconConfig.setBase);

interface FakeRoute {
  path: string;
  fullPath: string;
  meta: Record<string, unknown>;
}

function createRouter() {
  let guard: ((to: FakeRoute, from: unknown, next: () => void) => void) | null =
    null;
  const router = {
    beforeEach: vi.fn(
      (cb: (to: FakeRoute, from: unknown, next: () => void) => void) => {
        guard = cb;
      },
    ),
    push: vi.fn(),
    replace: vi.fn(),
    currentRoute: { value: { path: '/', fullPath: '/', meta: {} } },
  } as unknown as Router & {
    beforeEach: ReturnType<typeof vi.fn>;
    push: ReturnType<typeof vi.fn>;
    replace: ReturnType<typeof vi.fn>;
  };
  const getGuard = () => guard;
  return { router, getGuard };
}

const route = (
  path: string,
  meta: Record<string, unknown> = {},
): FakeRoute => ({
  path,
  fullPath: path,
  meta,
});

describe('setupGugaApp 登录守卫', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    document.title = '';
  });

  it('include 模式：未登录访问受保护路径时跳转登录并记录回跳地址', () => {
    const { router, getGuard } = createRouter();
    setupGugaApp({
      router,
      authMode: 'include',
      paths: ['/book'],
      titleSuffix: '咕嘎阅读',
    });

    getGuard()!(route('/book/1'), {}, () => {});

    expect(router.push).toHaveBeenCalledWith('/login');
    expect(useAuthStore().redirectUrl).toBe('/book/1');
    expect(document.title).toBe('咕嘎阅读');
  });

  it('include 模式：已登录时不跳转', () => {
    const store = useAuthStore();
    store.setUser({ id: 1, userName: 'a' } as never);
    const { router, getGuard } = createRouter();
    setupGugaApp({ router, authMode: 'include', paths: ['/book'] });

    getGuard()!(route('/book/1'), {}, () => {});
    expect(router.push).not.toHaveBeenCalled();
  });

  it('exclude 模式：免登录路径不拦截，其余路径拦截', () => {
    const { router, getGuard } = createRouter();
    setupGugaApp({ router, authMode: 'exclude', paths: ['/login'] });

    getGuard()!(route('/login'), {}, () => {});
    expect(router.push).not.toHaveBeenCalled();

    getGuard()!(route('/book'), {}, () => {});
    expect(router.push).toHaveBeenCalledWith('/login');
  });

  it('meta.title 优先于 titleSuffix', () => {
    const { router, getGuard } = createRouter();
    setupGugaApp({
      router,
      authMode: 'include',
      paths: [],
      titleSuffix: '咕嘎阅读',
    });

    getGuard()!(route('/', { title: '章节详情' }), {}, () => {});
    expect(document.title).toBe('章节详情');
  });

  it('setTitle=false 时不修改页面标题', () => {
    document.title = 'OLD';
    const { router, getGuard } = createRouter();
    setupGugaApp({ router, authMode: 'include', paths: [], setTitle: false });

    getGuard()!(route('/', { title: '新标题' }), {}, () => {});
    expect(document.title).toBe('OLD');
  });

  it('设置 baseURL', () => {
    const { router } = createRouter();
    setupGugaApp({
      router,
      authMode: 'include',
      paths: [],
      baseURL: 'http://x/api',
    });
    expect(axios.defaults.baseURL).toBe('http://x/api');
  });

  it('iconBase 配置 qyani 图标前缀', () => {
    const { router } = createRouter();
    setupGugaApp({
      router,
      authMode: 'include',
      paths: [],
      iconBase: '/author',
    });
    expect(setBaseMock).toHaveBeenCalledWith('/author');
  });

  it('menuItems 注入菜单 store', () => {
    const items = [{ name: 'a', path: '/a', icon: 'i' }];
    const { router } = createRouter();
    setupGugaApp({ router, authMode: 'include', paths: [], menuItems: items });
    expect(useMenuStore().menuItems).toEqual(items);
  });

  it('注册 401 响应拦截器，命中时清除用户', () => {
    const store = useAuthStore();
    store.setUser({ id: 1, userName: 'a' } as never);

    const { router } = createRouter();
    setupGugaApp({ router, authMode: 'include', paths: [] });

    const handlers = (
      axios.interceptors.response as unknown as {
        handlers: { fulfilled: (res: { status: number }) => unknown }[];
      }
    ).handlers;
    const fulfilled = handlers.at(-1)?.fulfilled;
    expect(fulfilled).toBeTypeOf('function');

    fulfilled?.({ status: 401 });
    expect(store.isLogin).toBe(false);
  });
});
