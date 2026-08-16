<template>
  <section
    class="flex flex-col gap-2 p-2 bg-card scroll-container"
    :style="{
      height: `calc(100vh - 4rem)`,
    }"
  >
    <div class="flex items-center justify-between flex-wrap gap-2">
      <h4>系统配置（动态热更新）</h4>
      <div class="flex gap-2">
        <QFormButton type="button" @click="loadConfigs">
          <span>刷新</span>
        </QFormButton>
        <QFormButton type="button" class="button-primary" @click="saveAll">
          <span>保存全部</span>
        </QFormButton>
      </div>
    </div>
    <p class="text-muted text-08rem">
      修改后立即写入 Redis 配置中心并通过失效本地缓存热生效，无需重启服务。
    </p>
    <QSkeleton v-if="loading" />
    <span v-else-if="errorMsg" class="text-danger">{{ errorMsg }}</span>
    <div v-else class="flex flex-col gap-4">
      <div
        v-for="domain in configs"
        :key="domain.domain"
        class="flex flex-col gap-2 border-horizontal-gray p-2 radius-sm"
      >
        <div class="flex items-center justify-between flex-wrap gap-2">
          <h5>{{ domainLabel(domain.domain) }}</h5>
          <span class="text-muted text-08rem">{{ domain.domain }}</span>
        </div>
        <div
          v-for="(_value, key) in domain.values"
          :key="key"
          class="flex flex-col gap-1"
        >
          <QFormText
            v-model="domain.values[key]"
            :label="fieldLabel(domain.domain, key)"
            direction="vertical"
          />
          <span class="text-muted text-08rem">
            {{ fieldDesc(domain.domain, key) }}
          </span>
        </div>
        <div class="flex justify-end">
          <QFormButton
            type="button"
            class="button-primary"
            @click="saveDomain(domain)"
          >
            <span>保存</span>
          </QFormButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import {
  QFormText,
  QFormButton,
  QSkeleton,
  useMessage,
} from 'qyani-components';
import { useApiSystem } from '@guga-reading/shares';
import type { ConfigView } from '@guga-reading/types';

defineOptions({
  name: 'SystemConfigManage',
});
const configs = ref<ConfigView[]>([]);
const loading = ref(false);
const errorMsg = ref('');

/**
 * 配置领域展示元数据（中文名 + 字段标签/说明）
 */
const domainMeta: Record<
  string,
  { label: string; fields: Record<string, { label: string; desc: string }> }
> = {
  RATE_LIMIT: {
    label: '限流配置',
    fields: {
      windowSeconds: { label: '时间窗口', desc: '限流窗口时长（秒）' },
      maxRequests: {
        label: '窗口内最大请求数',
        desc: '单个窗口内允许的最大请求次数',
      },
    },
  },
  CACHE: {
    label: '缓存配置',
    fields: {
      bookCacheExpire: {
        label: '书籍缓存过期时间',
        desc: '书籍读取缓存 TTL（秒）',
      },
    },
  },
  COMPACT: {
    label: '内容存储整理配置',
    fields: {
      garbageThreshold: {
        label: '垃圾占比阈值',
        desc: '垃圾数据占比超过该值触发整理（0~1）',
      },
      minLiveBytes: {
        label: '最小有效字节',
        desc: '整理后有效数据小于该值则合并（字节）',
      },
      maxFileBytes: { label: '最大文件大小', desc: '单个存储文件上限（字节）' },
    },
  },
};

const domainLabel = (domain: string): string =>
  domainMeta[domain]?.label ?? domain;
const fieldLabel = (domain: string, key: string): string =>
  domainMeta[domain]?.fields[key]?.label ?? key;
const fieldDesc = (domain: string, key: string): string =>
  domainMeta[domain]?.fields[key]?.desc ?? '';

/** 加载全部配置领域当前生效值 */
const loadConfigs = async () => {
  loading.value = true;
  errorMsg.value = '';
  const result = await useApiSystem.getConfigs();
  if (result.success) {
    configs.value = result.data ?? [];
  } else {
    errorMsg.value = result.message;
  }
  loading.value = false;
};

/** 保存单个领域配置 */
const saveDomain = async (domain: ConfigView) => {
  const result = await useApiSystem.updateConfig(domain.domain, domain.values);
  if (result.success) {
    useMessage.success(`${domainLabel(domain.domain)}已更新，已热生效`);
    await loadConfigs();
  } else {
    useMessage.error(result.message);
  }
};

/** 保存全部配置 */
const saveAll = async () => {
  for (const domain of configs.value) {
    const result = await useApiSystem.updateConfig(
      domain.domain,
      domain.values,
    );
    if (!result.success) {
      useMessage.error(
        `${domainLabel(domain.domain)}保存失败：${result.message}`,
      );
      return;
    }
  }
  useMessage.success('全部配置已保存并热生效');
  await loadConfigs();
};

onBeforeMount(loadConfigs);
</script>

<style scoped lang="css"></style>
