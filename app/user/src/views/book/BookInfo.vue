<template>
  <div class="flex flex-row-768-column all mx-auto">
    <div class="flex flex-col gap-2 flex-1 left">
      <div class="flex gap-2 p-2 bg-card shadow-common w-full">
        <QLazyImage :src="book.cover" :width="width" :height="height" />
        <div class="text-secondary flex flex-col gap-2">
          <h3>{{ book.name }}</h3>
          <div class="flex flex-row-768-column gap-4">
            <div class="flex items-center">
              <QIcon icon="User" size="16px" />
              <h5>{{ book.author }}</h5>
            </div>
            <div class="flex items-center">
              <QIcon icon="Calender" size="16px" />
              <h5>{{ book.createdAt?.split('T')[0] }}</h5>
            </div>
          </div>
          <p
            v-if="book.tags"
            class="flex flex-wrap gap-2 p-2 text-muted text-085rem"
          >
            <QTag v-for="tag in book.tags.split(',')" :key="tag" :text="tag">
            </QTag>
          </p>
          <div class="flex flex-wrap text-08rem">
            <div class="flex gap-2 p-2">
              <QIcon icon="Book" size="16px" />
              <span>{{ book.totalChapter }} 章节</span>
            </div>
            <div class="flex gap-2 p-2">
              <QIcon icon="EyeOpen" size="16px" />
              <span>{{ readCount || 0 }}阅读</span>
            </div>
            <div class="flex gap-2 p-2">
              <QIcon icon="Star" size="16px" />
              <span>{{ favoriteCount || 0 }}收藏</span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full shadow-black bg-card">
        <QTab
          :list="['书籍简介', '目录']"
          class="w-full radius-xl"
          @select="(index) => (tabIndex = index)"
        >
        </QTab>
        <div
          v-if="tabIndex === 0"
          class="text-muted scroll-container"
          style="max-height: 300px"
        >
          <p
            v-for="line in book.description.split(/\s+/)"
            class="mx-4 text-indent-1rem"
          >
            {{ line }}
          </p>
        </div>
        <div
          v-if="tabIndex === 1"
          v-bind="containerProps"
          class="scroll-container catalog"
        >
          <div v-bind="wrapperProps">
            <p
              v-for="item in list"
              :key="item.data.id"
              style="height: 24px"
              class="bg-hover-secondary text-085rem px-2 py-1 mouse-cursor radius-sm"
              @click="
                () => router.push(`/book-read/${book.id}/${item.data.id}`)
              "
            >
              {{ item.data.title }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="right flex flex-col gap-2">
      <div class="bg-card flex flex-col gap-2 right shadow-common">
        <h4 class="text-left w-full px-2">相关推荐</h4>
        <div class="grid recommend right px-2 scroll-container">
          <div
            v-for="item in relatedBooks"
            :key="item.id"
            class="flex gap-2 items-center"
            @click="initial(item.id)"
          >
            <QLazyImage :src="item.cover" :height="96" :width="72" />
            <div class="flex-1 flex flex-col h-full">
              <p class="text-secondary">
                {{ item.name }}
              </p>
              <p
                :title="item.description"
                class="text-description text-08rem text-overflow text-indent-1rem"
              >
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBookStore } from '@/store';
import type { Book, Catalog } from '@guga-reading/types';
import { onBeforeMount, ref } from 'vue';
import {
  useWindowResize,
  QLazyImage,
  QIcon,
  QTab,
  QTag,
  useShowLoading,
} from 'qyani-components';
import { indexToCN, useApiBooks, useTitle } from '@guga-reading/shares';
import { useVirtualList } from '@vueuse/core';
import router from '@/route';
defineOptions({
  name: 'BookInfo',
});
const book = ref<Book>({
  id: 0,
  name: '',
  author: '',
  cover: '',
  description: '',
  category: '',
  tags: '',
  createdAt: '',
  totalChapter: 0,
} as Book);
const catalog = ref<Catalog[]>([] as Catalog[]);
const { list, containerProps, wrapperProps } = useVirtualList(catalog, {
  itemHeight: 24,
});
const height = ref(window.innerWidth < 768 ? 192 : 240);
const width = ref(window.innerWidth < 768 ? 144 : 180);
useWindowResize.addHandler((innerWidth) => {
  if (innerWidth < 768) {
    width.value = 144;
    height.value = 192;
  } else {
    width.value = 180;
    height.value = 240;
  }
});
const tabIndex = ref(0);
const readCount = ref(0);
const favoriteCount = ref(0);
const bookStore = useBookStore();
const relatedBooks = ref([] as Book[]);

const initial = async (bookId: number) => {
  useShowLoading.show();
  const [rawbook, rawcatalog] = await Promise.all([
    bookStore.getBookById(bookId),
    bookStore.getCatalogById(bookId),
  ]);
  book.value = rawbook;
  catalog.value = rawcatalog.map((item, index) => ({
    ...item,
    title: `第${indexToCN(index + 1)}章 ${item.title}`,
  }));
  useApiBooks
    .getRecommendBook(book.value.tags.split(',').join(' '))
    .then((result) => {
      relatedBooks.value = result.data!.filter((item) => item.id !== bookId);
    });
  const [rawReadCount, rawFavoriteCount] = await Promise.all([
    useApiBooks.getBookReadCount(bookId),
    useApiBooks.getBookFavoriteCount(bookId),
  ]);
  if (rawReadCount.success) readCount.value = rawReadCount.data!;
  if (rawFavoriteCount.success) favoriteCount.value = rawFavoriteCount.data!;
  useTitle(rawbook.name);
  useShowLoading.hide();
};
onBeforeMount(() => {
  const bookId = parseInt(router.currentRoute.value.params.id as string);
  initial(bookId);
});
</script>

<style scoped lang="css">
.all {
  width: 1200px;
}
.left {
  width: 750px;
}
.right {
  width: 450px;
}
.catalog {
  max-height: 300px;
}
.recommend {
  grid-template-columns: 100%;
  grid-template-rows: repeat(auto-fill, 96px);
  max-height: 600px;
}
@media screen and (max-width: 768px) {
  .all {
    width: 100%;
  }
  .left {
    width: 100%;
  }
  .right {
    width: 100%;
  }
}
</style>
