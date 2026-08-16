<template>
  <div class="flex flex-col gap-2 w-full">
    <section class="flex flex-col gap-2 p-2 bg-card shadow-common">
      <h4>账号信息</h4>
      <div class="grid grid-cols-2 text-muted text-085rem">
        <div>
          <p>昵称</p>
          <p>{{ authStore.getUser?.userName || '--' }}</p>
        </div>
        <div>
          <p>邮箱</p>
          <p>{{ authStore.getUser?.email || '--' }}</p>
        </div>
      </div>
    </section>
    <div class="flex justify-end">
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
