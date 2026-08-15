<template>
  <div class="container-column container-w100">
    <div class="container-column bg-card shadow-common">
      <h4>账号信息</h4>
      <div class="grid-2 text-muted text-085rem">
        <div>
          <p>昵称</p>
          <p>{{ authStore.getUser?.userName || '--' }}</p>
        </div>
        <div>
          <p>邮箱</p>
          <p>{{ authStore.getUser?.email || '--' }}</p>
        </div>
      </div>
    </div>
    <div class="container-flex-end">
      <QFormButton
        type="button"
        class="text-danger"
        @click="
          () => {
            authStore.clearToken();
            authStore.clearUser();
          }
        "
      >
        退出登录
      </QFormButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from '@/store';
import { QFormButton } from 'qyani-components';

const authStore = useAuthStore();
</script>
<style scoped></style>
