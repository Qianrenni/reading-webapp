<template>
  <div class="container-column bg-card shadow-common">
    <div class="inner-container">
      <div>
        <QLazyImage :src="book.cover" :height="height" :width="width" />
      </div>
      <div class="inner-container-column">
        <h4>{{ book.name }}</h4>
        <div class="inner-container">
          <QIcon icon="User" size="16px" />
          <span class="text-08rem">{{ book.author }}</span>
        </div>
        <div class="hidden-768 inner-container-column text-08rem">
          <p>
            <span>分区</span>
            <span class="margin-rem">{{ book.category }}</span>
          </p>
          <p>
            <span>章节</span>
            <span class="margin-rem">{{ book.totalChapter }} 章</span>
          </p>
          <p>
            <span>字数</span>
            <span class="margin-rem">{{ book.wordsCount }} 字</span>
          </p>
          <p>
            <span>状态</span>
            <span class="margin-rem">{{ book.isEnded ? '完结' : '连载' }}</span>
          </p>
          <p>
            <span>上架时间</span>
            <span class="margin-rem">{{
              book.createdAt?.split('T').join(' ')
            }}</span>
          </p>
          <p>
            <span>更新时间</span>
            <span class="margin-rem">{{
              book.updatedAt?.split('T').join(' ')
            }}</span>
          </p>
        </div>
      </div>
    </div>
    <div
      class="show-768 container-wrap container-space-between gap-half text-08rem"
    >
      <p>
        <span>分区</span>
        <span class="margin-rem">{{ book.category }}</span>
      </p>
      <p>
        <span>章节</span>
        <span class="margin-rem">{{ book.totalChapter }} 章</span>
      </p>
      <p>
        <span>字数</span>
        <span class="margin-rem">{{ book.wordsCount }} 字</span>
      </p>
      <p>
        <span>状态</span>
        <span class="margin-rem">{{ book.isEnded ? '完结' : '连载' }}</span>
      </p>
      <p>
        <span>上架时间</span>
        <span class="margin-rem">{{
          book.createdAt?.split('T').join(' ')
        }}</span>
      </p>
      <p>
        <span>更新时间</span>
        <span class="margin-rem">{{
          book.updatedAt?.split('T').join(' ')
        }}</span>
      </p>
    </div>
    <div class="margin-vetical">
      <h4>书籍简介</h4>
      <p
        class="text-description text-inverse text-08rem margin-fourth-vetical bg-gray-100 padding-46rem"
      >
        {{ book.description }}
      </p>
    </div>
    <div>
      <h4>书籍标签</h4>
      <p class="margin-half-vetical">
        <Tag
          v-for="tag in book.tags?.split(',')"
          :key="tag"
          :text="tag"
          class="margin-fourth-horizontal"
        />
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import type { Book } from '@guga-reading/types';
import { useApiAuthor } from '@guga-reading/shares';
import { QLazyImage, useScreenSize, QIcon } from 'qyani-components';
import Tag from '../common/Tag.vue';
defineOptions({
  name: 'BookBasicInfo',
});
const props = defineProps<{
  bookId: number;
}>();
const book = ref<Book>({
  cover: '',
  id: 0,
  category: '',
  name: '',
  author: '',
  totalChapter: 0,
  description: '',
  isEnded: false,
  updatedAt: '',
} as Book);
const isMobile = useScreenSize.getWidth(768);
const width = computed(() => (isMobile.value ? 96 : 168));
const height = computed(() => (isMobile.value ? 128 : 224));
onBeforeMount(() => {
  useApiAuthor.getBook(props.bookId).then((res) => {
    if (res.success) {
      book.value = res.data[0]!;
    }
  });
});
</script>
