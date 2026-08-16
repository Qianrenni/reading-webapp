<template>
  <section class="flex flex-col gap-2">
    <!-- 工具条 -->
    <div class="flex gap-2 items-center justify-between">
      <h4>角色管理</h4>
      <QFormButton class="button-primary" @click="openCreateRoleDialog"
        >新增角色
      </QFormButton>
    </div>

    <!-- 角色列表 + 详情面板 -->
    <div
      class="flex gap-2 items-center container-row-768-column"
      style="align-items: flex-start"
    >
      <!-- 角色列表 -->
      <ul class="bg-card">
        <li
          v-for="role in roles"
          :key="role.id"
          class="role-item bg-hover-secondary"
          :class="{ 'role-item-active': selectedRole?.id === role.id }"
          @click="selectRole(role)"
        >
          <div class="flex flex-col gap-2 p-2" style="flex: 1">
            <div class="flex gap-4 items-center">
              <strong>{{ role.name }}</strong>
              <span class="text-muted text-085rem">({{ role.code }})</span>
            </div>
            <div v-if="role.description" class="text-085rem text-description">
              {{ role.description }}
            </div>
          </div>
          <QFormButton @click.stop="handleEditRole(role)">编辑</QFormButton>
          <QFormButton @click.stop="handleDeleteRole(role)">删除</QFormButton>
        </li>
      </ul>

      <!-- 详情面板 -->
      <div v-if="selectedRole" class="bg-card flex flex-col gap-2 p-2 flex-1">
        <div>
          <h4>
            {{ selectedRole.name }}
            <span class="text-muted text-085rem"
              >({{ selectedRole.code }})</span
            >
          </h4>
          <p class="text-description">
            {{ selectedRole.description }}
          </p>
        </div>
        <QDivider />
        <!-- 权限分配 -->
        <div>
          <div class="flex gap-2 items-center justify-between">
            <h4>权限分配</h4>
            <QFormButton class="button-primary" @click="savePermissions"
              >保存权限</QFormButton
            >
          </div>
          <div v-for="(perms, resource) in groupedPermissions" :key="resource">
            <div class="text-085rem text-muted">
              {{ resourceLabels[resource] || resource }}
            </div>
            <div class="flex flex-wrap gap-4">
              <label
                v-for="perm in perms"
                :key="perm.id"
                class="permission-checkbox"
                :class="{ active: tempPermissionIds.has(perm.id) }"
              >
                <input
                  type="checkbox"
                  :checked="tempPermissionIds.has(perm.id)"
                  @change="togglePermission(perm.id)"
                />
                <span
                  >{{ actionLabels[perm.action] || perm.action }}.{{
                    scopeLabels[perm.scope] || perm.scope
                  }}</span
                >
              </label>
            </div>
          </div>
        </div>
        <QDivider />
        <!-- 角色继承 -->
        <div>
          <h4 class="my-4">角色继承</h4>
          <div class="flex flex-wrap gap-2 items-center">
            <span v-for="parent in roleParents" :key="parent.id" class="tag">
              {{ parent.name }}
              <span class="mouse-cursor" @click="handleRemoveParent(parent.id)"
                >&times;</span
              >
            </span>
            <span
              v-if="roleParents.length === 0"
              class="text-description text-085rem"
              >无继承</span
            >
          </div>
          <div class="flex gap-2 items-center my-6">
            <select v-model="newParentId" class="text-input">
              <option :value="0" disabled>选择父角色...</option>
              <option v-for="r in availableParents" :key="r.id" :value="r.id">
                {{ r.name }} ({{ r.code }})
              </option>
            </select>
            <QFormButton @click="handleAddParent">添加</QFormButton>
          </div>
        </div>
      </div>
      <div
        v-else
        class="bg-card radius-md flex-1 flex items-center justify-center text-muted"
      >
        请选择一个角色查看详情
      </div>
    </div>

    <!-- 创建/编辑角色对话框 -->
    <QDialog
      v-model:visible="showRoleDialog"
      @close="closeRoleDialog"
      @confirm="saveRole"
    >
      <div class="dialog-content bg-card radius-md">
        <h4>{{ isEditing ? '编辑角色' : '新增角色' }}</h4>
        <div class="flex flex-col gap-6 p-6">
          <QFormText
            v-model="roleForm.name"
            label="角色名称"
            direction="vertical"
            placeholder="输入角色名称"
          />
          <QFormText
            v-model="roleForm.code"
            label="角色编码"
            direction="vertical"
            placeholder="输入角色编码"
          />
          <QFormTextarea
            label="角色描述（可选）"
            direction="vertical"
            :required="false"
            v-model="roleForm.description"
            placeholder="角色描述"
            :rows="2"
          />
        </div>
      </div>
    </QDialog>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue';
import {
  useMessage,
  QFormButton,
  QDialog,
  QFormText,
  QFormTextarea,
  QDivider,
  useShowLoading,
} from 'qyani-components';
import { useApiRight } from '@guga-reading/shares';
import type { Permission, Role } from '@guga-reading/types';

defineOptions({ name: 'RightManage' });

const roles = ref<Role[]>([]);
const permissions = ref<Permission[]>([]);
const selectedRole = ref<Role | null>(null);
const tempPermissionIds = ref<Set<number>>(new Set());
const roleParents = ref<Role[]>([]);
const newParentId = ref(0);
const showRoleDialog = ref(false);
const isEditing = ref(false);
const roleForm = ref({ name: '', code: '', description: '' });

const resourceLabels: Record<string, string> = {
  BOOK: '书籍',
  USER: '用户',
  PERMISSION: '权限',
  CHAPTER: '章节',
  SHELF: '书架',
};

const actionLabels: Record<string, string> = {
  READ: '读取',
  CREATE: '创建',
  UPDATE: '更新',
  DELETE: '删除',
  AUDIT: '审核',
  MANAGE: '管理',
};

const scopeLabels: Record<string, string> = {
  OWN: '自己',
  ALL: '全部',
};

const groupedPermissions = computed(() => {
  const groups: Record<string, Permission[]> = {} as Record<
    Permission['resourceType'],
    Permission[]
  >;
  for (const perm of permissions.value) {
    if (!groups[perm.resourceType]) {
      groups[perm.resourceType] = [];
    }
    groups[perm.resourceType]?.push(perm);
  }
  return groups;
});

const availableParents = computed(() => {
  if (!selectedRole.value) return [];
  return roles.value.filter(
    (r) =>
      r.id !== selectedRole.value!.id &&
      !roleParents.value.some((p) => p.id === r.id),
  );
});

async function loadRoles() {
  const { success, data } = await useApiRight.getRoles();
  if (success) roles.value = data || [];
}

async function loadPermissions() {
  const { success, data } = await useApiRight.getPermissions();
  if (success) permissions.value = data || [];
}

async function selectRole(role: Role) {
  selectedRole.value = role;
  // Load role permissions
  const { success, data } = await useApiRight.getRolePermissions(role.id);
  if (success) {
    tempPermissionIds.value = new Set((data || []).map((p) => p.id));
  }
  // Load role parents
  const res = await useApiRight.getRoleParents(role.id);
  if (res.success) roleParents.value = res.data || [];
  newParentId.value = 0;
}

function togglePermission(permId: number) {
  const newSet = new Set(tempPermissionIds.value);
  if (newSet.has(permId)) {
    newSet.delete(permId);
  } else {
    newSet.add(permId);
  }
  tempPermissionIds.value = newSet;
}

async function savePermissions() {
  if (!selectedRole.value) return;
  // Get current permissions
  const { data: currentPerms } = await useApiRight.getRolePermissions(
    selectedRole.value.id,
  );
  const currentIds = new Set((currentPerms || []).map((p) => p.id));
  const newIds = tempPermissionIds.value;

  const toAdd = [...newIds].filter((id) => !currentIds.has(id));
  const toRemove = [...currentIds].filter((id) => !newIds.has(id));

  if (toRemove.length > 0) {
    await useApiRight.revokeRolePermissions(selectedRole.value.id, toRemove);
  }
  if (toAdd.length > 0) {
    await useApiRight.assignRolePermissions(selectedRole.value.id, toAdd);
  }
  useMessage.success('权限保存成功');
}

function openCreateRoleDialog() {
  isEditing.value = false;
  roleForm.value = { name: '', code: '', description: '' };
  showRoleDialog.value = true;
}

function handleEditRole(role: Role) {
  isEditing.value = true;
  roleForm.value = {
    name: role.name,
    code: role.code,
    description: role.description || '',
  };
  showRoleDialog.value = true;
}

function closeRoleDialog() {
  showRoleDialog.value = false;
}

async function saveRole() {
  if (!roleForm.value.name || !roleForm.value.code) {
    useMessage.error('请填写角色名称和编码');
    return;
  }
  if (isEditing.value && selectedRole.value) {
    const { success, message } = await useApiRight.updateRole(
      selectedRole.value.id,
      {
        name: roleForm.value.name,
        description: roleForm.value.description || undefined,
      },
    );
    if (success) {
      useMessage.success('角色更新成功');
      closeRoleDialog();
      await loadRoles();
      selectedRole.value =
        roles.value.find((r) => r.id === selectedRole.value!.id) || null;
    } else {
      useMessage.error(message);
    }
  } else {
    const { success, message } = await useApiRight.createRole({
      name: roleForm.value.name,
      code: roleForm.value.code,
      description: roleForm.value.description || undefined,
    });
    if (success) {
      useMessage.success('角色创建成功');
      closeRoleDialog();
      await loadRoles();
    } else {
      useMessage.error(message);
    }
  }
}

async function handleDeleteRole(role: Role) {
  if (!confirm(`确定要删除角色「${role.name}」吗？`)) return;
  const { success, message } = await useApiRight.deleteRole(role.id);
  if (success) {
    useMessage.success('角色已删除');
    if (selectedRole.value?.id === role.id) {
      selectedRole.value = null;
      roleParents.value = [];
      tempPermissionIds.value = new Set();
    }
    await loadRoles();
  } else {
    useMessage.error(message);
  }
}

function handleAddParent() {
  if (!selectedRole.value || !newParentId.value) return;
  useApiRight
    .addRoleParent(selectedRole.value.id, newParentId.value)
    .then(({ success, message }) => {
      if (success) {
        useMessage.success('继承关系添加成功');
        // Reload parents
        useApiRight.getRoleParents(selectedRole.value!.id).then((res) => {
          if (res.success) roleParents.value = res.data || [];
        });
        newParentId.value = 0;
      } else {
        useMessage.error(message);
      }
    });
}

function handleRemoveParent(parentId: number) {
  if (!selectedRole.value) return;
  useApiRight
    .removeRoleParent(selectedRole.value.id, parentId)
    .then(({ success, message }) => {
      if (success) {
        useMessage.success('继承关系已移除');
        useApiRight.getRoleParents(selectedRole.value!.id).then((res) => {
          if (res.success) roleParents.value = res.data || [];
        });
      } else {
        useMessage.error(message);
      }
    });
}

onBeforeMount(() => {
  useShowLoading.show();
  Promise.all([loadRoles(), loadPermissions()]).finally(() => {
    useShowLoading.hide();
  });
});
</script>

<style scoped>
.role-item {
  display: flex;
  align-items: center;
  gap: var(--q-space-2);
  padding: var(--q-space-3) var(--q-space-4);
  cursor: pointer;
  border-bottom: 1px solid var(--q-color-border-light, #eee);
  transition: background 0.15s;
}
.permission-checkbox {
  display: inline-flex;
  align-items: center;
  gap: var(--q-space-1);
  padding: var(--q-space-1) var(--q-space-2);
  border: 1px solid var(--q-color-border-light, #ddd);
  border-radius: var(--q-radius-sm);
  cursor: pointer;
  font-size: 0.85rem;
  user-select: none;
}
.permission-checkbox.active {
  border-color: var(--q-color-primary);
  background: var(--q-color-primary-lighter);
}
.permission-checkbox input {
  display: none;
}
</style>
