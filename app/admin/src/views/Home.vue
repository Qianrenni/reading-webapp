<template>
  <div class="flex gap-2 p-2 h-full">
    <aside v-show="!isMobile">
      <SiderBar />
    </aside>
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>
<script lang="ts" setup>
import { useScreenSize } from 'qyani-components';
import { SiderBar } from '@guga-reading/ui';
defineOptions({ name: 'HomeView' });
const isMobile = useScreenSize.getWidth(768);
</script>
<style scoped></style>
