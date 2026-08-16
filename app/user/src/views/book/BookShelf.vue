<template>
  <section class="flex flex-col gap-2">
    <div class="flex items-center hidden-768">
      <q-form-button @click="showClose = !showClose"> 批量管理 </q-form-button>
    </div>
    <ul class="grid gap-4 p-2 w-full shelf-container">
      <li v-for="historyItem in shelfStore.getBookShelf" :key="historyItem.id">
        <QSwiperAction :disabled="!isLessThan768" :threshold="30">
          <article class="bg-card flex gap-2 p-2">
            <div
              class="inner-close"
              v-show="showClose && !isLessThan768"
              @click="shelfStore.delete(historyItem.id)"
            >
              <q-icon icon="Close" size="16px" />
            </div>
            <QLazyImage
              :src="historyItem.cover"
              :height="height"
              :width="width"
            />
            <div class="flex-1 flex flex-col gap-2">
              <h5 class="text-one-line">{{ historyItem.name }}</h5>
              <div class="flex gap-2 items-center">
                <QIcon icon="User" size="14px"></QIcon>
                <span class="text-08rem">{{ historyItem.author }}</span>
              </div>
              <div
                class="flex gap-2 items-center"
                v-if="historyItem.lastReadAt"
              >
                <QIcon icon="History" size="14px"></QIcon>
                <p>
                  <span class="text-08rem">上次阅读:</span>
                  <span class="text-08rem">{{
                    historyItem.lastReadAt?.split('T')[0]
                  }}</span>
                </p>
              </div>
              <div>
                <QFormButton
                  type="button"
                  @click="
                    () =>
                      router.push(
                        `/book-read/${historyItem.id}/${historyItem.lastChapterId}`,
                      )
                  "
                >
                  <span> 继续阅读 </span>
                </QFormButton>
              </div>
            </div>
          </article>
          <template #action>
            <div
              class="px-3 py-2 flex items-center justify-center h-full delete-768"
              @click="shelfStore.delete(historyItem.id)"
            >
              删除
            </div>
          </template>
        </QSwiperAction>
      </li>
    </ul>
  </section>
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import router from '@/route';
import { useBookShelfStore } from '@/store';
import { useWindowResize } from 'qyani-components';
import {
  QSwiperAction,
  QIcon,
  QFormButton,
  QLazyImage,
} from 'qyani-components';
const width = ref(96);
const height = ref(144);
const isLessThan768 = ref(window.innerWidth < 768);
const showClose = ref(false);
useWindowResize.addHandler((width) => {
  isLessThan768.value = width < 768;
});
const shelfStore = useBookShelfStore();
onBeforeMount(async () => {
  shelfStore.get();
});
</script>
<style scoped lang="css">
.shelf-container {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: auto;
}
</style>
