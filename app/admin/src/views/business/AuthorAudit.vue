<template>
  <div class="container-column">
    <div class="inner-container container-space-between container-align-center">
      <h3>作者申请审核</h3>
      <div class="inner-container">
        <QFormButton
          :class="{ 'button-primary': filterStatus === null }"
          @click="
            filterStatus = null;
            load();
          "
          >全部</QFormButton
        >
        <QFormButton
          :class="{ 'button-primary': filterStatus === 'pending' }"
          @click="
            filterStatus = 'pending';
            load();
          "
          >待审核</QFormButton
        >
        <QFormButton
          :class="{ 'button-primary': filterStatus === 'approved' }"
          @click="
            filterStatus = 'approved';
            load();
          "
          >已通过</QFormButton
        >
        <QFormButton
          :class="{ 'button-primary': filterStatus === 'rejected' }"
          @click="
            filterStatus = 'rejected';
            load();
          "
          >已驳回</QFormButton
        >
      </div>
    </div>

    <div v-if="loading" class="container-center padding-rem container-flex-1">
      <QSkeleton />
    </div>

    <div
      v-else-if="applications.length === 0"
      class="container-center padding-rem text-muted"
    >
      暂无申请记录
    </div>

    <div v-else class="inner-container-column gap-half">
      <div
        v-for="app in applications"
        :key="app.id"
        class="bg-card padding-rem radius-half-rem inner-container-column"
      >
        <div class="inner-container container-space-between">
          <div class="inner-container gap-half container-align-center">
            <QIcon icon="User" size="20" />
            <span class="text-1rem"
              ><strong>用户ID: {{ app.userId }}</strong></span
            >
            <span :style="{ color: statusColor(app.status) }">
              {{ statusText(app.status) }}
            </span>
          </div>
          <span class="text-085rem text-muted">{{
            app.createdAt?.split('T')[0]
          }}</span>
        </div>
        <div class="bg-body padding-46rem radius-fourth-rem">
          <p class="text-085rem"><strong>申请理由：</strong></p>
          <p>{{ app.reason }}</p>
        </div>
        <div
          v-if="app.rejectReason"
          class="bg-body padding-46rem radius-fourth-rem text-danger"
        >
          <p class="text-085rem"><strong>驳回原因：</strong></p>
          <p>{{ app.rejectReason }}</p>
        </div>
        <div v-if="app.handledBy" class="text-085rem text-muted">
          处理人ID: {{ app.handledBy }}
          <span v-if="app.handledAt">
            | {{ app.handledAt?.split('T')[0] }}</span
          >
        </div>
        <div
          v-if="app.status === 'pending'"
          class="inner-container gap-half container-flex-end"
        >
          <QFormButton class="button-primary" @click="handleApprove(app.id)">
            <QIcon icon="CirclePlus" size="16px" />
            通过
          </QFormButton>
          <QFormButton @click="openRejectDialog(app.id)">
            <QIcon icon="CircleMinus" size="16px" />
            驳回
          </QFormButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useApiAuthorApplication } from '@guga-reading/shares';
import type { AuthorApplication } from '@guga-reading/types';
import { QIcon, QFormButton, useMessage, QSkeleton } from 'qyani-components';

defineOptions({ name: 'AuthorAudit' });

const applications = ref<AuthorApplication[]>([]);
const loading = ref(false);
const filterStatus = ref<string | null>(null);

const statusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已驳回',
  };
  return map[status] || status;
};

const statusColor = (status: string) => {
  const map: Record<string, string> = {
    pending: 'var(--warning-color)',
    approved: 'var(--success-color)',
    rejected: 'var(--danger-bg)',
  };
  return map[status] || '';
};

const load = async () => {
  loading.value = true;
  const { success, data } = await useApiAuthorApplication.getApplications(
    filterStatus.value ?? undefined,
  );
  if (success) {
    applications.value = data;
  }
  loading.value = false;
};

const handleApprove = async (id: number) => {
  const { success, message } = await useApiAuthorApplication.approve(id);
  if (success) {
    useMessage.success('已通过该申请');
    load();
  } else {
    useMessage.error(message);
  }
};

const openRejectDialog = async (id: number) => {
  const reason = prompt('请输入驳回原因（可选）：');
  const { success, message } = await useApiAuthorApplication.reject(
    id,
    reason?.trim() || undefined,
  );
  if (success) {
    useMessage.success('已驳回该申请');
    load();
  } else {
    useMessage.error(message);
  }
};

onBeforeMount(() => {
  load();
});
</script>

<style scoped lang="css">
.text-danger {
  color: var(--color-danger, #e74c3c);
}
</style>
