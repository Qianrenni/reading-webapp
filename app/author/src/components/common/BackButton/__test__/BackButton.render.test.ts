import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-vue';

const mocks = vi.hoisted(() => ({
  back: vi.fn(),
}));

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>();
  return { ...actual, useRouter: () => ({ back: mocks.back }) };
});

import BackButton from '../BackButton.vue';

describe('BackButton', () => {
  it('默认显示“返回”', async () => {
    const screen = await render(BackButton, {
      global: { stubs: { QIcon: true } },
    });
    await expect.element(screen.getByText('返回')).toBeVisible();
  });

  it('支持自定义插槽内容', async () => {
    const screen = await render(BackButton, {
      slots: { default: '<span>返回书籍列表</span>' },
      global: { stubs: { QIcon: true } },
    });
    await expect.element(screen.getByText('返回书籍列表')).toBeVisible();
  });

  it('点击触发 router.back', async () => {
    const screen = await render(BackButton, {
      global: { stubs: { QIcon: true } },
    });
    await screen.getByText('返回').click();
    expect(mocks.back).toHaveBeenCalled();
  });
});
