<!-- EditableTitle.vue -->
<template>
  <p
    ref="titleRef"
    :contenteditable="!props.disabled"
    class="content-editor-like px-4 py-2 my-2 text-center"
    :title="props.placeholder"
    @input="handleInput"
    @blur="handleBlur"
    @keydown.enter.prevent="handleSubmit"
    @keydown.esc="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useThrottle } from '@qianrenni/core';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: '',
    placeholder: '',
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const titleRef = ref<HTMLParagraphElement | null>(null);

// 使用节流防止高频更新(可选,根据需求调整)
const emitUpdate = useThrottle((text: string) => {
  // 去除首尾空白,保留中间空格(标题允许空格)
  const trimmed = text.trim();
  if (trimmed !== props.modelValue) {
    emit('update:modelValue', trimmed);
  }
}, 300);

// 初始化内容
onMounted(() => {
  syncToDOM();
});

// 外部 modelValue 变化时安全更新 DOM(不干扰用户编辑)
watch(
  () => props.modelValue,
  () => {
    if (titleRef.value) {
      const currentText = titleRef.value.textContent || '';
      if (currentText !== props.modelValue) {
        syncToDOM();
      }
    }
  },
);

function syncToDOM() {
  if (!titleRef.value) return;
  // 显示 placeholder 逻辑
  const displayText = props.modelValue || props.placeholder;
  titleRef.value.textContent = displayText;
  // 如果是 placeholder,设为灰色(可选样式)
}

function handleInput() {
  if (titleRef.value) {
    const text = titleRef.value.textContent || '';
    emitUpdate(text);
  }
}

function handleBlur() {
  handleInput();
}

function handleSubmit() {
  titleRef.value?.blur();
}

function handleCancel() {
  // ESC 恢复原值
  syncToDOM();
  titleRef.value?.blur();
}
</script>
