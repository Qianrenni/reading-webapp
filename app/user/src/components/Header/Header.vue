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
      <router-link to="/" class="link-primary hidden-768" aria-label="返回首页">
        <h1 class="brand-title">咕嘎阅读</h1>
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
      <nav
        class="flex gap-2 items-center flex-1 justify-end"
        aria-label="主导航"
      >
        <ul class="flex gap-2 items-center">
          <li>
            <router-link to="/" class="link-primary flex gap-2 items-center">
              <QIcon icon="Book" size="16" />
              <h4 class="hidden-768">书城</h4>
            </router-link>
          </li>
          <li>
            <router-link
              to="/book-shelf"
              class="link-primary flex gap-2 items-center"
            >
              <QIcon icon="Catalog" size="16" />
              <h4 class="hidden-768">书架</h4>
            </router-link>
          </li>
          <li>
            <router-link
              to="/history"
              class="link-primary flex gap-2 items-center"
            >
              <QIcon icon="History" size="16" />
              <h4 class="hidden-768">历史记录</h4>
            </router-link>
          </li>
          <li>
            <router-link
              to="/personal-center"
              class="link-primary flex gap-2 items-center"
            >
              <QIcon icon="User" size="16" />
              <h4 class="hidden-768">个人中心</h4>
            </router-link>
          </li>
        </ul>
        <QIcon icon="FullScreen" size="16" @click="run" title="全屏模式" />
        <QThemeToggle size="18" title="切换日夜模式" />
      </nav>
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

/* 站名 h1：保留原 h3 的 UA 视觉（字号/字重/边距），语义化升级标签不改变外观 */
.brand-title {
  font-size: 1.17em;
  font-weight: bold;
  margin: 1em 0;
}
</style>
