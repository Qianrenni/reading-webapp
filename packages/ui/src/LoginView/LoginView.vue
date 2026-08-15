<template>
  <div class="content-container">
    <div class="flex flex-col gap-2 p-2 bg-card">
      <h3 class="text-center">{{ title }}</h3>
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
      </div>
      <QFormButton type="button" class="button-primary" @click="run">
        <QLoading v-if="loading" type="breathing" />
        <span v-else>登录</span>
      </QFormButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  QFormText,
  QFormCheckboxGroup,
  QFormButton,
  QLazyImage,
  QLoading,
} from 'qyani-components';
import { useLoginForm } from './composable';
withDefaults(defineProps<{ title?: string }>(), {
  title: '作者登录',
});
defineOptions({
  name: 'LoginView',
});
const { image, form, loading, refreshCaptcha, run } = useLoginForm();
</script>

<style scoped lang="css"></style>
