<template>
  <div class="container-column container-w100">
    <BackButton>返回</BackButton>
    <div class="inner-container-column shadow-common bg-card">
      <h3 class="text-center">创建新书</h3>
      <BookMeta ref="bookMeta" />
      <QFormButton type="submit" class="button-primary" @click="submit">
        <span>提交</span>
      </QFormButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BackButton from '@/components/common/BackButton.vue';
import { useMessage } from 'qyani-components';
import { transformImage, useApiAuthor } from '@guga-reading/shares';
import { useAuthStore } from '@/store';
import BookMeta from '@/components/book/BookMeta.vue';
import { QFormButton } from 'qyani-components';
import { useTemplateRef } from 'vue';
import { router } from '@/route';
defineOptions({
  name: 'CreateBook',
});
const refBookMeta = useTemplateRef('bookMeta');
const submit = async () => {
  const form = refBookMeta.value?.getForm();
  if (!form) {
    useMessage.error('获取数据失败');
    return;
  }
  const unsetFields = [];
  for (const item of Object.values(form)) {
    if (!item.value) {
      unsetFields.push(item.label);
    }
  }
  if (unsetFields.length > 0) {
    useMessage.info(`${unsetFields.join('、')} 未填写`);
    return;
  }
  let uploadCover: File | null = null;
  if (form.cover.value != null) {
    console.log('ImageSrc Size', (form.cover.value as File).size);
    const imageBlob = await transformImage(form.cover.value, 'webp', 0.3);
    uploadCover = new File([imageBlob], (form.cover.value as File).name, {
      type: 'image/webp',
    });
    console.log('UploadCover Size', uploadCover!.size);
  }
  useApiAuthor
    .createBook(
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
        useMessage.success('创建成功,请等待审核通过');
        router.back();
      } else {
        useMessage.error('创建失败');
      }
    });
};
</script>
<style lang="css" scoped></style>
