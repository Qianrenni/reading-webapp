import type { ReadSettings } from '@/types';
import { defineStore } from 'pinia';
const defaultReadSettings: ReadSettings = {
  fontSize: 16,
  lineHeight: 32,
  letterSpacing: 2,
  fontFamily: 'Arial, PingFangSC-Regular, Microsoft Yahei, SimSun',
  color: '#333333',
  backgroundColor: '#ffffff',
};
// 阅读设置
const READ_SETTING_STORAGE_KEY = 'READ_SETTING_KEY';
export const useReadSettingStore = defineStore('readSetting', {
  state: (): { readSettings: ReadSettings } => {
    const saved = localStorage.getItem(READ_SETTING_STORAGE_KEY);
    if (saved) {
      return { readSettings: JSON.parse(saved) };
    }
    return {
      readSettings: { ...defaultReadSettings },
    };
  },
  actions: {
    save() {
      localStorage.setItem(
        READ_SETTING_STORAGE_KEY,
        JSON.stringify(this.readSettings),
      );
    },
    updateReadSettings(settings: Partial<ReadSettings>) {
      this.readSettings = { ...this.readSettings, ...settings };
      this.save();
    },
    reset() {
      this.readSettings = { ...defaultReadSettings };
      this.save();
    },
  },
});
