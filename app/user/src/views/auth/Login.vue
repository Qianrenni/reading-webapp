<template>
  <main class="content-container">
    <section class="login-panel">
      <!-- 左侧：扫码登录（用手机客户端「扫一扫」确认后网页端自动登录） -->
      <div class="login-panel__col login-panel__col--qr bg-card">
        <h3 class="text-center">扫码登录</h3>
        <div class="qr-box">
          <QQRCode
            v-if="qrContent && state === 'pending'"
            :value="qrContent"
            :size="180"
            bg-color="#ffffff"
          />
          <div v-else class="qr-box__mask">
            <QLoading v-if="state === 'loading'" type="breathing" />
            <template v-else>
              <p class="qr-box__tip">{{ tip }}</p>
              <QFormButton
                type="button"
                class="button-primary"
                @click="refresh"
              >
                刷新二维码
              </QFormButton>
            </template>
          </div>
        </div>
        <p class="text-08rem text-center qr-hint">{{ tip }}</p>
      </div>

      <!-- 右侧：账号密码登录 -->
      <div class="login-panel__col flex flex-col gap-2 p-2 bg-card">
        <h3 class="text-center">用户登录</h3>
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
        <div class="flex gap-2 p-2" style="padding: 0">
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
        <div class="flex items-center justify-between text-08rem">
          <QFormCheckboxGroup
            v-model="form.remember"
            :options="[{ label: '记住我', value: 'remember' }]"
            style="padding: 0"
          />
          <RouterLink to="/forget-password" class="link-primary">
            忘记密码?
          </RouterLink>
        </div>
        <QFormButton type="button" class="button-primary" @click="run">
          <QLoading v-if="loading" type="breathing" />
          <span v-else>登录</span>
        </QFormButton>
        <div class="flex items-center justify-center">
          <RouterLink to="/register" class="link-primary text-08rem">
            没有账号?立即注册
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>
<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  useApiCaptcha,
  useApiAuth,
  type QrLoginTokenData,
} from '@guga-reading/shares';
import {
  useMessage,
  QFormText,
  QFormCheckboxGroup,
  QFormButton,
  QLazyImage,
  QLoading,
  QQRCode,
} from 'qyani-components';
import { useAuthStore } from '@/store';
import { useQrLogin } from '@/composables/useQrLogin';
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
/** 扫码登录：拿到令牌后与账号密码登录共用同一套落地逻辑 */
const { qrContent, state, tip, refresh } = useQrLogin({
  onSuccess: (data) => applyToken(data),
});
const refreshCaptcha = async () => {
  if (image.value) {
    URL.revokeObjectURL(image.value);
  }
  const { x_captcha_id, imageUrl } = (await useApiCaptcha.getCaptcha())!;
  form.value.x_captcha_id = x_captcha_id!;
  image.value = imageUrl;
};
/** 登录落地：写入令牌与用户信息，跳转由 isLogin 的 watch 统一处理 */
const applyToken = (data: QrLoginTokenData) => {
  useMessage.success('登录成功');
  authStore.setToken(data.accessToken, data.refreshToken, data.tokenType);
  authStore.setUser(data.user);
  axios.defaults.headers.common['Authorization'] =
    `${authStore.getTokenType} ${authStore.getAccessToken}`;
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
    authStore.setRemember(form.value.remember.length > 0);
    applyToken(data!);
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
    if (authStore.redirectUrl !== null) {
      const url = authStore.redirectUrl;
      authStore.setRedirectUrl(null);
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

<style scoped lang="css">
/* 左二维码 / 右账号密码；窄屏（手机浏览器）退化为单列并隐藏二维码——
   同一台手机无法扫自己屏幕上的码，扫码入口对窄屏没有意义 */
.login-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  gap: 1rem;
}

.login-panel__col {
  box-sizing: border-box;
  width: 300px;
}

.login-panel__col--qr {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
}

.qr-box {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}

.qr-box__mask {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 180px;
  height: 180px;
}

.qr-box__tip {
  margin: 0;
  font-size: 0.8rem;
  text-align: center;
}

.qr-hint {
  min-height: 1.2em;
  margin: 0;
}

@media screen and (max-width: 640px) {
  .login-panel__col--qr {
    display: none;
  }
}
</style>
