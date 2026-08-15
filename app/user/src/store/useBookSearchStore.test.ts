import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@guga-reading/shares', () => ({
  useApiBooks: {
    searchBook: vi.fn(),
  },
}));

import { useApiBooks } from '@guga-reading/shares';
import { useBookSearchStore } from './useBookSearchStore';

describe('useBookSearchStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('初始状态', () => {
    const store = useBookSearchStore();
    expect(store.searchKey).toBe('');
    expect(store.searchResult).toEqual([]);
    expect(store.loading).toBe(false);
  });

  it('setSearchKey 更新关键字', () => {
    const store = useBookSearchStore();
    store.setSearchKey('斗破');
    expect(store.getSearchKey).toBe('斗破');
  });

  it('空关键字不发起搜索', async () => {
    const store = useBookSearchStore();
    store.setSearchKey('   ');
    await store.searchBook();
    expect(useApiBooks.searchBook).not.toHaveBeenCalled();
  });

  it('搜索成功写入结果', async () => {
    vi.mocked(useApiBooks.searchBook).mockResolvedValue({
      success: true,
      data: [{ id: 1, name: '书' }],
      message: null,
    });
    const store = useBookSearchStore();
    store.setSearchKey('书');
    await store.searchBook();

    expect(useApiBooks.searchBook).toHaveBeenCalledWith('书');
    expect(store.searchResult).toEqual([{ id: 1, name: '书' }]);
    expect(store.loading).toBe(false);
  });

  it('搜索失败时清空 loading 且不写入结果', async () => {
    vi.mocked(useApiBooks.searchBook).mockResolvedValue({
      success: false,
      data: null,
      message: 'err',
    });
    const store = useBookSearchStore();
    store.setSearchKey('x');
    await store.searchBook();

    expect(store.searchResult).toEqual([]);
    expect(store.loading).toBe(false);
  });

  it('loading 期间不重复搜索', async () => {
    let resolveFn: (v: never) => void = () => {};
    vi.mocked(useApiBooks.searchBook).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFn = resolve as never;
        }),
    );
    const store = useBookSearchStore();
    store.setSearchKey('x');
    const first = store.searchBook();
    await store.searchBook(); // 第二次直接返回

    expect(useApiBooks.searchBook).toHaveBeenCalledTimes(1);
    resolveFn({} as never);
    await first;
  });
});
