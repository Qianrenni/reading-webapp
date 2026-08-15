import { defineStore } from 'pinia';
import type { MenuItem } from '@guga-reading/types';

/**
 * 菜单 store（author/admin 共用）
 * 菜单数据为各端业务配置，由应用启动时通过 `setMenuItems` 注入。
 */
export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuItems: [] as MenuItem[],
    selectedItem: '',
  }),
  actions: {
    setMenuItems(items: MenuItem[]) {
      this.menuItems = items;
    },
  },
});
