// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useReadSettingStore } from './useReadSettingStore';

const KEY = 'READ_SETTING_KEY';
const defaultSettings = {
  fontSize: 16,
  lineHeight: 32,
  letterSpacing: 2,
  fontFamily: 'Arial, PingFangSC-Regular, Microsoft Yahei, SimSun',
  color: '#333333',
  backgroundColor: '#ffffff',
};

describe('useReadSettingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('无存储时返回默认设置', () => {
    const store = useReadSettingStore();
    expect(store.readSettings).toEqual(defaultSettings);
  });

  it('updateReadSettings 合并部分设置并写入 localStorage', () => {
    const store = useReadSettingStore();
    store.updateReadSettings({ fontSize: 20 });

    expect(store.readSettings.fontSize).toBe(20);
    // 未传字段保持默认
    expect(store.readSettings.lineHeight).toBe(32);

    const saved = JSON.parse(
      localStorage.getItem(KEY)!,
    ) as typeof defaultSettings;
    expect(saved.fontSize).toBe(20);
    expect(saved.lineHeight).toBe(32);
  });

  it('reset 恢复默认并写入 localStorage', () => {
    const store = useReadSettingStore();
    store.updateReadSettings({ fontSize: 20, color: '#000000' });
    store.reset();

    expect(store.readSettings).toEqual(defaultSettings);
    const saved = JSON.parse(
      localStorage.getItem(KEY)!,
    ) as typeof defaultSettings;
    expect(saved.fontSize).toBe(16);
  });

  it('从 localStorage 恢复设置', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ ...defaultSettings, fontSize: 22 }),
    );
    const store = useReadSettingStore();
    expect(store.readSettings.fontSize).toBe(22);
    expect(store.readSettings.lineHeight).toBe(32);
  });

  it('localStorage 数据损坏时回退默认', () => {
    localStorage.setItem(KEY, 'not-json');
    const store = useReadSettingStore();
    expect(store.readSettings).toEqual(defaultSettings);
  });
});
