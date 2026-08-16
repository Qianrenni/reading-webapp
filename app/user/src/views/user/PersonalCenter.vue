<template>
  <div
    class="personal-center-container flex container-row-768-column mx-auto justify-between"
  >
    <div class="flex flex-col gap-2">
      <section
        class="left-top bg-card shadow-common flex flex-col items-center gap-6 p-6"
      >
        <QAvatar
          size="100px"
          :url="
            userStore.getUser?.avatar == ''
              ? DEFAULT_AVATAR
              : userStore.getUser?.avatar!
          "
        />
        <h2>{{ userStore.getUser?.userName }}</h2>
        <p :style="{ color: userStore.getUser?.isActive ? 'green' : 'red' }">
          {{ userStore.getUser?.isActive ? 'Active' : 'Inactive' }}
        </p>
        <div class="flex bg-body px-2 py-1 items-center w-full">
          <QIcon class="p-2 text-primary" icon="Setting" size="16px" />
          <div>
            <p>Email</p>
            <p class="text-08rem">
              {{ userStore.getUser?.email }}
            </p>
          </div>
        </div>
        <div class="flex gap-2 items-center w-full">
          <QFormButton
            type="button"
            class="button-primary"
            @click="() => router.push('/update-password')"
          >
            <div class="flex items-center">
              <QIcon icon="Edit" size="16px" />
              <span>修改密码</span>
            </div>
          </QFormButton>
          <QFormButton type="button" @click="() => exitHandler()">
            <span>退出登录</span>
          </QFormButton>
        </div>
        <div class="flex gap-2 items-center w-full">
          <QFormButton
            type="button"
            class="button-primary"
            :disabled="authorStatus === 'approved'"
            @click="openApplyDialog"
          >
            <div class="flex items-center">
              <QIcon icon="Draft" size="16px" />
              <span>{{ authorBtnText }}</span>
            </div>
          </QFormButton>
        </div>
      </section>
      <section
        class="left-top bg-card shadow-black flex flex-col items-center gap-6 p-6"
      >
        <div class="flex gap-4 w-full items-center">
          <QIcon icon="Book" size="24px" class="text-primary" />
          <h3>Reading Statistics</h3>
        </div>
        <div class="w-full flex justify-between">
          <span>Books Read</span>
          <h4>111</h4>
        </div>
        <div class="w-full flex justify-between">
          <span>Pages Read</span>
          <h4>111</h4>
        </div>
        <div class="w-full flex justify-between">
          <span>Current Streak</span>
          <h4 class="text-primary">18days</h4>
        </div>
        <hr />
        <p class="w-full">Favorite Genres</p>
        <p class="w-full flex flex-wrap gap-6">
          <QTag
            v-for="item in [
              'Fantasy',
              'Non-fiction',
              'Horror',
              'Thriller',
              'Romance',
            ]"
            :key="item"
            :text="item"
          />
        </p>
      </section>
    </div>
    <div class="right flex flex-col gap-6">
      <section
        class="right-top bg-card shadow-black flex flex-col items-center gap-6 p-6 radius-xl"
      >
        <div class="flex gap-4 w-full items-center">
          <QIcon icon="Heart" size="24px" class="text-primary" />
          <h3>Currently Reading</h3>
        </div>
        <ul class="w-full flex gap-2 items-center flex-wrap">
          <li
            v-for="historyItem in currentRead"
            :key="historyItem.id"
            class="bg-body mouse-cursor"
            @click="
              router.push(
                `/book-read/${historyItem.id}/${historyItem.lastChapterId}`,
              )
            "
          >
            <QLazyImage
              :src="historyItem.cover"
              :height="height"
              :width="width"
            />
          </li>
        </ul>
      </section>
      <section
        class="right-top bg-card shadow-common flex flex-col items-center gap-6 p-6 radius-xl"
      >
        <div class="w-full">
          <h3>Reading Goals</h3>
        </div>
        <div class="w-full gap-6 flex container-row-768-column text-white">
          <div class="p-6 radius-xl flex flex-col gap-6 line-gradient-purple">
            <p>This Month</p>
            <h2>8/12 books</h2>
          </div>
          <div class="p-6 radius-xl flex flex-col gap-6 line-gradient-green">
            <p>This Year</p>
            <h2>24/50 books</h2>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { DEFAULT_AVATAR } from '@/constants';
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
}

.left-top {
  width: 300px;
}

.right {
  flex: 1;
}

.right-top {
  width: 850px;
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
