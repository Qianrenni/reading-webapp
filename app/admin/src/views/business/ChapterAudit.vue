<template>
  <div class="container-column container-w100 container-h100">
    <div class="show-768" v-if="isUpdate">
      <QFormSelect v-model="select" :options="options" />
    </div>
    <div class="inner-container container-flex-1">
      <div
        class="inner-container-column container-flex-1 container-h100"
        v-if="isUpdate && !isMobile"
      >
        <p v-if="isUpdate && !isMobile">修改前</p>
        <EditableTitle v-model="srcChapter.title" :disabled="true" />
        <ContentEditor
          v-model="srcContent"
          :disabled="true"
          content-height="calc(100vh - 15.5rem)"
        />
      </div>
      <div class="inner-container-column container-flex-1 container-h100">
        <p v-if="isUpdate && !isMobile">修改后</p>
        <EditableTitle v-model="chapter.title" :disabled="true" />
        <ContentEditor
          v-model="content"
          :disabled="true"
          content-height="calc(100vh - 15.5rem)"
        />
      </div>
    </div>
    <div class="inner-container container-flex-end">
      <QFormButton
        @click="
          () => {
            useApiAudit.updateChapter(bookId, chapter.id, true).then((res) => {
              if (res.success) {
                useMessage.success('审批通过');
                router.replace({
                  path: '/draft-manage',
                });
              } else {
                useMessage.error(`驳回失败-${res.message}`);
              }
            });
          }
        "
        ><span>通过</span></QFormButton
      >
      <QFormButton
        @click="
          () => {
            useApiAudit.updateChapter(bookId, chapter.id, false).then((res) => {
              if (res.success) {
                useMessage.success('成功驳回');
                router.replace({
                  path: '/draft-manage',
                });
              } else {
                useMessage.error(`驳回失败-${res.message}`);
              }
            });
          }
        "
        ><span>驳回</span></QFormButton
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import router from '@/route';
import { useApiAudit } from '@guga-reading/shares';
import type { BookChapter } from '@guga-reading/types';
import { onBeforeMount, ref, watch } from 'vue';
import ContentEditor from '@/components/common/ContentEditor.vue';
import EditableTitle from '@/components/common/EditableTitle.vue';
import {
  QFormButton,
  useScreenSize,
  QFormSelect,
  useMessage,
} from 'qyani-components';
const chapter = ref<BookChapter>({} as BookChapter);
const bookId = parseInt(router.currentRoute.value.query.bookId as string);
const order = parseInt(router.currentRoute.value.query.order as string);
const isMobile = useScreenSize.getWidth(768);
const select = ref<string>('after');
const options = [
  {
    label: '修改前',
    value: 'before',
  },
  {
    label: '修改后',
    value: 'after',
  },
];
const content = ref<string>('');
const isUpdate = ref<boolean>(order < 0);
const srcChapter = ref<BookChapter>({} as BookChapter);
const srcContent = ref<string>('');
const latestContent = ref<string>('');
const latestChapter = ref<BookChapter>({} as BookChapter);
watch(
  () => select.value,
  (val) => {
    if (!isUpdate) {
      return;
    }
    if (val === 'before') {
      content.value = srcContent.value;
      chapter.value = srcChapter.value;
    } else {
      content.value = latestContent.value;
      chapter.value = latestChapter.value;
    }
  },
);
watch(
  () => isMobile.value,
  () => {
    if (isUpdate) {
      chapter.value = latestChapter.value;
      content.value = latestContent.value;
    }
  },
);
onBeforeMount(() => {
  useApiAudit
    .getAuditBookChapterByOrders(
      bookId,
      isUpdate.value ? [order, -order] : [order],
    )
    .then((res) => {
      if (isUpdate.value) {
        srcChapter.value = res.data[1] as BookChapter;
        latestChapter.value = res.data[0] as BookChapter;
        chapter.value = latestChapter.value;
      } else {
        chapter.value = res.data[0] as BookChapter;
      }
    });
  useApiAudit
    .getChapterContent(bookId, isUpdate.value ? [order, -order] : [order])
    .then((res) => {
      if (isUpdate.value) {
        srcContent.value = res.data[1] as string;
        latestContent.value = res.data[0] as string;
        content.value = latestContent.value;
      } else {
        content.value = res.data[0] as string;
      }
    });
});
</script>
