import { createApp } from 'vue';
import App from './App.vue';
import 'qyani-components/dist/style.css';
import '@guga-reading/ui/style.css';
import './private.css';
import { createPinia } from 'pinia';
import { router } from './route';
import { setupGugaApp } from '@guga-reading/shares';
import { excludePaths } from '@/config';
import type { MenuItem } from '@guga-reading/types';
const menuItems: MenuItem[] = [
  { name: '我的作品', path: '/my-book', icon: 'Work' },
  { name: '稿件管理', path: '/draft-manage', icon: 'Draft' },
  { name: '账号设置', path: '/account-setting', icon: 'AccountSetting' },
];
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
setupGugaApp({
  router,
  baseURL: import.meta.env.VITE_BASE_URL,
  iconBase: '/author',
  authMode: 'exclude',
  paths: excludePaths,
  menuItems,
});
app.mount('#app');
