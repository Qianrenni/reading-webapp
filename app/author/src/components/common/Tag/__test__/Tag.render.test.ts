import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-vue';
import Tag from '../Tag.vue';

describe('Tag', () => {
  it('渲染文本与默认样式', async () => {
    const screen = await render(Tag, { props: { text: '连载中' } });
    await expect.element(screen.getByText('连载中')).toBeVisible();

    const el = screen.container.querySelector('.tag') as HTMLElement | null;
    expect(el?.style.color).toBe('white');
    expect(el?.style.background).toBe('var(--tag-primary-color)');
  });

  it('支持自定义颜色与背景', async () => {
    const screen = await render(Tag, {
      props: { text: '已完结', color: '#ffffff', background: '#333333' },
    });
    const el = screen.container.querySelector('.tag') as HTMLElement | null;
    expect(el?.style.color).toBe('rgb(255, 255, 255)');
    expect(el?.style.background).toBe('rgb(51, 51, 51)');
  });
});
