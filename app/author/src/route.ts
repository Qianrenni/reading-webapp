import { createRouter, createWebHistory } from 'vue-router';

const routs = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/book/HomeView.vue'),
    children: [
      // {
      //     path: '/data-statistic',
      //     name: 'DataStatistic',
      //     component: () => import('./views/navigation/DataSumary.vue')
      // },
      {
        path: '/my-book',
        name: 'MyBook',
        component: () => import('./views/book/MyBook.vue'),
        meta: { title: '我的书' },
      },
      {
        path: '/draft-manage',
        name: 'DraftManage',
        component: () => import('./views/book/DraftManage.vue'),
        meta: { title: '草稿管理' },
      },
      {
        path: '/account-setting',
        name: 'AccountSetting',
        component: () => import('./views/navigation/AccountSetting.vue'),
        meta: { title: '账户设置' },
      },
      // {
      //     path: '/system-setting',
      //     name: 'SystemSetting',
      //     component: () => import('./views/navigation/SystemSetting.vue')
      // },
      {
        path: '/book-detail/:id',
        name: 'BookDetail',
        component: () => import('./components/book/BookDetail.vue'),
        meta: { title: '书籍详情' },
      },
      {
        path: '/book-edit',
        name: 'BookEdit',
        query: {
          bookId: 'bookId',
          sortOrder: 'sortOrder',
          hasDraft: 'hasDraft',
          chapterId: 'chapterId',
        },
        component: () => import('./views/book/BookEdit.vue'),
        meta: { title: '书籍编辑' },
      },
      {
        path: '/create-book',
        name: 'CreateBook',
        component: () => import('./views/book/CreateBook.vue'),
        meta: { title: '创建书籍' },
      },
      {
        path: '/edit/book-meta',
        name: 'BookInfoEdit',
        component: () => import('./views/book/BookInfoEdit.vue'),
        meta: { title: '书籍信息编辑' },
        query: { id: 'id', hasDraft: 'hasDraft' },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/auth/LoginView.vue'),
    meta: { title: '登录' },
  },
];
export const router = createRouter({
  history: createWebHistory('/author/'),
  routes: routs,
});
