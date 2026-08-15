import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-vue';
import EditableTitle from './EditableTitle.vue';

describe('EditableTitle', () => {
  it('无 modelValue 时以 placeholder 兜底显示', async () => {
    const screen = await render(EditableTitle, {
      props: { placeholder: '请输入章节标题' },
    });
    await expect.element(screen.getByText('请输入章节标题')).toBeVisible();
  });

  it('显示 modelValue 内容', async () => {
    const screen = await render(EditableTitle, {
      props: { modelValue: '第一章' },
    });
    await expect.element(screen.getByText('第一章')).toBeVisible();
  });

  it('modelValue 优先于 placeholder', async () => {
    const screen = await render(EditableTitle, {
      props: { modelValue: '第一章', placeholder: '占位' },
    });
    await expect.element(screen.getByText('第一章')).toBeVisible();
  });
});
