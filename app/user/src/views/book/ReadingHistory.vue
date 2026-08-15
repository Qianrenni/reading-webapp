<template>
  <div>
    <div class="flex gap-2 hidden-768">
      <q-form-button @click="showClose = !showClose"> 批量管理 </q-form-button>
    </div>
    <div class="grid gap-4 p-2 w-full reading-history-container">
      <QSwiperAction
        v-for="histortItem in historyStore.getReadingHistory"
        :key="histortItem.id"
        :disabled="!isLessThan768"
        :threshold="30"
      >
        <template #default>
          <div class="bg-card flex gap-2 p-2">
            <div
              v-show="showClose && !isLessThan768"
              class="inner-close"
              @click="historyStore.delete(histortItem.id)"
            >
              <q-icon icon="Close" size="16px" />
            </div>
            <QLazyImage
              :src="histortItem.cover"
              :height="height"
              :width="width"
            />
            <div class="flex-1 flex flex-col gap-2">
              <h5>
                {{ histortItem.name }}
              </h5>
              <div class="flex gap-2 items-center">
                <QIcon icon="User" size="14px" />
                <span class="text-08rem">{{ histortItem.author }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <QIcon icon="History" size="14px" />
                <div class="flex gap-2 items-center">
                  <span class="text-08rem">上次阅读:</span>
                  <span class="text-08rem">{{
                    histortItem.lastReadAt.split('T')[0]
                  }}</span>
                </div>
              </div>
              <div class="flex gap-2 items-center">
                <QFormButton
                  type="button"
                  @click="
                    router.push(
                      `/book-read/${histortItem.id}/${histortItem.lastChapterId}`,
                    )
                  "
                >
                  继续阅读
                </QFormButton>
                <QFormButton
                  v-if="!shelfIds.includes(histortItem.id)"
                  type="button"
                  @click="shelfStore.add(histortItem.id)"
                >
                  加入书架
                </QFormButton>
              </div>
            </div>
          </div>
        </template>
        <template #action>
          <div
            class="flex items-center justify-center px-3 py-2 h-full delete-768"
            @click="historyStore.delete(histortItem.id)"
          >
            删除
          </div>
        </template>
      </QSwiperAction>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import router from '@/route';
import { useReadingHistoryStore } from '@/store';
import { useBookShelfStore } from '@/store';
import { useScreenSize } from 'qyani-components';
import {
  QSwiperAction,
  QLazyImage,
  QFormButton,
  QIcon,
} from 'qyani-components';
const width = ref(96);
const height = ref(144);
const isLessThan768 = useScreenSize.getWidth(768);
const showClose = ref(false);
const historyStore = useReadingHistoryStore();
const shelfStore = useBookShelfStore();
const shelfIds = computed(() => {
  return shelfStore.bookShelf.map((item) => item.id);
});
onBeforeMount(async () => {
  historyStore.get();
});
</script>
<style scoped lang="css">
.reading-history-container {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: auto;
}
</style>
