<template>
  <div>
    <QFormText
      v-model="form.name.value"
      :label="form.name.label"
      :placeholder="form.name.placeholder"
    />
    <QFormFileUpload
      v-model="form.cover.value"
      :label="form.cover.label"
      :placeholder="form.cover.placeholder"
      accept="image/*"
    />
    <QLazyImage
      v-if="previewImageSrc !== ''"
      :src="previewImageSrc"
      :height="144"
      :width="96"
      @click="dialogShow = true"
    />
    <QFormTextarea
      v-model="form.description.value"
      :label="form.description.label"
      :placeholder="form.description.placeholder"
    />
    <QFormText
      v-model="form.category.value"
      :label="form.category.label"
      :placeholder="form.category.placeholder"
    />
    <QFormText
      v-model="form.tags.value"
      :label="form.tags.label"
      :placeholder="form.tags.placeholder"
    />
  </div>
  <QDialog v-model:visible="dialogShow">
    <div>
      <img :src="previewImageSrc" alt="'封面'" />
    </div>
  </QDialog>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import type { BookMeta } from '@guga-reading/types';
import {
  QFormText,
  QFormFileUpload,
  QLazyImage,
  QDialog,
  QFormTextarea,
} from 'qyani-components';
defineOptions({ name: 'BookMeta' });
const props = withDefaults(defineProps<Partial<BookMeta>>(), {
  name: '',
  category: '',
  tags: '',
  cover: null,
  description: '',
});
const previewImageSrc = ref<string>('');
const dialogShow = ref(false);
const form = reactive({
  name: {
    value: props.name ?? '',
    label: '书名',
    placeholder: '请输入书名',
  },
  category: {
    value: props.category ?? '',
    label: '类别',
    placeholder: '请输入类别',
  },
  tags: {
    value: props.tags ?? '',
    label: '标签',
    placeholder: '请输入标签,用空格分隔',
  },
  cover: {
    value: null,
    label: '封面',
    placeholder: '上传封面',
  },
  description: {
    value: props.description ?? '',
    label: '简介',
    placeholder: '请输入简介',
  },
});
watch(
  () => props,
  () => {
    form.name.value = props.name ?? '';
    form.category.value = props.category ?? '';
    form.tags.value = props.tags ?? '';
    form.description.value = props.description ?? '';
    previewImageSrc.value = props.cover ?? '';
  },
  { deep: true },
);
watch(
  () => form.cover.value,
  (cover) => {
    if (cover) {
      previewImageSrc.value = URL.createObjectURL(cover);
    } else {
      previewImageSrc.value = '';
    }
  },
  { deep: true },
);
defineExpose({
  getForm() {
    return form;
  },
});
</script>
<style scoped></style>
