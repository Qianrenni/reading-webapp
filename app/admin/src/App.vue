<script setup lang="ts">
import { RouterView } from 'vue-router';
import router from './route';
import { watch } from 'vue';
import { excludePaths } from '@/config';
import { useAuthStore } from '@/store';
import HeaderNavigation from './components/common/HeaderNavigation.vue';
import { IconConfig } from 'qyani-components';
const authStore = useAuthStore();
IconConfig.setBase('/admin');
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      authStore.clearUser();
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
/*
 * 路由守卫
 * params:
 * to: 即将要进入的路由对象
 * from: 即将要离开的路由对象
 * next:    一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
 * next(): 进行管道中的下一个钩子。如果全部钩子执行完了,则导航的状态就是 confirmed (确认的)。
 * next(false): 中断当前的导航。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮),那么 URL 地址会重置到 from 路由对应的地址。
 * next('/') 或者 next({ name: 'login'}): 跳转到一个不同的地址。当前的导航被中断,然后进行一个新的导航。你可以向 next 传递任意位置对象,且允许设置诸如 replace: true、name: 'home'、params: { ... }、query: { ... }、hash: '#anchor'、fullPath: '/foo?bar=baz' 等字段
 * next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例,则导航会被 终止,并且该错误会被传递给 router.onError() 注册过的回调。
 * */
router.beforeEach((to, _, next) => {
  if (
    !authStore.isLogin &&
    !excludePaths.some((item) => to.path.startsWith(item))
  ) {
    authStore.setRedictUrl(to.fullPath);
    router.push('/login');
  }
  next();
});
watch(
  () => authStore.isLogin,
  (newValue) => {
    if (
      !newValue &&
      !excludePaths.some((item) =>
        router.currentRoute.value.path.startsWith(item),
      )
    ) {
      authStore.setRedictUrl(router.currentRoute.value.path);
      router.replace('/login');
    }
  },
);
</script>
<template>
  <div class="inner-container-column container-flex-1">
    <header-navigation />
    <router-view class="container-flex-1" />
  </div>
</template>
<style lang="css" scoped></style>
