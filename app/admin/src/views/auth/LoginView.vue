<template>
  <div class="content-container">
    <div class="container-column bg-card">
      <h3 class="text-center">管理员登录</h3>
      <QFormText
        prefixIcon="User"
        v-model="form.username"
        type="email"
        placeholder="请输入用户名"
        name="username"
      />
      <QFormText
        prefixIcon="Lock"
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        name="password"
      />
      <div class="container" style="padding: 0">
        <QFormText
          v-model="form.captcha"
          type="text"
          placeholder="请输入验证码"
          name="captcha"
        />
        <QLazyImage
          class="mouse-cursor"
          :width="80"
          :height="30"
          :src="image"
          @click="refreshCaptcha"
        />
      </div>
      <div class="container-align-center container-space-between text-08rem">
        <QFormCheckboxGroup
          v-model="form.remember"
          :options="[{ label: '记住我', value: 'remember' }]"
          style="padding: 0"
        />
      </div>
      <QFormButton type="button" class="button-primary" @click="run">
        <QLoading v-if="loading" type="breathing" />
        <span v-else>登录</span>
      </QFormButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useApiCaptcha } from '@guga-reading/shares';
import { useApiAuth } from '@guga-reading/shares';
import {
  useMessage,
  QFormText,
  QFormCheckboxGroup,
  QFormButton,
  QLazyImage,
  QLoading,
} from 'qyani-components';
import { useAuthStore } from '@/store';
import router from '@/route';
import axios from 'axios';
defineOptions({
  name: 'LoginView',
});
const authStore = useAuthStore();
if (authStore.isLogin) {
  router.push('/');
}
const image = ref<string>('');
const form = ref({
  username: '',
  password: '',
  captcha: '',
  x_captcha_id: '',
  remember: ['remember'],
});
const loading = ref(false);
const refreshCaptcha = async () => {
  if (image.value) {
    URL.revokeObjectURL(image.value);
  }
  const { x_captcha_id, imageUrl } = (await useApiCaptcha.getCaptcha())!;
  form.value.x_captcha_id = x_captcha_id!;
  image.value = imageUrl;
};
const run = async () => {
  loading.value = true;
  const { success, message, data } = await useApiAuth.login(
    form.value.username,
    form.value.password,
    form.value.captcha,
    form.value.x_captcha_id,
  );
  if (success) {
    useMessage.success('登录成功');
    authStore.setRemeber(form.value.remember.length > 0);
    authStore.setToken(
      data!.accessToken!,
      data!.refreshToken!,
      data!.tokenType!,
    );
    authStore.setUser(data!.user!);
    axios.defaults.headers.common['Authorization'] =
      `${authStore.getTokenType} ${authStore.getAccessToken}`;
  } else {
    useMessage.error(message);
    refreshCaptcha();
  }
  loading.value = false;
};

watch(
  () => authStore.isLogin,
  (newValue) => {
    if (!newValue) {
      return;
    }
    if (authStore.redictUrl !== null) {
      const url = authStore.redictUrl;
      authStore.setRedictUrl(null);
      router.replace(url);
    } else {
      router.replace({
        path: '/',
      });
    }
  },
);
const globalKeyUp = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    run();
  }
};
onBeforeMount(() => {
  authStore.initial();
});
onMounted(async () => {
  refreshCaptcha();
  document.addEventListener('keyup', globalKeyUp);
});
onBeforeUnmount(() => {
  if (image.value) {
    URL.revokeObjectURL(image.value);
  }
  document.removeEventListener('keyup', globalKeyUp);
});
</script>

<style scoped lang="css"></style>
