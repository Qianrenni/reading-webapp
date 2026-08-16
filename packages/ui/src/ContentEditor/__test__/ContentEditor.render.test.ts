import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-vue';
import { ContentEditor } from '../index';

describe('ContentEditor', () => {
  it('渲染字数统计', async () => {
    const screen = await render(ContentEditor, {
      props: { modelValue: '你好世界' },
    });
    await expect.element(screen.getByText('4 字')).toBeVisible();
  });

  it('空内容显示 0 字', async () => {
    const screen = await render(ContentEditor);
    await expect.element(screen.getByText('0 字')).toBeVisible();
  });

  it('应用紧凑模式类名', async () => {
    const screen = await render(ContentEditor, {
      props: { compact: true },
    });
    const root = screen.container.querySelector('.writing-editor');
    expect(root?.classList.contains('compact')).toBe(true);
  });
});
