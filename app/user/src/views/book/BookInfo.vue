<template>
  <div class="flex container-row-768-column all mx-auto">
    <div class="flex flex-col gap-2 flex-1 left">
      <div class="flex gap-2 p-2 bg-card shadow-common w-full">
        <QLazyImage :src="book.cover" :width="width" :height="height" />
        <div class="text-secondary flex flex-col gap-2">
          <h3>{{ book.name }}</h3>
          <div class="flex container-row-768-column gap-4">
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
            <QTag v-for="tag in book.tags.split(/[, ]/)" :key="tag" :text="tag">
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
          :list="['书籍简介', '目录', '书评']"
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
        <!-- 书评 -->
        <div v-if="tabIndex === 2" class="flex flex-col gap-2 p-2">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <h4 class="text-left w-full px-2">书评（{{ reviewTotal }}）</h4>
            <QFormButton
              v-if="authStore.isLogin"
              type="button"
              class="button-primary"
              @click="openWriteReview"
            >
              <span>{{ myReview ? '编辑我的书评' : '写书评' }}</span>
            </QFormButton>
          </div>
          <div v-if="reviews.length > 0" class="flex flex-col gap-2">
            <div
              v-for="comment in reviews"
              :key="comment.id"
              class="flex gap-2 p-2 bg-hover-secondary radius-sm"
            >
              <QAvatar
                :url="comment.userAvatar || DEFAULT_AVATAR"
                size="36px"
              />
              <div class="flex-1 flex flex-col gap-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-085rem">{{ comment.userName }}</span>
                  <span class="text-muted text-08rem">
                    {{ comment.createdAt?.split('T')[0] }}
                  </span>
                </div>
                <p class="text-085rem comment-text">{{ comment.content }}</p>
              </div>
              <QFormButton
                v-if="
                  authStore.isLogin && comment.userId === authStore.getUser?.id
                "
                type="button"
                class="button-delete"
                @click="removeReview(comment)"
              >
                <span>删除</span>
              </QFormButton>
            </div>
          </div>
          <span v-else class="text-muted text-085rem px-2"
            >暂无书评，快来抢沙发吧～</span
          >
          <QPagination
            v-if="reviewTotal > 0"
            v-model:currentPage="reviewPage"
            :total-pages="reviewPages"
            class="self-center"
          />
        </div>
      </div>

      <!-- 写/编辑书评 对话框 -->
      <QDialog
        v-model:visible="writeReviewVisible"
        :show-footer="false"
        :close-on-click-overlay="false"
        :title="myReview ? '编辑书评' : '写书评'"
      >
        <QFormTextarea
          v-model="reviewContent"
          :rows="6"
          maxlength="300"
          placeholder="写下你对本书的评价（300字以内）"
        />
        <div class="flex justify-end gap-2 p-2">
          <QFormButton type="button" @click="writeReviewVisible = false"
            >取消</QFormButton
          >
          <QFormButton
            type="button"
            class="button-primary"
            @click="submitReview"
            >提交</QFormButton
          >
        </div>
      </QDialog>

      <!-- 删除书评 确认对话框 -->
      <QDialog
        v-model:visible="deleteReviewVisible"
        :show-footer="false"
        :close-on-click-overlay="false"
        title="删除书评"
      >
        <p class="p-2 text-085rem">确定删除这条书评吗？删除后不可恢复。</p>
        <div class="flex justify-end gap-2 p-2">
          <QFormButton type="button" @click="deleteReviewVisible = false"
            >取消</QFormButton
          >
          <QFormButton
            type="button"
            class="button-delete"
            @click="confirmDeleteReview"
            >删除</QFormButton
          >
        </div>
      </QDialog>
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
import { useAuthStore, useBookStore } from '@/store';
import { DEFAULT_AVATAR } from '@/constants';
import type { Book, BookComment, Catalog } from '@guga-reading/types';
import { computed, onBeforeMount, ref, watch } from 'vue';
import {
  useWindowResize,
  QLazyImage,
  QIcon,
  QTab,
  QTag,
  QAvatar,
  QPagination,
  QFormButton,
  QFormTextarea,
  QDialog,
  useShowLoading,
  useMessage,
} from 'qyani-components';
import {
  indexToCN,
  useApiBooks,
  useApiComments,
  useTitle,
} from '@guga-reading/shares';
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
const authStore = useAuthStore();
// ===== 书评 =====
const reviews = ref<BookComment[]>([]);
const reviewTotal = ref(0);
const reviewPage = ref(1);
const reviewSize = 5;
const reviewPages = computed(() =>
  Math.max(1, Math.ceil(reviewTotal.value / reviewSize)),
);
const myReview = ref<BookComment | null>(null);
const writeReviewVisible = ref(false);
const deleteReviewVisible = ref(false);
const reviewContent = ref('');
const targetReview = ref<BookComment | null>(null);

/** 加载书评列表 */
const loadReviews = async (bookId: number) => {
  const result = await useApiComments.getBookReviews(
    bookId,
    reviewPage.value,
    reviewSize,
  );
  if (result.success) {
    reviews.value = result.data!.items;
    reviewTotal.value = result.data!.total;
  }
};
/** 加载自己的书评（登录时） */
const loadMyReview = async (bookId: number) => {
  if (!authStore.isLogin) return;
  const result = await useApiComments.getMyBookReview(bookId);
  if (result.success) {
    myReview.value = result.data;
  }
};
/** 打开写/编辑书评对话框 */
const openWriteReview = () => {
  reviewContent.value = myReview.value?.content ?? '';
  writeReviewVisible.value = true;
};
/** 提交书评（发布/编辑） */
const submitReview = async () => {
  const content = reviewContent.value.trim();
  if (!content) {
    useMessage.error('评论内容不能为空');
    return;
  }
  if (content.length > 300) {
    useMessage.error('评论内容不能超过300字');
    return;
  }
  const result = await useApiComments.createBookReview(book.value.id, content);
  if (result.success) {
    useMessage.success(myReview.value ? '书评已更新' : '书评发布成功');
    writeReviewVisible.value = false;
    reviewPage.value = 1;
    await Promise.all([
      loadReviews(book.value.id),
      loadMyReview(book.value.id),
    ]);
  } else {
    useMessage.error(result.message);
  }
};
/** 打开删除确认 */
const removeReview = (comment: BookComment) => {
  targetReview.value = comment;
  deleteReviewVisible.value = true;
};
/** 确认删除自己的书评 */
const confirmDeleteReview = async () => {
  if (!targetReview.value) return;
  const result = await useApiComments.deleteBookReview(book.value.id);
  if (result.success) {
    useMessage.success('书评已删除');
    deleteReviewVisible.value = false;
    targetReview.value = null;
    await Promise.all([
      loadReviews(book.value.id),
      loadMyReview(book.value.id),
    ]);
  } else {
    useMessage.error(result.message);
  }
};
// 翻页重新加载
watch(reviewPage, () => loadReviews(book.value.id));

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
  loadReviews(bookId);
  loadMyReview(bookId);
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
.comment-text {
  word-break: break-all;
  white-space: pre-wrap;
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
