<template>
  <div class="container container-h100">
    <aside v-show="!isMobile">
      <SiderBar />
    </aside>
    <RouterView />
  </div>
</template>
<script lang="ts" setup>
import { useScreenSize } from 'qyani-components';
import { SiderBar } from '@guga-reading/ui';
import { onMounted } from 'vue';
import { router } from '@/route';
defineOptions({ name: 'HomeView' });
const isMobile = useScreenSize.getWidth(768);
onMounted(() => {
  if (router.currentRoute.value.path === '/') {
    router.push('/my-book');
  }
});
</script>
<style scoped></style>
