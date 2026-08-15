<template>
  <div class="container-column bg-card">
    <h4>日志监控</h4>

    <!-- ===== 日志监控面板 ===== -->
    <div class="inner-container-column">
      <!-- 工具栏：文件选择 + 级别筛选 -->
      <div class="inner-container container-wrap">
        <!-- 文件选择 -->
        <QFormSelect
          label="日志文件"
          :options="
            logFiles.map((file) => {
              return {
                label: `${file.name}${formatBytes(file.size)}`,
                value: file.name,
              };
            })
          "
          :required="false"
          v-model="selectedFile"
        />
        <QFormSelect
          label="级别筛选"
          :required="false"
          v-model="selectedLevel"
          :options="
            logLevels.map((value) => {
              return { label: value, value: value === '全部' ? '' : value };
            })
          "
        />
        <QSearch
          placeholder="正则搜索"
          v-model="regexPattern"
          @search="onRegexSearch"
        />
      </div>
      <!-- 日志内容展示 -->
      <div
        class="bg-card inner-container-column border-horizontal-gray scroll-container"
        :style="{
          height: `${isMobile ? 'calc(100vh - 14rem)' : 'calc(100vh - 10rem)'}`,
        }"
      >
        <QSkeleton v-if="loading" />

        <span v-else-if="errorMsg" class="text-danger">{{ errorMsg }}</span>
        <span v-else-if="logEntries.length === 0" class="text-muted"
          >暂无匹配的日志数据</span
        >
        <div v-else class="log-list">
          <div
            v-for="entry in logEntries"
            :key="entry.lineNumber"
            class="log-entry"
            :class="[`log-level-${entry.level.toLowerCase()}`]"
          >
            <div class="log-meta">
              <span class="log-line">{{ entry.lineNumber }}</span>
              <span class="log-time">{{ entry.timestamp }}</span>
              <span
                class="log-badge"
                :class="`badge-${entry.level.toLowerCase()}`"
              >
                {{ entry.level }}
              </span>
              <span class="log-thread" :title="entry.thread">{{
                entry.thread
              }}</span>
              <span class="log-logger" :title="entry.logger">{{
                entry.logger
              }}</span>
            </div>
            <p class="log-message">{{ entry.message }}</p>
          </div>
        </div>
      </div>

      <!-- 分页 + 统计 -->
      <div
        class="inner-container container-align-center container-space-between"
      >
        <span class="text-description text-085rem">
          共 {{ total }} 条
          <template v-if="selectedFileObj">
            , 文件大小 {{ formatBytes(selectedFileObj?.size ?? 0) }}
          </template>
        </span>
        <div class="inner-container container-align-center">
          <button
            class="button"
            :disabled="page <= 1"
            @click="changePage(page - 1)"
          >
            <span class="hidden-768">上一页</span>
            <QIcon icon="Left" size="18" class="show-768" />
          </button>
          <span class="text-085rem text-one-line"
            >{{ page }} / {{ totalPages }}</span
          >
          <button
            class="button"
            :disabled="page >= totalPages"
            @click="changePage(page + 1)"
          >
            <span class="hidden-768">下一页</span>
            <QIcon icon="Right" size="18" class="show-768" />
          </button>
          <select
            v-model.number="pageSize"
            class="text-input"
            @change="onPageSizeChange"
          >
            <option :value="50">50条/页</option>
            <option :value="100">100条/页</option>
            <option :value="200">200条/页</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount, watch } from 'vue';
import {
  QFormSelect,
  QIcon,
  QSearch,
  QSkeleton,
  useScreenSize,
} from 'qyani-components';
import { formatBytes, useApiSystem } from '@guga-reading/shares';
import type { LogFileInfo, LogEntry } from '@guga-reading/types';

defineOptions({ name: 'SystemManage' });

// 日志级别
const logLevels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL', '全部'] as const;

// 文件列表
const logFiles = ref<LogFileInfo[]>([]);
const selectedFile = ref('');

const selectedFileObj = computed(() =>
  logFiles.value.find((f) => f.name === selectedFile.value),
);
const isMobile = useScreenSize.getWidth(768);
// 日志内容
const logEntries = ref<LogEntry[]>([]);
const selectedLevel = ref('');
const page = ref(1);
const pageSize = ref(100);
const total = ref(0);
const loading = ref(false);
const errorMsg = ref('');
const regexPattern = ref('');
const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value)),
);

/** 加载日志文件列表 */
async function loadLogFiles() {
  const { success, data } = await useApiSystem.getLogFiles();
  if (success && data) {
    logFiles.value = data;
    if (data.length > 0 && !selectedFile.value) {
      const firstFile = data[0]!;
      selectedFile.value = firstFile.name;
    }
  }
}

/** 加载日志内容 */
async function loadLogContent() {
  if (!selectedFile.value) return;
  loading.value = true;
  errorMsg.value = '';
  try {
    const { success, data, message } = await useApiSystem.readLog(
      selectedFile.value,
      selectedLevel.value || undefined,
      page.value,
      pageSize.value,
      regexPattern.value || undefined,
    );
    if (success && data) {
      logEntries.value = data.items || [];
      total.value = data.total || 0;
    } else {
      // 后端返回错误（如非法正则）
      logEntries.value = [];
      total.value = 0;
      errorMsg.value = message || '加载日志失败';
    }
  } catch {
    errorMsg.value = '加载日志失败，请检查文件是否存在';
    logEntries.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

watch(
  () => selectedFile.value,
  () => {
    page.value = 1;
    errorMsg.value = '';
    loadLogContent();
  },
);

/** 切换级别 */
watch(
  () => selectedLevel.value,
  () => {
    page.value = 1;
    loadLogContent();
  },
);
/** 翻页 */
function changePage(newPage: number) {
  page.value = newPage;
  loadLogContent();
}

/** 修改每页条数 */
function onPageSizeChange() {
  page.value = 1;
  loadLogContent();
}

/** 回车触发正则搜索 */
function onRegexSearch() {
  page.value = 1;
  loadLogContent();
}
onBeforeMount(() => {
  loadLogFiles();
});
</script>

<style scoped>
/* ===== 日志列表 ===== */
.log-list {
  display: flex;
  flex-direction: column;
}

.log-entry {
  border-left: 3px solid transparent;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  padding: 0.45rem 0;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 0.82rem;
  line-height: 1.55;
  transition: background-color 0.15s ease;
}
/* 左侧边框颜色 */
.log-level-debug {
  border-left-color: #9ca3af;
}
.log-level-info {
  border-left-color: #3b82f6;
}
.log-level-warn {
  border-left-color: #f59e0b;
}
.log-level-error {
  border-left-color: #ef4444;
}
.log-level-fatal {
  border-left-color: #dc2626;
}

/* 元信息行 */
.log-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-secondary, #6b7280);
  flex-wrap: wrap;
}

.log-line {
  color: var(--text-muted, #9ca3af);
  font-size: 0.75rem;
}

.log-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.45rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.badge-debug {
  background: #f3f4f6;
  color: #6b7280;
}
.badge-info {
  background: #dbeafe;
  color: #1d4ed8;
}
.badge-warn {
  background: #fef3c7;
  color: #b45309;
}
.badge-error {
  background: #fee2e2;
  color: #dc2626;
}
.badge-fatal {
  background: #fecaca;
  color: #991b1b;
}

/* 消息内容 */
.log-message {
  margin: 0.2rem 0 0 1rem;
  color: var(--text-color, #1f2937);
  line-break: anywhere;
  white-space: pre-wrap;
}

/* 正则输入框 */
.regex-input {
  min-width: 260px;
  max-width: 380px;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 0.82rem;
}
</style>
