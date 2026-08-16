import { onBeforeMount, ref } from 'vue';
import { useApiAudit } from '@guga-reading/shares';
import { useShowLoading } from 'qyani-components';
import type { Book, BookChapter } from '@guga-reading/types';

/** 将书籍数组转换为 id → Book 的映射 */
export function buildBookMap(books: Book[]): Record<number, Book> {
  const map: Record<number, Book> = {};
  for (const book of books) {
    map[book.id] = book;
  }
  return map;
}

/**
 * 章节审核列表组合式函数
 * 从 Chapter.vue 中解耦，便于单元测试。
 */
export function useChapterAuditList() {
  const bookchapters = ref<BookChapter[]>([]);
  const bookMap = ref<Record<number, Book>>({});

  const load = () => {
    useShowLoading.show();
    Promise.all([
      useApiAudit.getAuditBookChapter().then((res) => {
        bookchapters.value = res.data ?? [];
      }),
      useApiAudit.getAuditBook().then((res) => {
        bookMap.value = buildBookMap(res.data ?? []);
      }),
    ]).finally(() => {
      useShowLoading.hide();
    });
  };

  onBeforeMount(load);

  return { bookchapters, bookMap, load };
}
