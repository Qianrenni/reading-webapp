import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import 'qyani-components/dist/style.css';
import './private.css';
import router from './route.ts';
import { setupGugaApp } from '@guga-reading/shares';
import { includePaths } from '@/config';
const app = createApp(App);
app.use(createPinia());
app.use(router);
setupGugaApp({
  router,
  baseURL: import.meta.env.VITE_BASE_URL,
  authMode: 'include',
  paths: includePaths,
});
app.mount('#app');
