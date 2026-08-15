import { ref, watch } from 'vue';
import { useReadSettingStore } from '@/store';
import type { ReadSettings } from '@/types';
import type { themes } from '@/constants';

/**
 * ReadSetting 阅读设置组合式函数
 * 从 ReadSetting.vue 中解耦，便于单元测试。
 *
 * 维护一份本地 readSettings 副本，改动自动同步回 store，
 * 且字号变化时联动行高。
 */
export function useReadSetting() {
  const store = useReadSettingStore();
  const readSettings = ref<ReadSettings>({ ...store.readSettings });

  /** 应用预设主题（仅覆盖文字色与背景色） */
  const updateTheme = (theme: (typeof themes)[keyof typeof themes]) => {
    readSettings.value.color = theme.color;
    readSettings.value.backgroundColor = theme.backgroundColor;
  };

  /** 恢复默认设置并重建本地副本 */
  const reset = () => {
    store.reset();
    readSettings.value = { ...store.readSettings };
  };

  // 本地设置任意变化时同步回 store
  watch(
    () => readSettings.value,
    (newSettings) => {
      store.updateReadSettings(newSettings);
    },
    { deep: true },
  );
  // 字号变化时行高随之联动（行高 = 原行高 + 字号增量）
  watch(
    () => readSettings.value.fontSize,
    (newFontSize, oldFontSize) => {
      readSettings.value.lineHeight += newFontSize - oldFontSize;
    },
    { deep: true },
  );

  return { readSettings, updateTheme, reset };
}
