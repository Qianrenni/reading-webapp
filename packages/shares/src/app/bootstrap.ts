import axios from 'axios';
import { watch } from 'vue';
import type { Router } from 'vue-router';
import { IconConfig } from 'qyani-components';
import type { MenuItem } from '@guga-reading/types';
import { useAuthStore } from '../store/useAuthStore';
import { useMenuStore } from '../store/useMenuStore';

/** 登录守卫模式：include=仅列出的路径需要登录；exclude=除列出的路径外都需要登录 */
export type AuthMode = 'include' | 'exclude';

export interface GugaAppOptions {
  /** 应用自身的路由实例 */
  router: Router;
  /** axios baseURL（通常传 import.meta.env.VITE_BASE_URL） */
  baseURL?: string;
  /** qyani 图标资源前缀，如 '/author'；不需要则不传 */
  iconBase?: string;
  /** 登录守卫模式 */
  authMode: AuthMode;
  /** include 模式：需要登录的路径前缀；exclude 模式：免登录路径前缀 */
  paths: string[];
  /** 页面标题默认值（to.meta.title 缺省时使用），默认 '咕嘎阅读' */
  titleSuffix?: string;
  /** 是否在路由切换时设置 document.title，默认 true（admin 保持原行为传 false） */
  setTitle?: boolean;
  /** 后台端菜单数据（author/admin 传入，user 端无需） */
  menuItems?: MenuItem[];
}

/**
 * 统一装配应用运行时：axios 配置、401 拦截器、qyani 图标前缀、
 * 登录路由守卫、登出监听、页面标题、后台菜单注入。
 * 需在 `app.use(createPinia())` 之后、`app.mount()` 之前调用。
 */
export function setupGugaApp(options: GugaAppOptions): void {
  const authStore = useAuthStore();
  if (options.baseURL) {
    axios.defaults.baseURL = options.baseURL;
  }
  axios.interceptors.response.use(
    (response) => {
      if (response.status === 401) {
        authStore.clearUser();
      }
      return response;
    },
    (error) => Promise.reject(error),
  );
  if (options.iconBase) {
    IconConfig.setBase(options.iconBase);
  }
  if (options.menuItems) {
    useMenuStore().setMenuItems(options.menuItems);
  }
  const { router } = options;
  const needAuth = (path: string) =>
    options.authMode === 'include'
      ? options.paths.some((p) => path.startsWith(p))
      : !options.paths.some((p) => path.startsWith(p));
  router.beforeEach((to, _from, next) => {
    if (!authStore.isLogin && needAuth(to.path)) {
      authStore.setRedirectUrl(to.fullPath);
      router.push('/login');
    }
    if (options.setTitle !== false) {
      document.title = `${to.meta.title ?? options.titleSuffix ?? '咕嘎阅读'}`;
    }
    next();
  });
  watch(
    () => authStore.isLogin,
    (newValue) => {
      if (!newValue && needAuth(router.currentRoute.value.path)) {
        authStore.setRedirectUrl(router.currentRoute.value.path);
        router.replace('/login');
      }
    },
  );
}
