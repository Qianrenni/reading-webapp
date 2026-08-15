import { defineStore } from 'pinia';
import type { MenuItem } from '@guga-reading/types';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuItems: [
      {
        name: '仪表盘',
        path: '/dashboard',
        icon: 'Work',
      },
      {
        name: '书籍管理',
        path: '/book-manage',
        icon: 'Book',
      },
      {
        name: '稿件审核',
        path: '/draft-manage',
        icon: 'Draft',
      },
      {
        name: '作者审核',
        path: '/author-audit',
        icon: 'Star',
      },
      {
        name: '用户管理',
        path: '/user-manage',
        icon: 'AccountSetting',
      },
      {
        name: '权限管理',
        path: '/permission-manage',
        icon: 'Lock',
      },
      {
        name: '系统设置',
        path: '/system-setting',
        icon: 'SystemSetting',
      },
    ] satisfies MenuItem[],
    selectedItem: '',
  }),
});
