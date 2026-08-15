<template>
  <div class="container-column">
    <div class="inner-container hidden-768">
      <q-form-button @click="showClose = !showClose"> 批量管理 </q-form-button>
    </div>
    <div class="shelf-container">
      <QSwiperAction
        v-for="histortItem in shelfStore.getBookShelf"
        :key="histortItem.id"
        :disabled="!isLessThan768"
        :threshold="30"
      >
        <div class="bg-card container">
          <div
            class="inner-close"
            v-show="showClose && !isLessThan768"
            @click="shelfStore.delete(histortItem.id)"
          >
            <q-icon icon="Close" size="16px" />
          </div>
          <QLazyImage
            :src="histortItem.cover"
            :height="height"
            :width="width"
          />
          <div class="container-flex-1 inner-container-column">
            <h5 class="text-one-line">{{ histortItem.name }}</h5>
            <div class="inner-container">
              <QIcon icon="User" size="14px"></QIcon>
              <span class="text-08rem">{{ histortItem.author }}</span>
            </div>
            <div class="inner-container" v-if="histortItem.lastReadAt">
              <QIcon icon="History" size="14px"></QIcon>
              <p>
                <span class="text-08rem">上次阅读:</span>
                <span class="text-08rem">{{
                  histortItem.lastReadAt?.split('T')[0]
                }}</span>
              </p>
            </div>
            <div>
              <QFormButton
                type="button"
                @click="
                  () =>
                    router.push(
                      `/book-read/${histortItem.id}/${histortItem.lastChapterId}`,
                    )
                "
              >
                <span> 继续阅读 </span>
              </QFormButton>
            </div>
          </div>
        </div>
        <template #action>
          <div
            class="padding-46rem container-center container-h100 delete-768"
            @click="shelfStore.delete(histortItem.id)"
          >
            删除
          </div>
        </template>
      </QSwiperAction>
    </div>
  </div>
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
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: auto;
  gap: 0.5rem;
  padding: 0.25rem;
}
</style>
