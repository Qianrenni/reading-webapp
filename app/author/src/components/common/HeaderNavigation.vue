<template>
  <header class="bg-card container header-container">
    <QIcon
      v-show="isMobile"
      icon="Menu"
      size="24"
      @click="showMenu = !showMenu"
    />
    <div class="container-center">
      <QAvatar url="/author/figure.webp" size="30px" />
      <span>{{ userStore.getUser?.userName || 'Author' }}</span>
      <QThemeToggle :size="24" />
    </div>
    <QDrawer v-model:visible="showMenu" direction="left">
      <SiderBar />
    </QDrawer>
  </header>
</template>
<script lang="ts" setup>
import {
  QDrawer,
  QAvatar,
  QThemeToggle,
  QIcon,
  useScreenSize,
} from 'qyani-components';
import SiderBar from '@/components/common/SiderBar.vue';
const isMobile = useScreenSize.getWidth(768);
import { useAuthStore } from '@/store';
import { ref } from 'vue';
const showMenu = ref(false);
const userStore = useAuthStore();
</script>
<style lang="css" scoped></style>
