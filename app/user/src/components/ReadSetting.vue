<template>
  <div class="container-column">
    <div class="inner-container container-center">
      <h3 class="text-center">阅读设置</h3>
      <QIcon icon="Refresh" size="16" title="恢复默认设置" @click="reset" />
    </div>

    <!-- 预设主题 -->
    <div class="inner-container-column">
      <p class="text-label">预设主题</p>
      <div class="inner-container container-w100 container-space-evenly">
        <div
          v-for="theme in themes"
          :key="theme.color"
          class="inner-container-column container-center"
          @click="updateTheme(theme)"
        >
          <span>{{ theme.label }}</span>
          <div
            class="theme-preset"
            :style="{
              backgroundColor: theme.backgroundColor,
              borderColor: theme.color,
            }"
          ></div>
        </div>
      </div>
    </div>
    <QFormSelect
      v-model="readSettings.fontFamily"
      label="字体"
      :required="false"
      direction="vertical"
      :options="fontOptions as unknown as Options[]"
    >
    </QFormSelect>
    <!-- 字体大小 -->
    <QFormRangeSlider
      v-model="readSettings.fontSize"
      :min="16"
      :max="32"
      label="字体大小"
      direction="vertical"
    />
    <QFormRangeSlider
      v-model="readSettings.lineHeight"
      :min="readSettings.fontSize"
      :max="readSettings.fontSize * 3"
      label="行高"
      direction="vertical"
    />
    <QFormRangeSlider
      v-model="readSettings.letterSpacing"
      :min="2"
      :max="4"
      label="字间距"
      direction="vertical"
    />
  </div>
</template>
<script lang="ts" setup>
import { fontOptions, themes } from '@/constant';
import { useReadSettingStore } from '@/store';
import type { ReadSettings } from '@/types';
import {
  QFormRangeSlider,
  QFormSelect,
  QIcon,
  type Options,
} from 'qyani-components';
import { ref, watch } from 'vue';
const useReadingSetting = useReadSettingStore();
const readSettings = ref<ReadSettings>({ ...useReadingSetting.readSettings });
const updateTheme = (theme: (typeof themes)[keyof typeof themes]) => {
  readSettings.value.color = theme.color;
  readSettings.value.backgroundColor = theme.backgroundColor;
};
const reset = () => {
  useReadingSetting.reset();
  readSettings.value = { ...useReadingSetting.readSettings };
};

watch(
  () => readSettings.value,
  (newSettings) => {
    useReadingSetting.updateReadSettings(newSettings);
  },
  { deep: true },
);
watch(
  () => readSettings.value.fontSize,
  (newFontSize, oldFontSize) => {
    readSettings.value.lineHeight += newFontSize - oldFontSize;
  },
  { deep: true },
);
</script>
<style lang="css" scoped>
.theme-preset {
  width: 2rem;
  height: 2rem;
  border: 2px solid #ddd;
}
</style>
