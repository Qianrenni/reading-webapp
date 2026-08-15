<template>
  <div>
    <div class="container hidden-768">
      <q-form-button @click="showClose = !showClose"> 批量管理 </q-form-button>
    </div>
    <div class="reading-history-container">
      <QSwiperAction
        v-for="histortItem in historyStore.getReadingHistory"
        :key="histortItem.id"
        :disabled="!isLessThan768"
        :threshold="30"
      >
        <template #default>
          <div class="bg-card container">
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
            <div class="container-flex-1 inner-container-column">
              <h5>
                {{ histortItem.name }}
              </h5>
              <div class="inner-container">
                <QIcon icon="User" size="14px" />
                <span class="text-08rem">{{ histortItem.author }}</span>
              </div>
              <div class="inner-container">
                <QIcon icon="History" size="14px" />
                <div class="inner-container">
                  <span class="text-08rem">上次阅读:</span>
                  <span class="text-08rem">{{
                    histortItem.lastReadAt.split('T')[0]
                  }}</span>
                </div>
              </div>
              <div class="inner-container">
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
            class="container-center padding-46rem container-h100 delete-768"
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
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: auto;
  gap: 0.5rem;
  padding: 0.25rem;
}
</style>
