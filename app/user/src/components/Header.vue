<script setup lang="ts">
import { QIcon, QThemeToggle, QSearch } from 'qyani-components';
import { useDebounce } from '@qianrenni/core';
import router from '@/route';
import { useBookSearchStore } from '@/store';
import { toggleFullScreen } from '@guga-reading/shares';
defineOptions({
  name: 'Header',
});
const bookSearchStore = useBookSearchStore();
const debounceSearchBook = useDebounce(bookSearchStore.searchBook, 100);
const run = toggleFullScreen();
</script>

<template>
  <header class="bg-card flex gap-2 p-2 header-container">
    <div class="flex gap-2 items-center">
      <router-link to="/" class="link-primary hidden-768">
        <h3>咕嘎阅读</h3>
      </router-link>
      <a
        href="http://49.235.107.221:8000/static/guga.apk"
        download
        target="_blank"
        class="link-primary"
      >
        <div class="flex gap-2 items-center">
          <QIcon icon="Mobile" size="24" class="mx-2" />
          <span class="hidden-768">移动端app</span>
        </div>
      </a>
    </div>
    <div class="flex gap-2 items-center container-768-w100">
      <div>
        <QSearch
          @click="router.push('/book-search')"
          @change="(value: string) => bookSearchStore.setSearchKey(value)"
          @search="() => debounceSearchBook()"
        />
      </div>
      <div class="flex gap-2 items-center flex-1 justify-end">
        <router-link to="/" class="link-primary flex gap-2 items-center">
          <QIcon icon="House" size="16" />
          <h4 class="hidden-768">书城</h4>
        </router-link>
        <router-link
          to="/book-shelf"
          class="link-primary flex gap-2 items-center"
        >
          <QIcon icon="Copy" size="16" />
          <h4 class="hidden-768">书架</h4>
        </router-link>
        <router-link to="/history" class="link-primary flex gap-2 items-center">
          <QIcon icon="History" size="16" />
          <h4 class="hidden-768">历史记录</h4>
        </router-link>
        <router-link
          to="/personal-center"
          class="link-primary flex gap-2 items-center"
        >
          <QIcon icon="User" size="16" />
          <h4 class="hidden-768">个人中心</h4>
        </router-link>
        <QIcon icon="FullScreen" size="16" @click="run" title="全屏模式" />
        <QThemeToggle size="18" title="切换日夜模式" />
      </div>
    </div>
  </header>
</template>

<style scoped lang="css">
.header-container {
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid var(--primary-color);
}
</style>
