import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-vue';
import BookItemSkeleton from '../BookItemSkeleton.vue';

describe('BookItemSkeleton', () => {
  it('渲染与 BookItem 一致的骨架布局（封面 + 三行文本）', async () => {
    const screen = await render(BookItemSkeleton, {
      props: { width: 90, height: 120 },
      global: { stubs: { QSkeleton: true } },
    });

    const container = screen.container;
    // 封面骨架块尺寸与传入 width/height 一致
    const cover = container.querySelector(
      '.skeleton-cover',
    ) as HTMLElement | null;
    expect(cover).not.toBeNull();
    expect(cover?.style.width).toBe('90px');
    expect(cover?.style.height).toBe('120px');

    // 右侧三行文本骨架（书名/作者/简介）
    const title = container.querySelector('.skeleton-title');
    const author = container.querySelector('.skeleton-author');
    const desc = container.querySelector('.skeleton-desc');
    expect(title).not.toBeNull();
    expect(author).not.toBeNull();
    expect(desc).not.toBeNull();
  });

  it('支持自定义封面尺寸', async () => {
    const screen = await render(BookItemSkeleton, {
      props: { width: 144, height: 192 },
      global: { stubs: { QSkeleton: true } },
    });

    const cover = screen.container.querySelector(
      '.skeleton-cover',
    ) as HTMLElement | null;
    expect(cover?.style.width).toBe('144px');
    expect(cover?.style.height).toBe('192px');
  });
});
