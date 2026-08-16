<template>
  <div class="flex flex-col gap-6">
    <h4>书籍管理</h4>

    <!-- 操作栏 -->
    <div class="flex gap-6 items-center justify-between">
      <div class="flex gap-6 items-center">
        <QSearch
          v-model="keyword"
          placeholder="搜索书名、作者或标签"
          @search="search"
        />
        <QFormButton class="button-primary" @click="search">搜索</QFormButton>
      </div>
      <QFormButton class="button-success" @click="openUploadDialog"
        ><span>上传书籍</span></QFormButton
      >
    </div>

    <!-- 数据表格 -->
    <QFormTable
      size="small"
      :pagination="false"
      :columns="tableColumns"
      :data="books"
      style="height: calc(100vh - 11.5rem)"
    >
      <template #cover="{ row }">
        <QLazyImage
          :src="row.cover as string"
          alt="封面"
          :width="42"
          :height="56"
        />
      </template>
      <template #name="{ row }">
        <span class="text-one-line">{{ row.name }}</span>
      </template>
      <template #author="{ row }">
        <span class="text-one-line">{{ row.author }}</span>
      </template>
      <template #category="{ row }">
        <span class="text-one-line">{{ row.category }}</span>
      </template>
      <template #status="{ row }">
        <span
          :class="row.status === 'PUBLISHED' ? 'text-success' : 'text-warning'"
          class="text-one-line p-2 radius-md"
        >
          {{ statusText(row.status as StatusEnum) }}
        </span>
      </template>
      <template #isActive="{ row }">
        <span
          :class="row.isActive ? 'text-success' : 'text-danger'"
          class="text-one-line p-2 radius-md"
        >
          {{ row.isActive ? '已激活' : '已封禁' }}
        </span>
      </template>
      <template #tags="{ row }">
        <span
          v-for="tag in (row.tags as string).split(/[, ]/)"
          :key="tag"
          class="tag mx-2 text-one-line"
          >{{ tag }}</span
        >
      </template>
      <template #authorCount="{ row }">
        <span>{{ row.authorCount }} 位</span>
      </template>
      <template #actions="{ row }">
        <div class="flex gap-4 items-center">
          <QFormButton
            :disabled="(row.authorCount as number) > 0"
            :title="
              (row.authorCount as number) > 0
                ? '该书有关联的作者，无法编辑'
                : '编辑书籍信息'
            "
            @click="openEditDialog(row as unknown as AdminBook)"
            ><span class="text-one-line">编辑</span></QFormButton
          >
          <QFormButton
            :class="row.isActive ? 'button-warning' : 'button-primary'"
            @click="toggleBookStatus(row as unknown as AdminBook)"
          >
            <span class="text-one-line">{{
              row.isActive ? '封禁' : '激活'
            }}</span>
          </QFormButton>
        </div>
      </template>
    </QFormTable>

    <!-- 分页 -->
    <div class="flex items-center justify-between">
      <span class="text-description text-085rem">共 {{ total }} 条</span>
      <div class="flex gap-4 items-center">
        <button
          :disabled="page <= 1"
          @click="changePage(page - 1)"
          class="button"
        >
          上一页
        </button>
        <span class="text-085rem">{{ page }} / {{ totalPages }}</span>
        <button
          :disabled="page >= totalPages"
          @click="changePage(page + 1)"
          class="button"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 编辑书籍对话框 -->
    <QDialog title="编辑书籍信息" v-model:visible="showEditDialog">
      <div class="flex flex-col gap-6 p-6">
        <div class="flex gap-6 items-center">
          <label class="text-label">书名</label>
          <input
            v-model="editForm.name"
            class="text-input flex-1"
            placeholder="书名"
          />
        </div>
        <div class="flex gap-6 items-center">
          <label class="text-label">作者</label>
          <input
            v-model="editForm.author"
            class="text-input flex-1"
            placeholder="作者"
          />
        </div>
        <div class="flex gap-6 items-center">
          <label class="text-label">分类</label>
          <select v-model="editForm.category" class="text-input flex-1">
            <option value="" disabled>选择分类</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div class="flex gap-6 items-center">
          <label class="text-label">标签</label>
          <input
            v-model="editForm.tags"
            class="text-input flex-1"
            placeholder="标签，用逗号分隔"
          />
        </div>
        <div class="flex gap-6 items-center" style="align-items: flex-start">
          <label class="text-label">描述</label>
          <textarea
            v-model="editForm.description"
            class="text-input flex-1"
            rows="10"
            placeholder="书籍描述"
          ></textarea>
        </div>
        <QFormFileUpload
          v-model="editForm.coverFile"
          class="flex-1"
          accept="image/*"
          label="封面"
          :required="false"
          direction="horizontal"
        />
        <div v-if="editForm.coverFile != null">
          <QLazyImage
            :src="editFormCoverPreview"
            alt="封面"
            :width="96"
            :height="128"
          />
        </div>
        <div class="flex gap-2 items-center justify-center">
          <QFormButton class="button-primary" @click="submitEdit"
            >保存修改</QFormButton
          >
        </div>
      </div>
    </QDialog>

    <!-- 上传书籍对话框 -->
    <QDialog title="上传书籍" v-model:visible="showUploadDialog">
      <div class="flex flex-col gap-6 p-6 w-full">
        <div class="flex gap-6 items-center">
          <label class="text-label">书名</label>
          <input
            v-model="uploadForm.name"
            class="text-input flex-1"
            placeholder="书名"
          />
        </div>
        <div class="flex gap-6 items-center">
          <label class="text-label">作者</label>
          <input
            v-model="uploadForm.author"
            class="text-input flex-1"
            placeholder="作者"
          />
        </div>
        <div class="flex gap-6 items-center">
          <label class="text-label">分类</label>
          <select v-model="uploadForm.category" class="text-input flex-1">
            <option value="" disabled>选择分类</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div class="flex gap-6 items-center">
          <label class="text-label">标签</label>
          <input
            v-model="uploadForm.tags"
            class="text-input flex-1"
            placeholder="标签，用逗号分隔"
          />
        </div>
        <QFormTextarea
          v-model="uploadForm.description"
          class="flex-1"
          :rows="6"
          placeholder="书籍描述"
        ></QFormTextarea>
        <QFormFileUpload
          v-model="uploadForm.coverFile"
          class="flex-1"
          accept="image/*"
          label="封面"
          :required="false"
          direction="horizontal"
        />
        <QFormFileUpload
          v-model="uploadForm.txtFile"
          class="flex-1"
          accept=".txt"
          label="TXT文件"
          :required="false"
          direction="horizontal"
        />
        <!-- TXT 解析结果预览 -->
        <div v-if="parsingTxt" class="flex gap-2 items-center justify-center">
          <span class="text-description">正在解析 TXT 文件...</span>
        </div>
        <div v-if="parseError" class="flex gap-2 items-center justify-center">
          <span class="text-danger">解析失败：{{ parseError }}</span>
        </div>
        <div v-if="parseResult && !parsingTxt" class="flex flex-col gap-2">
          <div class="flex gap-6 items-center justify-between">
            <span class="text-label" style="font-weight: 600">解析结果</span>
            <span class="text-description text-085rem">
              共 {{ totalChapters }} 章，{{ totalWords }} 字
            </span>
          </div>
          <QFormTable
            size="small"
            style="max-height: 200px"
            :maxVisiblePages="3"
            :data="parseResult?.chapters"
            :columns="[
              {
                label: '章节名称',
                value: 'title',
              },
              {
                label: '字数',
                value: 'wordCount',
              },
            ]"
          >
            <template #title="{ row }">
              <span class="text-one-line">{{ row.title }}</span>
            </template>
            <template #wordCount="{ row }">
              <span class="text-one-line">{{ row.wordCount }}</span>
            </template>
          </QFormTable>
        </div>
        <div v-if="uploadForm.coverFile != null">
          <QLazyImage
            :src="uploadFormCoverPreview"
            alt="封面"
            :width="100"
            :height="120"
          />
        </div>
        <div class="flex gap-2 items-center justify-center">
          <QFormButton
            class="button-success"
            :disabled="uploading"
            @click="submitUpload"
          >
            {{ uploading ? '上传中...' : '开始上传' }}
          </QFormButton>
        </div>
      </div>
    </QDialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onBeforeMount } from 'vue';
import {
  useMessage,
  QFormButton,
  QSearch,
  type TableColumn,
  QFormTable,
  QDialog,
  QLazyImage,
  QFormFileUpload,
  QFormTextarea,
} from 'qyani-components';
import {
  transformImage,
  useApiAdminBooks,
  useApiBooks,
  parseTxtFile,
  type TxtParseResult,
} from '@guga-reading/shares';
import type { AdminBook } from '@guga-reading/types';
import { TranslationStatus, type StatusEnum } from '@guga-reading/types';

defineOptions({ name: 'BookManage' });

const tableColumns = [
  {
    label: 'ID',
    value: 'id',
  },
  {
    label: '封面',
    value: 'cover',
  },
  {
    label: '书名',
    value: 'name',
  },
  {
    label: '作者',
    value: 'author',
  },
  {
    label: '分类',
    value: 'category',
  },
  {
    label: '标签',
    value: 'tags',
  },
  {
    label: '状态',
    value: 'status',
  },
  {
    label: '激活',
    value: 'isActive',
  },
  {
    label: '关联作者',
    value: 'authorCount',
  },
  {
    label: '操作',
    value: 'actions',
  },
] satisfies TableColumn[];

const books = ref<AdminBook[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const keyword = ref('');
const categories = ref<string[]>([]);

// 状态文本映射
function statusText(status: StatusEnum): string {
  return TranslationStatus[status] || status;
}

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / pageSize.value)),
);

// ========== 列表加载 ==========
async function loadBooks() {
  const { success, data } = await useApiAdminBooks.getBooks(
    page.value,
    pageSize.value,
    keyword.value || undefined,
  );
  if (success && data) {
    books.value = data.items || [];
    total.value = data.total || 0;
  }
}

async function loadCategories() {
  const { success, data } = await useApiBooks.getBookCategory();
  if (success) categories.value = data || [];
}

function search() {
  page.value = 1;
  loadBooks();
}

function changePage(newPage: number) {
  page.value = newPage;
  loadBooks();
}

// ========== 编辑书籍 ==========
const showEditDialog = ref(false);
const editForm = ref<{
  id: number;
  name: string;
  author: string;
  description: string;
  category: string;
  tags: string;
  coverFile: File | null;
}>({
  id: 0,
  name: '',
  author: '',
  description: '',
  category: '',
  tags: '',
  coverFile: null,
});
const editFormCoverPreview = computed(() => {
  return editForm.value.coverFile
    ? URL.createObjectURL(editForm.value.coverFile)
    : '';
});
function openEditDialog(book: AdminBook) {
  if (book.authorCount > 0) {
    return;
  }
  editForm.value = {
    id: book.id,
    name: book.name,
    author: book.author,
    description: book.description,
    category: book.category,
    tags: book.tags,
    coverFile: null,
  };
  showEditDialog.value = true;
}

async function submitEdit() {
  const form = editForm.value;
  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('author', form.author);
  formData.append('description', form.description);
  formData.append('category', form.category);
  formData.append('tags', form.tags);
  if (form.coverFile) {
    const webpFile = await transformImage(form.coverFile, 'webp', 0.3);
    formData.append(
      'cover',
      new File([webpFile], form.coverFile.name, { type: 'image/webp' }),
    );
  }

  const { success, message } = await useApiAdminBooks.updateBook(
    form.id,
    formData,
  );
  if (success) {
    useMessage.success('书籍更新成功');
    await loadBooks();
  } else {
    useMessage.error(message || '更新失败');
  }
}

// ========== 上传书籍 ==========
const showUploadDialog = ref(false);
const uploading = ref(false);
const uploadForm = ref<{
  name: string;
  author: string;
  description: string;
  category: string;
  tags: string;
  coverFile: File | null;
  txtFile: File | null;
  txtFileName: string;
}>({
  name: '',
  author: '',
  description: '',
  category: '',
  tags: '',
  coverFile: null,
  txtFile: null,
  txtFileName: '',
});

// ========== TXT 文件解析预览 ==========
const parseResult = ref<TxtParseResult | null>(null);
const parsingTxt = ref(false);
const parseError = ref('');

watch(
  () => uploadForm.value.txtFile,
  async (file) => {
    if (file) {
      parsingTxt.value = true;
      parseError.value = '';
      parseResult.value = null;
      try {
        const result = await parseTxtFile(file);
        parseResult.value = result;
        if (result.description && !uploadForm.value.description) {
          uploadForm.value.description = result.description;
        }
      } catch (e: unknown) {
        parseError.value = e instanceof Error ? e.message : '解析 TXT 文件失败';
      } finally {
        parsingTxt.value = false;
      }
    } else {
      parseResult.value = null;
      parseError.value = '';
    }
  },
);

const totalChapters = computed(() => parseResult.value?.chapters.length ?? 0);
const totalWords = computed(
  () =>
    parseResult.value?.chapters.reduce((sum, ch) => sum + ch.wordCount, 0) ?? 0,
);

const uploadFormCoverPreview = computed(() => {
  return uploadForm.value.coverFile
    ? URL.createObjectURL(uploadForm.value.coverFile)
    : '';
});

function openUploadDialog() {
  uploadForm.value = {
    name: '',
    author: '',
    description: '',
    category: '',
    tags: '',
    coverFile: null,
    txtFile: null,
    txtFileName: '',
  };
  showUploadDialog.value = true;
}

function closeUploadDialog() {
  showUploadDialog.value = false;
}
async function submitUpload() {
  const form = uploadForm.value;
  if (!form.name || !form.author || !form.category || !form.tags) {
    useMessage.warning('请填写完整书籍信息');
    return;
  }
  if (!form.txtFile) {
    useMessage.warning('请选择 TXT 文件');
    return;
  }

  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('author', form.author);
  formData.append('description', form.description);
  formData.append('category', form.category);
  formData.append('tags', form.tags);
  if (form.coverFile) {
    const webpFile = await transformImage(form.coverFile, 'webp', 0.3);
    formData.append(
      'cover',
      new File([webpFile], form.coverFile.name, { type: 'image/webp' }),
    );
  }
  formData.append('txtFile', form.txtFile);

  uploading.value = true;
  const { success, message } = await useApiAdminBooks.uploadBook(formData);
  uploading.value = false;

  if (success) {
    useMessage.success('书籍上传成功');
    closeUploadDialog();
    await loadBooks();
  } else {
    useMessage.error(message || '上传失败');
  }
}

// ========== 切换书籍状态 ==========
async function toggleBookStatus(book: AdminBook) {
  const action = book.isActive ? '封禁' : '激活';
  if (!confirm(`确定要${action}书籍「${book.name}」吗？`)) return;
  const { success, message } = await useApiAdminBooks.toggleBookStatus(
    book.id,
    !book.isActive,
  );
  if (success) {
    useMessage.success(`书籍已${action}`);
    await loadBooks();
  } else {
    useMessage.error(message);
  }
}

// ========== 初始化 ==========
onBeforeMount(() => {
  loadBooks();
  loadCategories();
});
</script>
