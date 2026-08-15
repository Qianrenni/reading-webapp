import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import type { MenuItem } from '@guga-reading/types';
import { useMenuStore } from './useMenuStore';

describe('useMenuStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('初始状态为空', () => {
    const store = useMenuStore();
    expect(store.menuItems).toEqual([]);
    expect(store.selectedItem).toBe('');
  });

  it('setMenuItems 注入菜单数据', () => {
    const store = useMenuStore();
    const items: MenuItem[] = [
      { name: '书籍管理', path: '/book', icon: 'book' },
      { name: '数据统计', path: '/statistic', icon: 'chart' },
    ];
    store.setMenuItems(items);
    // store 中 menuItems 为 reactive 代理，使用深比较
    expect(store.menuItems).toEqual(items);
    // 覆盖式注入
    store.setMenuItems([]);
    expect(store.menuItems).toEqual([]);
  });
});
