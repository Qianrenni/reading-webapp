<template>
  <div class="container-column">
    <p class="text-08rem text-right">每30秒更新一次</p>

    <!-- 统计卡片行：作者/图书/用户/CPU -->
    <div class="inner-container container-w100 container-space-evenly">
      <div
        class="inner-container-column bg-card padding-rem radius-half-rem container-flex-1"
      >
        <h4 class="text-center text-muted">作者数量</h4>
        <p class="text-center text-12rem">{{ authorCount }}位</p>
      </div>
      <div
        class="inner-container-column bg-card padding-rem radius-half-rem container-flex-1"
      >
        <h4 class="text-center text-muted">图书数量</h4>
        <p class="text-center text-12rem">{{ bookCount }}本</p>
      </div>
      <div
        class="inner-container-column bg-card padding-rem radius-half-rem container-flex-1"
      >
        <h4 class="text-center text-muted">用户数量</h4>
        <p class="text-center text-12rem">{{ userCount }}位</p>
      </div>
    </div>

    <!-- 内存与交换空间 -->
    <div class="inner-container container-w100 gap">
      <div
        class="inner-container-column bg-card padding-rem radius-half-rem container-flex-1"
      >
        <h4 class="text-muted">内存使用</h4>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: memoryPercent + '%' }"
          ></div>
        </div>
        <div class="inner-container container-space-between text-085rem">
          <span class="text-description">
            已用 <strong>{{ formatBytes(systemInfo.memoryUsed) }}</strong>
          </span>
          <span class="text-description">
            总计 <strong>{{ formatBytes(systemInfo.memoryTotal) }}</strong>
          </span>
        </div>
      </div>
      <div
        class="inner-container-column bg-card padding-rem radius-half-rem container-flex-1"
      >
        <h4 class="text-muted">交换空间（虚存）</h4>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: swapPercent + '%' }"
          ></div>
        </div>
        <div class="inner-container container-space-between text-085rem">
          <span class="text-description">
            已用 <strong>{{ formatBytes(systemInfo.swapUsed) }}</strong>
          </span>
          <span class="text-description">
            总计 <strong>{{ formatBytes(systemInfo.swapTotal) }}</strong>
          </span>
        </div>
      </div>
    </div>

    <!-- 磁盘分区信息 -->
    <div
      class="inner-container-column bg-card padding-rem radius-half-rem gap-half"
      v-if="systemInfo.disks?.length"
    >
      <h4 class="text-muted">磁盘分区</h4>
      <div
        v-for="(disk, index) in systemInfo.disks"
        :key="index"
        class="disk-item"
      >
        <div
          class="inner-container container-space-between container-wrap"
          :class="{ 'padding-vetical': index > 0 }"
        >
          <div class="inner-container gap-half text-085rem">
            <span class="disk-label">{{ disk.mountPoint }}</span>
            <span class="text-muted">|</span>
            <span class="text-description">{{ disk.device }}</span>
            <span class="text-muted">|</span>
            <span class="text-description">{{ disk.fStype }}</span>
          </div>
          <span class="text-085rem text-description">
            <strong>{{ formatBytes(disk.used) }}</strong> /
            {{ formatBytes(disk.total) }}
            &nbsp;({{ disk.percent }}%)
          </span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: disk.percent + '%' }" />
        </div>
      </div>
    </div>
    <div class="inner-container-column bg-card padding-rem radius-half-rem">
      <h4 class="text-muted">CPU使用率</h4>
      <p class="text-12rem">{{ systemInfo.cpuPercent ?? '0' }}%</p>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: (systemInfo.cpuPercent ?? 0) + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  formatBytes,
  useApiAuthor,
  useApiBooks,
  useApiSystem,
  useApiUser,
} from '@guga-reading/shares';
import type { SystemInfo } from '@guga-reading/types';
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue';

const systemInfo = ref<SystemInfo>({} as SystemInfo);
const authorCount = ref(0);
const bookCount = ref(0);
const userCount = ref(0);

/** 内存使用百分比 */
const memoryPercent = computed(() => {
  const total = systemInfo.value.memoryTotal;
  const used = systemInfo.value.memoryUsed;
  if (!total) return 0;
  return Math.round((used / total) * 100);
});

/** 交换空间使用百分比 */
const swapPercent = computed(() => {
  const total = systemInfo.value.swapTotal;
  const used = systemInfo.value.swapUsed;
  if (!total) return 0;
  return Math.round((used / total) * 100);
});

const task = () => {
  useApiAuthor.getAuthorCount().then((res) => {
    authorCount.value = res.data;
  });
  useApiBooks.getBookCount().then((res) => {
    bookCount.value = res.data;
  });
  useApiUser.getUserCount().then((res) => {
    userCount.value = res.data;
  });
  useApiSystem.getSystemInfo().then((res) => {
    systemInfo.value = res.data;
  });
};

let timer: number | null = null;
onBeforeMount(() => {
  task();
  timer = setInterval(task, 30000);
});
onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>
