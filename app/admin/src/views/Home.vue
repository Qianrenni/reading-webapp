<template>
  <div class="container container-h100">
    <aside v-show="!isMobile">
      <SiderBar />
    </aside>
    <RouterView class="container-flex-1" />
  </div>
</template>
<script lang="ts" setup>
import { useScreenSize } from 'qyani-components';
import { SiderBar } from '@guga-reading/ui';
defineOptions({ name: 'HomeView' });
const isMobile = useScreenSize.getWidth(768);
</script>
<style scoped></style>
