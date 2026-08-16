import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { themes } from '@/constants';

const mocks = vi.hoisted(() => ({
  updateTheme: vi.fn(),
  reset: vi.fn(),
}));

vi.mock('../composable', async () => {
  const { ref } = await import('vue');
  return {
    useReadSetting: () => ({
      readSettings: ref({
        fontSize: 16,
        lineHeight: 32,
        letterSpacing: 2,
        fontFamily: 'Arial, PingFangSC-Regular, Microsoft Yahei, SimSun',
        color: '#333333',
        backgroundColor: '#ffffff',
      }),
      updateTheme: mocks.updateTheme,
      reset: mocks.reset,
    }),
  };
});

import ReadSetting from '../ReadSetting.vue';

const qyaniStubs = {
  QFormRangeSlider: true,
  QFormSelect: true,
  QIcon: true,
};

describe('ReadSetting', () => {
  it('渲染四个预设主题标签', async () => {
    const screen = await render(ReadSetting, { global: { stubs: qyaniStubs } });
    for (const theme of Object.values(themes)) {
      await expect.element(screen.getByText(theme.label)).toBeVisible();
    }
  });

  it('点击主题触发 updateTheme', async () => {
    const screen = await render(ReadSetting, { global: { stubs: qyaniStubs } });
    await screen.getByText('夜间').click();
    expect(mocks.updateTheme).toHaveBeenCalled();
  });

  it('点击重置按钮触发 reset', async () => {
    const screen = await render(ReadSetting, { global: { stubs: qyaniStubs } });
    // 重置图标按钮 title="恢复默认设置"
    const resetBtn = screen.container.querySelector('q-icon-stub');
    resetBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(mocks.reset).toHaveBeenCalled();
  });
});
