import { defineStore } from 'pinia';
import type { MenuItem } from '@guga-reading/types';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuItems: [
      {
        name: '我的作品',
        path: '/my-book',
        icon: 'Work',
      },
      // {
      //     name: '数据统计',
      //     path: '/data-statistic',
      //     icon:'Statistic',
      // },
      {
        name: '稿件管理',
        path: '/draft-manage',
        icon: 'Draft',
      },
      {
        name: '账号设置',
        path: '/account-setting',
        icon: 'AccountSetting',
      },
      // {
      //     name: '系统设置',
      //     path: '/system-setting',
      //     icon: 'SystemSetting'
      // }
    ] satisfies MenuItem[],
    selectedItem: '',
  }),
});
