<!-- AuthorWritingEditor.vue -->
<template>
  <div class="writing-editor">
    <div
      ref="editorRef"
      class="writing-area"
      :contenteditable="!props.disabled"
      spellcheck="false"
      :style="{ height: props.contentHeight }"
      @input="handleInput"
      @keydown.enter.exact="handleEnter"
      @paste="handlePaste"
    >
      <p><br /></p>
    </div>

    <div class="status-bar text-description">{{ charCount }} 字</div>
  </div>
</template>

<script setup lang="ts">
import { useThrottle } from '@qianrenni/core';
import { ref, onMounted, nextTick, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    contentHeight?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: '',
    contentHeight: 'auto',
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
const emitUpdate = useThrottle((text: string) => {
  emit('update:modelValue', text);
});
const editorRef = ref<HTMLDivElement | null>(null);
const charCount = ref(0);

// 将纯文本转为 <p> 段落结构
function textToParagraphs(text: string): string {
  if (!text?.trim()) return '<p><br></p>';
  const paragraphs = text
    .split(/\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p !== '')
    .map((p) => `<p>${p}</p>`)
    .join('');
  return paragraphs || '<p><br></p>';
}

// 将 <p> 结构转为纯文本(\n 分隔)
function paragraphsToText(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return Array.from(temp.querySelectorAll('p'))
    .map((p) => p.innerText)
    .join('\n');
}

// 初始化内容
onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = textToParagraphs(props.modelValue);
    updateCharCount();
  }
});

// 监听外部 modelValue 变化(如草稿恢复)
watch(
  () => props.modelValue,
  (newVal) => {
    if (editorRef.value) {
      const currentText = paragraphsToText(editorRef.value.innerHTML);
      if (currentText !== newVal) {
        editorRef.value.innerHTML = textToParagraphs(newVal);
      }
    }
  },
);

// 处理输入:同步到 modelValue
function handleInput() {
  if (!editorRef.value) return;
  const text = paragraphsToText(editorRef.value.innerHTML);
  emitUpdate(text);
}

// 拦截回车:创建新 <p> 段落
function handleEnter(e: KeyboardEvent) {
  e.preventDefault();

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !editorRef.value) return;

  const range = selection.getRangeAt(0);
  const newParagraph = document.createElement('p');
  newParagraph.innerHTML = '<br>';

  range.deleteContents();
  range.insertNode(newParagraph);

  // 聚焦到新段落
  const newRange = document.createRange();
  newRange.selectNodeContents(newParagraph);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

  handleInput();
}

// 粘贴时转为纯文本段落
function handlePaste(e: ClipboardEvent) {
  e.preventDefault();
  const text = e.clipboardData?.getData('text/plain') || '';

  const paragraphs =
    text
      .split(/\r?\n/)
      .filter((p) => p.trim() !== '')
      .map((p) => `<p>${p}</p>`)
      .join('') || '<p><br></p>';

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !editorRef.value) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const div = document.createElement('div');
  div.innerHTML = paragraphs;
  const frag = document.createDocumentFragment();
  while (div.firstChild) {
    frag.appendChild(div.firstChild);
  }
  range.insertNode(frag);

  // 聚焦到最后
  const lastNode = frag.lastChild || frag;
  const newRange = document.createRange();
  newRange.selectNodeContents(lastNode);
  newRange.collapse(false);
  selection.removeAllRanges();
  selection.addRange(newRange);

  handleInput();
}

// 更新字数
function updateCharCount() {
  if (editorRef.value) {
    charCount.value = paragraphsToText(editorRef.value.innerHTML).length;
  }
}
watch(
  () => props.modelValue,
  () => updateCharCount(),
);
// 暴露 focus 方法
defineExpose({
  focus: () => {
    nextTick(() => {
      if (editorRef.value) {
        const firstP = editorRef.value.querySelector('p');
        if (firstP) {
          const range = document.createRange();
          range.selectNodeContents(firstP);
          range.collapse(true);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }
    });
  },
});
</script>

<style scoped>
/* 古籍书香风格 */
.writing-editor {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  background: var(--content-editor-background-color) /* 泛黄稿纸底色 */;
  border-radius: 0.5rem;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(139, 69, 19, 0.1);
  padding: 1rem;
  padding-bottom: 1rem;
  font-family:
    'Songti SC', 'SimSun', 'STSong', serif, Georgia, 'Times New Roman';
}

.writing-area {
  overflow-y: auto;
  font-size: 1.25rem;
  line-height: 2.4rem;
  color: var(--content-editor-color); /* 深墨色 */
  background: transparent;
  outline: none;
  border: none;
  caret-color: var(--content-editor-pointer-color); /* 棕褐色光标 */
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  line-break: anywhere;
}
.writing-area::-webkit-scrollbar {
  width: 0.125rem;
  background-color: transparent;
}
.writing-area::-webkit-scrollbar-thumb {
  background-color: var(--content-editor-color);
}

/* 替换原有的 .writing-area p 相关样式 */
:deep(.writing-area p) {
  text-indent: 2rem; /* 首行缩进生效！ */
  line-height: inherit;
  font-size: inherit;
}

.status-bar {
  margin-top: 0.5rem;
  text-align: right;
  color: #8b5a2b; /* 栗棕色 */
  font-size: 0.95rem;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  opacity: 0.85;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .writing-area {
    font-size: 1.1rem;
    line-height: 2.1rem;
  }
  .writing-editor {
    padding: 0.5rem;
  }
}
</style>
