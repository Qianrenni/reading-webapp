import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('./views/Index.vue'),
    meta: { title: '首页' },
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('./views/Home.vue'),
        meta: { title: '书城' },
      },
      {
        path: '/personal-center',
        name: 'PersonalCenter',
        component: () => import('./views/user/PersonalCenter.vue'),
        meta: { title: '个人中心' },
      },
      {
        path: '/history',
        name: 'BookStore',
        component: () => import('./views/book/ReadingHistory.vue'),
        meta: { title: '阅读历史' },
      },
      {
        path: '/book-shelf',
        name: 'BookShelf',
        component: () => import('./views/book/BookShelf.vue'),
        meta: { title: '书架' },
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('./views/auth/Login.vue'),
        meta: { title: '登录' },
      },
      {
        path: '/register',
        name: 'Register',
        meta: { title: '注册' },
        component: () => import('./views/auth/Register.vue'),
      },
      {
        path: '/book-detail/:id',
        name: 'BookDetail',
        component: () => import('./views/book/BookInfo.vue'),
        meta: { title: '书籍详情' },
      },
      {
        path: '/book-search',
        name: 'BookSearch',
        component: () => import('./views/book/BookSearch.vue'),
        meta: { title: '书籍搜索' },
      },
      {
        path: '/forget-password',
        name: 'ForgetPassword',
        component: () => import('./views/auth/ForgetPassword.vue'),
        meta: { title: '忘记密码' },
      },
      {
        path: '/update-password',
        name: 'UpdatePassword',
        component: () => import('./views/auth/UpdatePassword.vue'),
        meta: { title: '修改密码' },
      },
    ],
  },
  {
    path: '/book-read/:bookId/:contentId',
    name: 'BookRead',
    component: () => import('./views/book/BookRead.vue'),
    meta: { title: '书籍阅读' },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
