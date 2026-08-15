<template>
  <div class="personal-center-container container container-row-768-column">
    <div class="inner-container-column">
      <div class="left-top bg-card shadow-common">
        <QAvatar
          size="100px"
          :url="
            userStore.getUser?.avatar == ''
              ? '/figure.webp'
              : userStore.getUser?.avatar!
          "
        />
        <h2>{{ userStore.getUser?.userName }}</h2>
        <p :style="{ color: userStore.getUser?.isActive ? 'green' : 'red' }">
          {{ userStore.getUser?.isActive ? 'Active' : 'Inactive' }}
        </p>
        <div
          class="container bg-body padding-46rem container-align-center container-w100"
        >
          <QIcon
            class="padding-24rem text-primary"
            icon="Setting"
            size="16px"
          />
          <div>
            <p>Email</p>
            <p class="text-08rem">
              {{ userStore.getUser?.email }}
            </p>
          </div>
        </div>
        <div class="inner-container container-w100">
          <QFormButton
            type="button"
            class="button-primary"
            @click="() => router.push('/update-password')"
          >
            <div class="container-center">
              <QIcon icon="Edit" size="16px" />
              <span>修改密码</span>
            </div>
          </QFormButton>
          <QFormButton type="button" @click="() => exitHandler()">
            <span>退出登录</span>
          </QFormButton>
        </div>
        <div class="inner-container container-w100">
          <QFormButton
            type="button"
            class="button-primary"
            :disabled="authorStatus === 'approved'"
            @click="openApplyDialog"
          >
            <div class="container-center">
              <QIcon icon="Draft" size="16px" />
              <span>{{ authorBtnText }}</span>
            </div>
          </QFormButton>
        </div>
      </div>
      <div class="left-top bg-card shadow-black">
        <div class="container container-w100 gap-half">
          <QIcon icon="Book" size="24px" class="text-primary" />
          <h3>Reading Statistics</h3>
        </div>
        <div class="container-w100 container-space-between">
          <span>Books Read</span>
          <h4>111</h4>
        </div>
        <div class="container-w100 container-space-between">
          <span>Pages Read</span>
          <h4>111</h4>
        </div>
        <div class="container-w100 container-space-between">
          <span>Current Streak</span>
          <h4 class="text-primary">18days</h4>
        </div>
        <hr />
        <p class="container-w100">Favorite Genres</p>
        <p class="container-w100 container-wrap container gap">
          <QTag
            v-for="item in [
              'Fantasy',
              'Non-fiction',
              'Horror',
              'Thriller',
              'Romance',
            ]"
            :text="item"
          />
        </p>
      </div>
    </div>
    <div class="right">
      <div class="right-top bg-card shadow-black">
        <div class="container container-w100 gap-half container-align-center">
          <QIcon icon="Heart" size="24px" class="text-primary" />
          <h3>Currently Reading</h3>
        </div>
        <div class="container-w100 inner-container container-wrap">
          <div
            v-for="histortItem in currentRead"
            :key="histortItem.id"
            class="bg-body mouse-cursor"
            @click="
              router.push(
                `/book-read/${histortItem.id}/${histortItem.lastChapterId}`,
              )
            "
          >
            <QLazyImage
              :src="histortItem.cover"
              :height="height"
              :width="width"
            />
          </div>
        </div>
      </div>
      <div class="right-top bg-card shadow-common">
        <div class="container-w100">
          <h3>Reading Goals</h3>
        </div>
        <div class="container-w100 gap container-row-768-column text-white">
          <div
            class="padding-rem radius-rem container-column gap line-gradient-purple"
          >
            <p>This Month</p>
            <h2>8/12 books</h2>
          </div>
          <div
            class="padding-rem radius-rem container-column gap line-gradient-green"
          >
            <p>This Year</p>
            <h2>24/50 books</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useAuthStore } from '@/store';
import { useReadingHistoryStore } from '@/store';
import { useApiAuthorApplication } from '@guga-reading/shares';
import {
  QIcon,
  QFormButton,
  QLazyImage,
  QAvatar,
  QTag,
  useMessage,
} from 'qyani-components';
import router from '@/route';

const userStore = useAuthStore();
const readhistoryStore = useReadingHistoryStore();
const currentRead = computed(() => {
  return readhistoryStore.getReadingHistory.slice(0, 3);
});
const width = 64;
const height = 96;

// 作者申请相关
const authorStatus = ref<string | null>(null);
const authorBtnText = computed(() => {
  if (authorStatus.value === 'approved') return '已是作者';
  if (authorStatus.value === 'pending') return '申请审核中';
  if (authorStatus.value === 'rejected') return '重新申请';
  return '申请成为作者';
});

const openApplyDialog = async () => {
  if (authorStatus.value === 'approved') {
    useMessage.info('您已经是作者了');
    return;
  }
  const reason = prompt('请输入申请理由：');
  if (!reason || reason.trim() === '') {
    useMessage.warning('请输入申请理由');
    return;
  }
  const { success, message } = await useApiAuthorApplication.apply(
    reason.trim(),
  );
  if (success) {
    useMessage.success('申请已提交，请等待管理员审核');
    authorStatus.value = 'pending';
  } else {
    useMessage.error(message);
  }
};

const loadAuthorApplication = async () => {
  const { success, data } = await useApiAuthorApplication.getMyApplication();
  if (success && data) {
    authorStatus.value = data.status;
  }
};

const exitHandler = () => {
  userStore.clearUser();
  userStore.clearToken();
  window.location.reload();
};
onBeforeMount(() => {
  readhistoryStore.get();
  loadAuthorApplication();
});
</script>

<style scoped lang="css">
.personal-center-container {
  max-width: 1200px;
  margin: 0 auto;
  justify-content: space-between;
}

.left-top {
  width: 300px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.right {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.right-top {
  width: 850px;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
@media screen and (max-width: 768px) {
  .left-top {
    width: 100%;
  }
  .right-top {
    width: 100%;
  }
  .personal-center-container {
    width: 100%;
  }
}
</style>
