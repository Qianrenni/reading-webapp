// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { defineComponent } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { themes } from '@/constants';
import { useReadSettingStore } from '@/store';
import { useReadSetting } from '../composable';

let ctx: ReturnType<typeof useReadSetting>;
const Host = defineComponent({
  setup() {
    ctx = useReadSetting();
    return ctx;
  },
  template: '<div />',
});

describe('useReadSetting', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('初始为默认设置', () => {
    mount(Host);
    expect(ctx.readSettings.value.fontSize).toBe(16);
    expect(ctx.readSettings.value.lineHeight).toBe(32);
    expect(ctx.readSettings.value.color).toBe('#333333');
  });

  it('updateTheme 更新文字色与背景色', async () => {
    mount(Host);
    ctx.updateTheme(themes.night);
    await flushPromises();

    expect(ctx.readSettings.value.color).toBe(themes.night.color);
    expect(ctx.readSettings.value.backgroundColor).toBe(
      themes.night.backgroundColor,
    );
    // 主题不修改字号
    expect(ctx.readSettings.value.fontSize).toBe(16);
  });

  it('本地改动自动同步回 store', async () => {
    mount(Host);
    ctx.readSettings.value.letterSpacing = 4;
    await flushPromises();
    expect(useReadSettingStore().readSettings.letterSpacing).toBe(4);
  });

  it('字号变化时行高联动', async () => {
    mount(Host);
    const before = ctx.readSettings.value.lineHeight; // 32
    ctx.readSettings.value.fontSize = 20; // +4
    await flushPromises();
    expect(ctx.readSettings.value.lineHeight).toBe(before + 4);
    expect(ctx.readSettings.value.fontSize).toBe(20);
  });

  it('reset 恢复默认并同步 store', async () => {
    mount(Host);
    ctx.updateTheme(themes.paper);
    ctx.readSettings.value.fontSize = 24;
    await flushPromises();

    ctx.reset();

    expect(ctx.readSettings.value).toEqual({
      fontSize: 16,
      lineHeight: 32,
      letterSpacing: 2,
      fontFamily: 'Arial, PingFangSC-Regular, Microsoft Yahei, SimSun',
      color: '#333333',
      backgroundColor: '#ffffff',
    });
    expect(useReadSettingStore().readSettings.fontSize).toBe(16);
  });
});
