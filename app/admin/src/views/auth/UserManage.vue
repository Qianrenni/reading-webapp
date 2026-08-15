<template>
  <div class="flex flex-col gap-6">
    <h4>用户管理</h4>

    <!-- 搜索条 -->
    <div class="flex gap-6 items-center">
      <QSearch
        v-model="keyword"
        placeholder="搜索用户名或邮箱"
        @search="search"
      />
      <QFormButton class="button-primary" @click="search">搜索</QFormButton>
    </div>
    <div class="flex gap-2 items-center flex-1">
      <QFormTable
        size="small"
        :pagination="false"
        :columns="tableColumns"
        :data="users"
      >
        <template #id="{ row }">
          <span>{{ toAdminUser(row).user.id }}</span>
        </template>
        <template #userName="{ row }">
          <span>{{ toAdminUser(row).user.userName }}</span>
        </template>
        <template #email="{ row }">
          <span>{{ toAdminUser(row).user.email }}</span>
        </template>
        <template #roles="{ row }">
          <span
            v-for="role in toAdminUser(row).roles"
            :key="role.roleId"
            class="tag mx-2"
            >{{ getRoleName(role.roleId) }}</span
          >
          <span
            v-if="toAdminUser(row).roles.length === 0"
            class="text-muted text-085rem"
            >无角色</span
          >
        </template>
        <template #status="{ row }">
          <span
            :class="
              toAdminUser(row).user.isActive ? 'text-success' : 'text-danger'
            "
          >
            {{ toAdminUser(row).user.isActive ? '已激活' : '已禁用' }}
          </span>
        </template>
        <template #actions="{ row }">
          <div class="flex gap-4 items-center">
            <QFormButton
              @click="openRoleDialog(row as unknown as AdminUserResponse)"
              >编辑角色
            </QFormButton>
            <QFormButton
              :class="
                toAdminUser(row).user.isActive
                  ? 'button-warning'
                  : 'button-primary'
              "
              @click="toggleUserStatus(toAdminUser(row))"
            >
              {{ toAdminUser(row).user.isActive ? '禁用' : '激活' }}
            </QFormButton>
          </div>
        </template>
      </QFormTable>
    </div>
    <!-- 分页 -->
    <div class="flex items-center justify-between">
      <span class="text-description text-085rem">共 {{ total }} 条</span>
      <div class="flex gap-4 items-center">
        <QFormButton
          class="button-small"
          :disabled="page <= 1"
          @click="changePage(page - 1)"
          >上一页</QFormButton
        >
        <span class="text-085rem">{{ page }} / {{ totalPages }}</span>
        <QFormButton
          class="button-small"
          :disabled="page >= totalPages"
          @click="changePage(page + 1)"
          >下一页</QFormButton
        >
      </div>
    </div>

    <!-- 编辑角色对话框 -->
    <QDialog
      :title="`编辑用户角色 - ${editingUser?.user?.userName}`"
      @close="closeRoleDialog"
      v-model:visible="showRoleDialog"
    >
      <div class="my-6">
        <label class="text-label">当前角色</label>
        <div class="flex flex-wrap gap-2 items-center">
          <span
            v-for="ur in editingUserRoles"
            :key="ur.roleId"
            class="tag opacity-6-hover mouse-cursor"
            @click="handleRemoveUserRole(ur.roleId)"
          >
            {{ getRoleName(ur.roleId) }}
            <span>&times;</span>
          </span>
          <span v-if="editingUserRoles.length === 0" class="text-muted"
            >无角色</span
          >
        </div>
      </div>
      <div class="my-6">
        <label class="text-label">添加角色</label>
        <div class="flex gap-2 items-center">
          <select v-model="addRoleId" class="text-input">
            <option :value="0" disabled>选择角色...</option>
            <option v-for="r in availableUserRoles" :key="r.id" :value="r.id">
              {{ r.name }} ({{ r.code }})
            </option>
          </select>
          <QFormButton class="button-small" @click="handleAddUserRole"
            >添加</QFormButton
          >
        </div>
      </div>
    </QDialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue';
import {
  useMessage,
  QFormButton,
  QSearch,
  type TableColumn,
  QFormTable,
  QDialog,
} from 'qyani-components';
import { useApiRight } from '@guga-reading/shares';
import type { AdminUserResponse, Role, UserRole } from '@guga-reading/types';

defineOptions({ name: 'UserManage' });

// QFormTable 的 row 为 unknown,转成强类型便于模板访问
const toAdminUser = (row: unknown): AdminUserResponse =>
  row as AdminUserResponse;

const tableColumns = [
  {
    label: 'ID',
    value: 'id',
  },
  {
    label: '用户名',
    value: 'userName',
  },
  {
    label: '邮箱',
    value: 'email',
  },
  {
    label: '角色',
    value: 'roles',
  },
  {
    label: '状态',
    value: 'status',
  },
  {
    label: '操作',
    value: 'actions',
  },
] satisfies TableColumn[];

const users = ref<AdminUserResponse[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const keyword = ref('');
const showRoleDialog = ref(false);
const editingUser = ref<AdminUserResponse | null>(null);
const editingUserRoles = ref<UserRole[]>([]);
const allRoles = ref<Role[]>([]);
const addRoleId = ref(0);

function getRoleName(roleId: number): string {
  return allRoles.value.find((r) => r.id === roleId)?.name ?? '';
}

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value)),
);

const availableUserRoles = computed(() => {
  const currentIds = new Set(editingUserRoles.value.map((r) => r.roleId));
  return allRoles.value.filter((r) => !currentIds.has(r.id));
});

async function loadUsers() {
  const { success, data } = await useApiRight.getUsers(
    page.value,
    pageSize.value,
    keyword.value || undefined,
  );
  if (success && data) {
    users.value = data.items || [];
    total.value = data.total || 0;
  }
}

async function loadRoles() {
  const { success, data } = await useApiRight.getRoles();
  if (success) allRoles.value = data || [];
}

function search() {
  page.value = 1;
  loadUsers();
}

function changePage(newPage: number) {
  page.value = newPage;
  loadUsers();
}

async function openRoleDialog(user: AdminUserResponse) {
  editingUser.value = user;
  const { success, data } = await useApiRight.getUserRoles(user.user.id);
  if (success) editingUserRoles.value = data || [];
  addRoleId.value = 0;
  showRoleDialog.value = true;
}

function closeRoleDialog() {
  showRoleDialog.value = false;
  editingUser.value = null;
  editingUserRoles.value = [];
}

async function handleAddUserRole() {
  if (!editingUser.value || !addRoleId.value) return;
  const { success, message } = await useApiRight.addUserRole(
    editingUser.value.user.id,
    addRoleId.value,
  );
  if (success) {
    useMessage.success('角色添加成功');
    const { data } = await useApiRight.getUserRoles(editingUser.value!.user.id);
    if (data) editingUserRoles.value = data;
    addRoleId.value = 0;
    await loadUsers();
  } else {
    useMessage.error(message);
  }
}

async function handleRemoveUserRole(roleId: number) {
  if (!editingUser.value) return;
  const { success, message } = await useApiRight.removeUserRole(
    editingUser.value.user.id,
    roleId,
  );
  if (success) {
    useMessage.success('角色已移除');
    const { data } = await useApiRight.getUserRoles(editingUser.value!.user.id);
    if (data) editingUserRoles.value = data;
    await loadUsers();
  } else {
    useMessage.error(message);
  }
}

async function toggleUserStatus(user: AdminUserResponse) {
  const action = user.user.isActive ? '禁用' : '激活';
  if (!confirm(`确定要${action}用户「${user.user.userName}」吗？`)) return;
  const { success, message } = await useApiRight.updateUserStatus(
    user.user.id,
    !user.user.isActive,
  );
  if (success) {
    useMessage.success(`用户已${action}`);
    await loadUsers();
  } else {
    useMessage.error(message);
  }
}

onBeforeMount(() => {
  loadUsers();
  loadRoles();
});
</script>
