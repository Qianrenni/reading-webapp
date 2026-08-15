import { createRouter, createWebHistory } from 'vue-router';
const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      {
        path: 'book-manage',
        component: () => import('@/views/business/BookManage.vue'),
      },
      {
        path: 'user-manage',
        component: () => import('@/views/auth/UserManage.vue'),
      },
      {
        path: 'system-setting',
        component: () => import('@/views/system/SystemManage.vue'),
      },
      {
        path: 'permission-manage',
        component: () => import('@/views/auth/RightManage.vue'),
      },
      {
        path: 'draft-manage',
        component: () => import('@/views/business/DraftManage.vue'),
        children: [
          {
            path: 'book',
            name: 'DraftManageBook',
            component: () => import('@/components/book/draft/Book.vue'),
          },
          {
            path: 'chapter',
            name: 'DraftManageChapter',
            component: () => import('@/components/book/draft/Chapter.vue'),
          },
        ],
      },
      {
        path: 'chapter-audit',
        component: () => import('@/views/business/ChapterAudit.vue'),
      },
      {
        path: 'book-audit',
        component: () => import('@/views/business/BookAudit.vue'),
      },
      {
        path: 'author-audit',
        component: () => import('@/views/business/AuthorAudit.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/auth/LoginView.vue'),
  },
];
const router = createRouter({
  history: createWebHistory('/admin/'),
  routes,
});
export default router;
