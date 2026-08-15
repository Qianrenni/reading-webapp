<template>
  <div class="bg-card content-height padding-vetical">
    <div
      v-for="item in menuStore.menuItems"
      :key="item.name"
      class="bg-hover-secondary siderbar-item container-align-center"
      :class="[
        {
          'active-common': menuStore.selectedItem === item.name,
        },
      ]"
      @click="handleClick(item)"
    >
      <QIcon :icon="item.icon ?? 'Copy'" :size="24" />
      <span>{{ item.name }}</span>
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
<style scoped></style>
