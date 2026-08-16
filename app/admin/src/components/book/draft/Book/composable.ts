import { onBeforeMount, ref } from 'vue';
import { useApiAudit } from '@guga-reading/shares';
import type { Book } from '@guga-reading/types';

/** 仅保留未发布（非 PUBLISHED）的草稿书籍 */
export function filterUnpublishedBooks(books: Book[]): Book[] {
  return books.filter((item) => item.status !== 'PUBLISHED');
}

/**
 * 审核书籍草稿列表组合式函数
 * 从 Book.vue 中解耦，便于单元测试。
 */
export function useDraftBookList() {
  const books = ref<Book[]>([]);

  const load = () => {
    useApiAudit.getAuditBook().then((res) => {
      books.value = filterUnpublishedBooks(res.data ?? []);
    });
  };

  onBeforeMount(load);

  return { books, load };
}
