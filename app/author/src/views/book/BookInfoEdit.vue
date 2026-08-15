<template>
  <div class="container-column container-w100">
    <BackButton>返回</BackButton>
    <div class="container-column shadow-common bg-card">
      <h3 class="text-center">编辑书籍详情</h3>
      <BookMeta ref="bookMeta" v-bind="props" />
      <QFormButton type="submit" class="button-primary" @click="submit">
        <span>提交</span>
      </QFormButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BackButton from '@/components/common/BackButton.vue';
import BookMeta from '@/components/book/BookMeta.vue';
import { QFormButton, useMessage } from 'qyani-components';
import { letIfNotNull } from '@qianrenni/core';
import { onBeforeMount, reactive, useTemplateRef } from 'vue';
import { router } from '@/route';
import type { Book, BookMeta as BookMetaType } from '@guga-reading/types';
import { transformImage, useApiAuthor } from '@guga-reading/shares';
import { useAuthStore } from '@/store';
const props = reactive<BookMetaType>({
  name: '',
  cover: null,
  description: '',
  category: '',
  tags: '',
});
const id = parseInt(router.currentRoute.value.query.id as string);
defineOptions({
  name: 'BookInfoEdit',
});
const refBookMeta = useTemplateRef('bookMeta');
const submit = async () => {
  const form = refBookMeta.value?.getForm();
  if (!form) {
    useMessage.error('获取数据失败');
    return;
  }
  const unsetFields = [];
  for (const [key, item] of Object.entries(form)) {
    if (!item.value && key !== 'cover') {
      unsetFields.push(item.label);
    }
  }
  if (unsetFields.length > 0) {
    useMessage.info(`${unsetFields.join('、')} 未填写`);
    return;
  }
  let uploadCover: File | null = null;
  if (form.cover.value != null) {
    const imageBlob = await transformImage(form.cover.value, 'webp', 0.3);
    uploadCover = new File([imageBlob], (form.cover.value as File).name, {
      type: 'image/webp',
    });
  }
  useApiAuthor
    .updateBook(
      id,
      form.name.value,
      useAuthStore().getUser!.userName,
      uploadCover!,
      form.description.value,
      form.category.value,
      form.tags.value
        .split(' ')
        .filter((tag) => tag != '')
        .join(' '),
    )
    .then((res) => {
      if (res.success) {
        useMessage.success('提交成功');
        router.back();
      } else {
        useMessage.error('提交失败请尝试减少图片大小');
      }
    });
};
onBeforeMount(() => {
  useApiAuthor.getBook().then((res) => {
    letIfNotNull<Book, void>(
      res.data.find((book) => book.id === id),
      (data: Book) => {
        props.name = data.name;
        props.cover = data.cover;
        props.description = data.description;
        props.category = data.category;
        props.tags = data.tags.split(',').join(' ');
      },
    );
  });
});
</script>
<style lang="css" scoped></style>
