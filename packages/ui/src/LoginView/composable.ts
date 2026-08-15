import { onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useApiCaptcha, useApiAuth, useAuthStore } from '@guga-reading/shares';
import { useMessage } from 'qyani-components';

/**
 * LoginView 登录表单组合式函数
 * 从 LoginView.vue 中解耦，便于单元测试。
 */
export interface LoginForm {
  username: string;
  password: string;
  captcha: string;
  x_captcha_id: string;
  remember: string[];
}

export function useLoginForm() {
  const router = useRouter();
  const authStore = useAuthStore();

  if (authStore.isLogin) {
    router.push('/');
  }

  const image = ref<string>('');
  const form = ref<LoginForm>({
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
      authStore.setRemember(form.value.remember.length > 0);
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
      if (authStore.redirectUrl !== null) {
        const url = authStore.redirectUrl;
        authStore.setRedirectUrl(null);
        router.replace(url);
      } else {
        router.replace({ path: '/' });
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
  onMounted(() => {
    refreshCaptcha();
    document.addEventListener('keyup', globalKeyUp);
  });
  onBeforeUnmount(() => {
    if (image.value) {
      URL.revokeObjectURL(image.value);
    }
    document.removeEventListener('keyup', globalKeyUp);
  });

  return { image, form, loading, refreshCaptcha, run, globalKeyUp };
}
