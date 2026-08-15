<template>
  <div class="flex flex-col gap-2 p-2">
    <div class="flex gap-2 items-center justify-center">
      <h3 class="text-center">阅读设置</h3>
      <QIcon icon="Refresh" size="16" title="恢复默认设置" @click="reset" />
    </div>

    <!-- 预设主题 -->
    <div class="flex flex-col gap-2">
      <p class="text-label">预设主题</p>
      <div class="flex gap-2 items-center w-full justify-evenly">
        <div
          v-for="theme in themes"
          :key="theme.color"
          class="flex flex-col gap-2 items-center justify-center"
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
import { fontOptions, themes } from '@/constants';
import {
  QFormRangeSlider,
  QFormSelect,
  QIcon,
  type Options,
} from 'qyani-components';
import { useReadSetting } from './composable';

const { readSettings, updateTheme, reset } = useReadSetting();
</script>
<style lang="css" scoped>
.theme-preset {
  width: 2rem;
  height: 2rem;
  border: 2px solid #ddd;
}
</style>
