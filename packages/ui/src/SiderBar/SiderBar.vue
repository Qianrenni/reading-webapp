<template>
  <div class="bg-card content-height py-6 scroll-container">
    <div
      v-for="item in menuStore.menuItems"
      :key="item.name"
      class="bg-hover-secondary siderbar-item flex flex-col items-center justify-center gap-1"
      :class="[
        {
          'active-common': menuStore.selectedItem === item.name,
        },
      ]"
      @click="handleClick(item)"
    >
      <QIcon :icon="item.icon ?? 'Copy'" :size="30" />
      <span class="siderbar-label">{{ item.name }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { QIcon } from 'qyani-components';
import { useMenuStore } from '@guga-reading/shares';
import type { MenuItem } from '@guga-reading/types';
import { useRouter } from 'vue-router';
defineOptions({ name: 'SiderBar' });
const menuStore = useMenuStore();
const router = useRouter();
const handleClick = (item: MenuItem) => {
  if (item.name === menuStore.selectedItem) {
    return;
  }
  menuStore.selectedItem = item.name;
  router.replace({ path: item.path });
};
</script>
<style scoped>
/* 标签：小于等于 3 字单行，超过 3 字自动换行（侧边栏保持窄） */
.siderbar-label {
  font-size: 0.8rem;
  line-height: 1.2;
  text-align: center;
  white-space: normal;
}
</style>
