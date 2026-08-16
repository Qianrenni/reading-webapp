<template>
  <div
    ref="bookReadContainer"
    class="w-full scroll-container"
    style="height: 100vh"
  >
    <div
      class="book-read-container mx-auto flex justify-center px-6 pb-6"
      :style="{
        backgroundColor: useReadingSetting.readSettings.backgroundColor,
      }"
    >
      <QLoading
        v-show="loading"
        style="height: 100vh; width: 100%"
        type="skeleton"
      />
      <article
        v-show="!loading"
        class="book-read-content"
        :style="{
          fontSize: `${useReadingSetting.readSettings.fontSize}px`,
          fontFamily: useReadingSetting.readSettings.fontFamily,
          lineHeight: `${useReadingSetting.readSettings.lineHeight}px`,
          letterSpacing: `${useReadingSetting.readSettings.letterSpacing}px`,
          color: useReadingSetting.readSettings.color,
        }"
        @click.stop="shwoBottomSettings = true"
      >
        <p
          v-for="(line, index) in content"
          :key="index"
          class="text-read-indent"
        >
          {{ line }}
          <span
            class="comment-icon-badge"
            :style="{
              fontSize: `${useReadingSetting.readSettings.fontSize * 0.6}px`,
              fontFamily: useReadingSetting.readSettings.fontFamily,
              color: useReadingSetting.readSettings.color,
            }"
            @click.stop="openLineComment(index)"
          >
            <template v-if="lineCommentCount(index) > 0">
              {{ commentBadgeText(lineCommentCount(index)) }}
            </template>
            <span v-else class="comment-icon-dots" aria-hidden="true">
              <i class="comment-dot" />
              <i class="comment-dot" />
              <i class="comment-dot" />
            </span>
          </span>
        </p>
      </article>
      <nav
        class="book-read-sidebar bg-card hidden-768 flex flex-col gap-2"
        aria-label="阅读工具栏"
      >
        <ul class="flex flex-col gap-2">
          <li
            class="flex flex-col items-center bg-hover-secondary"
            @click="
              currentContentIndex > 0
                ? run(computeCatalog[currentContentIndex - 1]?.id ?? 0)
                : void 0
            "
          >
            <QIcon icon="Up" size="24px" />
            <span class="text-08rem">上一章</span>
          </li>
          <li
            class="flex flex-col items-center bg-hover-secondary"
            @click="
              currentContentIndex < computeCatalog.length - 1
                ? run(computeCatalog[currentContentIndex + 1]?.id ?? 0)
                : void 0
            "
          >
            <QIcon icon="Down" size="24px" />
            <span class="text-08rem">下一章</span>
          </li>
          <li
            class="flex flex-col items-center bg-hover-secondary"
            @click="showCatalog = true"
          >
            <QIcon icon="Catalog" size="24px" />
            <span class="text-08rem">目录</span>
          </li>
          <li
            class="flex flex-col items-center bg-hover-secondary"
            @click="showReadSettings = true"
          >
            <QIcon icon="Setting" size="24px" />
            <span class="text-08rem">阅读设置</span>
          </li>
          <li
            class="flex flex-col items-center bg-hover-secondary"
            @click="router.push(`/book-detail/${book.id}`)"
          >
            <QIcon icon="Book" size="24px" />
            <span class="text-08rem">书籍详情</span>
          </li>
          <li class="flex flex-col items-center" @click="fullScreen">
            <QIcon icon="FullScreen" size="24px" />
            <span class="text-08rem">全屏</span>
          </li>
        </ul>
      </nav>
      <QDrawer
        v-model:visible="showCatalog"
        direction="left"
        :close-on-click-overlay="true"
        :overlay="false"
      >
        <div class="book-read-catalog-container">
          <h3 class="text-one-line">
            {{ book.name }}
          </h3>
          <p class="flex justify-between">
            <span>目录</span>
            <span
              class="mouse-cursor flex gap-4"
              @click="catalogAscOrder = !catalogAscOrder"
            >
              {{ catalogAscOrder ? '升序' : '降序' }}
              <QIcon
                icon="Switch"
                :style="{
                  transform: `rotateZ(90deg) rotateY(${catalogAscOrder ? 0 : 180}deg) `,
                }"
                size="16px"
              />
            </span>
          </p>
          <nav
            class="book-read-catalog scroll-container"
            v-bind="containerProps"
            aria-label="章节目录"
          >
            <div v-bind="wrapperProps">
              <p
                v-for="item in list"
                :key="item.data.id"
                class="bg-hover-secondary px-2 py-1 mouse-cursor radius-sm"
                :class="[
                  {
                    'active-common': item.data.id === currentContentId,
                  },
                ]"
                @click="
                  () => {
                    run(item.data.id);
                    showCatalog = false;
                  }
                "
              >
                {{ item.data.title }}
              </p>
            </div>
          </nav>
        </div>
      </QDrawer>
      <QDrawer
        :visible="shwoBottomSettings && isCanShowBottomSettings"
        direction="bottom"
        :show-close="false"
        :close-on-click-overlay="true"
        @close="shwoBottomSettings = false"
        :overlay="false"
      >
        <nav
          class="flex justify-between flex-wrap p-2"
          aria-label="阅读工具栏"
          @click="shwoBottomSettings = false"
        >
          <ul class="flex justify-between flex-wrap flex-1">
            <li
              class="flex flex-col items-center"
              @click="
                currentContentIndex > 0
                  ? run(computeCatalog[currentContentIndex - 1]?.id ?? 0)
                  : void 0
              "
            >
              <QIcon icon="Up" size="24px" />
              <span class="text-08rem">上一章</span>
            </li>
            <li
              class="flex flex-col items-center"
              @click="
                currentContentIndex < computeCatalog.length - 1
                  ? run(computeCatalog[currentContentIndex + 1]?.id ?? 0)
                  : void 0
              "
            >
              <QIcon icon="Down" size="24px" />
              <span class="text-08rem">下一章</span>
            </li>
            <li class="flex flex-col items-center" @click="showCatalog = true">
              <QIcon icon="Catalog" size="24px" />
              <span class="text-08rem">目录</span>
            </li>
            <li
              class="flex flex-col items-center"
              @click="showReadSettings = true"
            >
              <QIcon icon="Setting" size="24px" />
              <span class="text-08rem">阅读设置</span>
            </li>
            <li
              class="flex flex-col items-center"
              @click="router.push(`/book-detail/${book.id}`)"
            >
              <QIcon icon="Book" size="24px" />
              <span class="text-08rem">书籍详情</span>
            </li>
            <li class="flex flex-col items-center" @click="fullScreen">
              <QIcon icon="FullScreen" size="24px" />
              <span class="text-08rem">全屏</span>
            </li>
          </ul>
        </nav>
      </QDrawer>
      <QDrawer
        v-model:visible="showReadSettings"
        direction="left"
        :close-on-click-overlay="true"
        :overlay="false"
        @close="showReadSettings = false"
      >
        <ReadSetting />
      </QDrawer>
      <QDrawer
        v-model:visible="showComment"
        :direction="isMobile ? 'bottom' : 'right'"
        :close-on-click-overlay="true"
        :overlay="false"
        @close="showComment = false"
      >
        <div class="book-read-comment-drawer flex flex-col gap-2 p-2">
          <h4>本行评论</h4>
          <p v-if="currentLineText" class="text-muted text-08rem text-one-line">
            {{ currentLineText }}
          </p>
          <!-- 评论列表 -->
          <ul
            v-if="lineComments.length > 0"
            class="flex flex-col gap-2 scroll-container"
            style="max-height: 50vh"
          >
            <li
              v-for="comment in lineComments"
              :key="comment.id"
              class="flex gap-2 p-2 bg-hover-secondary radius-sm"
            >
              <QAvatar
                :url="comment.userAvatar || DEFAULT_AVATAR"
                size="32px"
              />
              <div class="flex-1 flex flex-col gap-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-08rem">{{ comment.userName }}</span>
                  <span class="text-muted text-08rem">
                    {{ comment.createdAt?.split('T')[0] }}
                  </span>
                </div>
                <p class="text-08rem comment-text">{{ comment.content }}</p>
              </div>
              <QFormButton
                v-if="
                  authStore.isLogin && comment.userId === authStore.getUser?.id
                "
                type="button"
                class="button-delete"
                @click="deleteLineComment(comment)"
              >
                删除
              </QFormButton>
            </li>
          </ul>
          <span v-else class="text-muted text-08rem"
            >暂无评论，快来发表第一条吧～</span
          >
          <!-- 发表评论 -->
          <div
            v-if="authStore.isLogin"
            class="flex flex-col gap-2 border-t p-2"
          >
            <QFormTextarea
              v-model="commentContent"
              :rows="2"
              maxlength="2000"
              placeholder="写下你的看法（2000字以内）"
            />
            <div class="flex justify-end">
              <QFormButton
                type="button"
                class="button-primary"
                @click="addLineComment"
              >
                发表评论
              </QFormButton>
            </div>
          </div>
          <span
            v-else
            class="text-muted text-08rem mouse-cursor"
            @click="router.push('/login')"
          >
            登录后可发表评论
          </span>
        </div>
      </QDrawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  useTemplateRef,
  watch,
} from 'vue';
import type {
  Book,
  BookChapterComment,
  Catalog,
  ChapterCommentsMap,
} from '@guga-reading/types';
import { useAuthStore, useBookStore, useReadSettingStore } from '@/store';
import { DEFAULT_AVATAR } from '@/constants';
import router from '@/route';
import {
  indexToCN,
  toggleFullScreen,
  useApiBooks,
  useApiComments,
  useTitle,
} from '@guga-reading/shares';
import { useScreenSize } from 'qyani-components';
import { useThrottle } from '@qianrenni/core';
import { useReadingHistoryStore } from '@/store';
import {
  QLoading,
  QIcon,
  QDrawer,
  QAvatar,
  QFormTextarea,
  QFormButton,
  useMessage,
} from 'qyani-components';
import { useApiReport } from '@guga-reading/shares';
import { ReadSetting } from '@/components/ReadSetting';
import { useVirtualList } from '@vueuse/core';
const fullScreen = toggleFullScreen();
const isMobile = useScreenSize.getWidth(768);
// 用于切换时滚动到顶部
const bookReadContainer = useTemplateRef<HTMLDivElement>('bookReadContainer');
// 是否显示评论
const showComment = ref<boolean>(false);
//
const currentCommentIndex = ref<number>(-1);
const authStore = useAuthStore();
// 当前章节行评论：行号 -> 评论列表
const chapterComments = ref<ChapterCommentsMap>({});
const commentContent = ref('');
// 当前行原文（评论抽屉顶部展示）
const currentLineText = computed(() => {
  const idx = currentCommentIndex.value;
  if (idx < 0 || idx >= content.value.length) return '';
  return content.value[idx];
});
// 当前行评论列表
const lineComments = computed<BookChapterComment[]>(
  () => chapterComments.value[currentCommentIndex.value] ?? [],
);
// 某行的评论数（用于行尾徽标）
const lineCommentCount = (line: number) =>
  chapterComments.value[line]?.length ?? 0;
// 行尾评论徽标文本：有评论显示数量（超过 99 显示 99+），无评论时由模板渲染省略圆点
const commentBadgeText = (count: number) =>
  count > 99 ? '99+' : String(count);
// 打开某行评论抽屉
const openLineComment = (index: number) => {
  currentCommentIndex.value = index;
  commentContent.value = '';
  showComment.value = true;
};
// 加载某章的行评论
const loadChapterComments = async (bookId: number, chapterId: number) => {
  const result = await useApiComments.getChapterComments(bookId, chapterId);
  // 防止慢响应覆盖新章节的评论
  if (result.success && chapterId === currentContentId.value) {
    chapterComments.value = result.data ?? {};
  }
};
// 发表行评论
const addLineComment = async () => {
  const contentText = commentContent.value.trim();
  if (!contentText) {
    useMessage.error('评论内容不能为空');
    return;
  }
  if (contentText.length > 2000) {
    useMessage.error('评论内容不能超过2000字');
    return;
  }
  const result = await useApiComments.createLineComment(
    book.value.id,
    currentContentId.value,
    currentCommentIndex.value,
    contentText,
  );
  if (result.success) {
    useMessage.success('评论发表成功');
    commentContent.value = '';
    await loadChapterComments(book.value.id, currentContentId.value);
  } else {
    useMessage.error(result.message);
  }
};
// 删除自己的行评论
const deleteLineComment = async (comment: BookChapterComment) => {
  const result = await useApiComments.deleteLineComment(
    book.value.id,
    comment.chapterId,
    comment.id,
  );
  if (result.success) {
    useMessage.success('评论已删除');
    await loadChapterComments(book.value.id, currentContentId.value);
  } else {
    useMessage.error(result.message);
  }
};
// 书籍信息
const book = ref<Book>({} as Book);
// 目录
const catalog = ref<Catalog[]>([] as Catalog[]);
// 书籍存储
const bookStore = useBookStore();
// 是否显示目录
const showCatalog = ref<boolean>(false);
// 当前内容
const content = ref<string[]>([]);
// 目录呈现顺序
const catalogAscOrder = ref(true);
// 当前内容对应的章节ID
const currentContentId = ref<number>(-1);
// 当前内容在目录中的索引
const currentContentIndex = computed(() => {
  const index = catalog.value.findIndex(
    (item) => item.id === currentContentId.value,
  );
  return index;
});
// 监听当前内容索引,并更新标题
watch(
  () => currentContentIndex.value,
  (index) => {
    const currentCatalog = catalog.value[index];
    if (currentCatalog) {
      useTitle(currentCatalog.title);
    }
    showComment.value = false;
  },
);
// 是否显示底部设置
const shwoBottomSettings = ref<boolean>(false);
// 是否显示阅读设置
const showReadSettings = ref<boolean>(false);
// 是否可以显示底部设置
const isCanShowBottomSettings = useScreenSize.getWidth(768);
// 阅读历史存储
const readingHistoryStore = useReadingHistoryStore();
// 目录
const computeCatalog = computed(() => {
  if (catalogAscOrder.value) {
    return catalog.value;
  } else {
    return [...catalog.value].reverse();
  }
});
const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(
  computeCatalog,
  { itemHeight: 30 },
);
watch(
  () => showCatalog.value,
  (show) => {
    if (show) {
      nextTick(() => {
        scrollTo(
          computeCatalog.value.findIndex(
            (item) => item.id === currentContentId.value,
          ) ?? 0,
        );
      });
    }
  },
);
const useReadingSetting = useReadSettingStore();
const heartBeat = {
  interval: 10000,
  timer: -1,
  task: async function () {
    if (currentContentId.value !== -1) {
      useApiReport.reportChapterRead(
        book.value.id,
        currentContentId.value,
        'heartbeat',
      );
    }
  },
  start: function () {
    this.stop();
    this.timer = setInterval(heartBeat.task, heartBeat.interval);
  },
  stop: function () {
    clearInterval(this.timer);
    this.timer = -1;
  },
};
const updateReadingHistory = useThrottle(
  async (bookId: number, chapterId: number, index: number) => {
    readingHistoryStore.update(bookId, chapterId, index);
  },
);
const loading = ref<boolean>(false);
/**
 * 加载章节内容
 * @param chapterId 章节ID
 */
const run = async (chapterId: number) => {
  // 如果当前内容ID等于要加载的内容ID,则返回,避免重复加载
  if (currentContentId.value === chapterId) {
    return;
  }
  loading.value = true;
  if (currentContentId.value !== -1) {
    // 上报离开当前章节
    useApiReport.reportChapterRead(
      book.value.id,
      currentContentId.value,
      'exit',
    );
    heartBeat.stop();
  }
  // 获取章节内容
  const { data } = await useApiBooks.getBookChapterById(
    book.value.id,
    chapterId,
  );
  const rawContent = data || '';
  // 处理章节内容
  const processedContent = rawContent.split('\n').map((item) => item.trim());
  // 更新实际显示内容
  content.value = processedContent;
  // 更新当前内容ID
  currentContentId.value = chapterId;
  // 加载该章行评论（异步，切章时自动更新）
  loadChapterComments(book.value.id, chapterId);
  // 更新阅读历史
  updateReadingHistory(book.value.id, chapterId, currentContentIndex.value + 1);
  // 上报阅读数据,进入新章节
  useApiReport.reportChapterRead(book.value.id, chapterId, 'enter');
  heartBeat.start();
  // 等待DOM更新
  await nextTick();
  // 滚动到顶部
  bookReadContainer.value?.scrollTo({
    top: 0,
    behavior: 'instant',
  });
  loading.value = false;
};
// 在挂载前执行
onBeforeMount(async () => {
  try {
    // 从路由参数获取书籍ID和内容ID
    const bookId = parseInt(router.currentRoute.value.params.bookId as string);
    const contentId = parseInt(
      router.currentRoute.value.params.contentId as string,
    );
    book.value.id = bookId;
    if (contentId !== -1) {
      //获取书籍信息和目录
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [rawBook, rawCatalog, _] = await Promise.all([
        bookStore.getBookById(bookId),
        bookStore.getCatalogById(bookId),
        run(contentId),
      ]);
      book.value = rawBook;
      catalog.value = rawCatalog.map((item, index) => ({
        ...item,
        title: `第${indexToCN(index + 1)}章 ${item.title}`,
      }));
    } else {
      //获取书籍信息和目录,然后获取第一个目录的内容
      const [rawBook, rawCatalog] = await Promise.all([
        bookStore.getBookById(bookId),
        bookStore.getCatalogById(bookId),
      ]);
      catalog.value = rawCatalog;
      book.value = rawBook;
      const firstCatalog = catalog.value[0];
      if (firstCatalog) {
        run(firstCatalog.id);
      }
    }
  } catch (e) {
    console.log(e);
  }
});
// 在卸载前上报离开当前章节
onBeforeUnmount(() => {
  if (currentContentId.value !== -1) {
    useApiReport.reportChapterRead(
      book.value.id,
      currentContentId.value,
      'exit',
    );
  }
  heartBeat.stop();
});
</script>

<style scoped lang="css">
.book-read-container {
  margin: 0 auto;
}

.book-read-content {
  max-width: 700px;
}

.book-read-sidebar {
  position: fixed;
  top: 50%;
  left: calc(50vw + 450px);
  transform: translateY(-50%);
}

.comment-icon-badge {
  vertical-align: middle;
  padding: 0 0.4em;
  border-radius: 1em;
  border: 1px solid var(--q-color-primary);
  line-height: 1.4;
  cursor: pointer;
  user-select: none;
}

.comment-icon-dots {
  display: inline-flex;
  align-items: center;
  gap: 0.2em;
}

.comment-dot {
  width: 0.24em;
  height: 0.24em;
  border-radius: 50%;
  background: currentColor;
}

.comment-text {
  word-break: break-all;
  white-space: pre-wrap;
}

.book-read-catalog-container {
  min-width: 480px;
}

.book-read-catalog {
  max-height: calc(100vh - 4.5rem);
}

/* 行评论抽屉（插槽内容）尺寸：PC 宽度不超过 35vw；手机高度不超过 70vh */
.book-read-comment-drawer {
  max-width: 35vw;
}

@media screen and (max-width: 768px) {
  .book-read-container {
    max-width: unset;
    width: 100%;
  }

  .book-read-content {
    max-width: unset;
    width: 100%;
  }

  .book-read-catalog-container {
    min-width: unset;
    width: 70vw;
  }

  .book-read-comment-drawer {
    max-width: unset;
    max-height: 70vh;
  }
}
</style>
