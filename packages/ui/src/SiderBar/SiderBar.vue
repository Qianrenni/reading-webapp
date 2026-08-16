<template>
  <nav class="bg-card content-height py-6 scroll-container" aria-label="主导航">
    <ul class="flex flex-col">
      <li
        v-for="item in menuStore.menuItems"
        :key="item.name"
        class="bg-hover-secondary siderbar-item flex flex-col items-center justify-center gap-1"
        :class="[
          {
            'active-common': menuStore.selectedItem === item.name,
          },
        ]"
      >
        <button
          type="button"
          class="siderbar-btn"
          :aria-current="
            menuStore.selectedItem === item.name ? 'page' : undefined
          "
          @click="handleClick(item)"
        >
          <QIcon :icon="item.icon ?? 'Copy'" :size="30" />
          <span class="siderbar-label">{{ item.name }}</span>
        </button>
      </li>
    </ul>
  </nav>
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

/* 语义化按钮：去除 button UA 默认样式，视觉与原可点击 div 一致 */
.siderbar-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
</style>
