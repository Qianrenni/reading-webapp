<template>
  <header class="bg-card flex gap-2 p-2 header-container">
    <QIcon
      v-show="isMobile"
      icon="Menu"
      size="24"
      @click="showMenu = !showMenu"
    />
    <div class="flex items-center justify-center gap-2">
      <QAvatar :url="avatarUrl" size="30px" />
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
import { SiderBar } from '../SiderBar';
import { useAuthStore } from '@guga-reading/shares';
import { ref } from 'vue';
withDefaults(defineProps<{ avatarUrl?: string }>(), {
  avatarUrl: '/author/figure.webp',
});
const isMobile = useScreenSize.getWidth(768);
const showMenu = ref(false);
const userStore = useAuthStore();
</script>
<style lang="css" scoped></style>
