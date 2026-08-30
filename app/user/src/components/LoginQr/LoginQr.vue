<template>
  <div class="flex flex-col items-center gap-2">
    <QLoading v-if="creating" type="breathing" />
    <template v-else>
      <img
        v-if="status === 'PENDING' || status === 'SCANNED'"
        class="login-qr-image"
        :src="qrImageUrl"
        alt="扫码登录二维码"
        width="180"
        height="180"
      />
      <QLoading v-else-if="status === 'CONFIRMED'" type="breathing" />
      <p class="text-08rem text-center">{{ statusText }}</p>
      <QFormButton
        v-if="status === 'CANCELLED' || status === 'EXPIRED'"
        type="button"
        class="button-primary"
        @click="createQr"
      >
        刷新二维码
      </QFormButton>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { QFormButton, QLoading } from 'qyani-components';
import { useQrLogin } from './composable';

defineOptions({
  name: 'LoginQr',
});

const { qrImageUrl, status, creating, createQr } = useQrLogin();

const statusText = computed<string>(() => {
  switch (status.value) {
    case 'PENDING':
      return '请使用 GUGA 阅读 App 扫码登录';
    case 'SCANNED':
      return '已扫描,请在手机上确认';
    case 'CONFIRMED':
      return '登录成功,正在跳转…';
    case 'CANCELLED':
      return '已取消本次登录';
    case 'EXPIRED':
      return '二维码已过期,请刷新';
    default:
      return '';
  }
});
</script>

<style scoped lang="css">
.login-qr-image {
  border-radius: 8px;
  background: #ffffff;
  padding: 8px;
}
</style>
