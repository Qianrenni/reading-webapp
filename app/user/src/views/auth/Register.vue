<template>
  <div class="content-container">
    <div class="bg-card container-column">
      <h3 class="text-center">新用户注册</h3>
      <QFormText
        v-model="form.username"
        type="text"
        label="用户名"
        placeholder="请输入用户名"
        name="username"
      />
      <QFormText
        v-model="form.password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        name="password"
      />
      <QFormText
        v-model="form.confirmPassword"
        type="password"
        label="重复输入密码"
        placeholder="再次输入密码"
        name="confirmPassword"
      />

      <div class="inner-container">
        <QFormText
          v-model="form.email"
          type="email"
          label="邮箱"
          placeholder="请输入邮箱"
          name="email"
        />
        <QFormButton type="button" class="button-primary" @click="verifyEmail">
          <QLoading v-if="isVerifyEmail" type="spinner" />
          <span v-else> 验证邮箱</span>
        </QFormButton>
      </div>
      <div class="inner-container">
        <QFormText
          v-model="form.captcha"
          type="text"
          label="验证码"
          placeholder="请输入验证码"
          name="captcha"
        />
        <QLazyImage
          class="mouse-cursor"
          :width="80"
          :height="30"
          :src="image"
          :alt="'验证码'"
          @click="refreshCaptcha"
        />
      </div>
      <QFormButton type="button" class="button-primary" @click="register">
        注册
      </QFormButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useApiCaptcha } from '@guga-reading/shares';
import { useApiAuth } from '@guga-reading/shares';
import { useValidate } from '@guga-reading/shares';
import {
  useMessage,
  QFormText,
  QFormButton,
  QLazyImage,
  QLoading,
} from 'qyani-components';
import router from '@/route';
const image = ref<string>('');
const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  captcha: '',
  x_captcha_id: '',
});
const isVerifyEmail = ref(false);

const verifyEmail = async () => {
  if (isVerifyEmail.value) {
    return;
  }
  if (!useValidate.email(form.value.email)) {
    useMessage.error('邮箱格式不正确');
    return;
  }
  isVerifyEmail.value = true;
  const { success, message } = await useApiAuth.verifyEmail(form.value.email);
  isVerifyEmail.value = false;
  if (success) {
    useMessage.success('发送成功,请到邮箱中验证');
  } else {
    useMessage.error(message);
  }
};

const register = async () => {
  if (!useValidate.email(form.value.email)) {
    useMessage.error('邮箱格式不正确');
    return;
  }
  if (form.value.password !== form.value.confirmPassword) {
    useMessage.error('两次输入的密码不一致');
    return;
  }
  const { success, message } = await useApiAuth.register(
    form.value.username,
    form.value.password,
    form.value.email,
    form.value.captcha,
    form.value.x_captcha_id,
  );
  if (success) {
    useMessage.success('注册成功,请登录');
    router.push({
      name: 'Login',
    });
  } else {
    useMessage.error(message);
  }
};
const refreshCaptcha = async () => {
  if (image.value) {
    URL.revokeObjectURL(image.value);
  }
  const { x_captcha_id, imageUrl } = (await useApiCaptcha.getCaptcha())!;
  form.value.x_captcha_id = x_captcha_id!;
  image.value = imageUrl;
};
onMounted(async () => {
  refreshCaptcha();
});
onBeforeUnmount(() => {
  if (image.value) {
    URL.revokeObjectURL(image.value);
  }
});
</script>

<style scoped lang="css"></style>
