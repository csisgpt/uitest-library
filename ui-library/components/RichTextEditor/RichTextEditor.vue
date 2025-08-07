<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Toolbar from './Toolbar.vue'
import styles from './RichTextEditor.module.css'
import { useCommands, detectFormats, type Command } from './commands'

const props = withDefaults(defineProps<{
  content?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
}>(), {
  content: ''
})

const emit = defineEmits<{(
  e: 'update:content', value: string
): void; (e: 'focus'): void; (e: 'blur'): void }>()

const editorRef = ref<HTMLDivElement>()
const active = ref<Set<Command>>(new Set())
const history = ref<string[]>([])
const historyIndex = ref(-1)

const { exec } = useCommands(editorRef)

const pushHistory = () => {
  if (!editorRef.value) return
  const html = editorRef.value.innerHTML
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(html)
  historyIndex.value++
}

const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    editorRef.value!.innerHTML = history.value[historyIndex.value]
    emit('update:content', editorRef.value!.innerHTML)
  }
}

const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    editorRef.value!.innerHTML = history.value[historyIndex.value]
    emit('update:content', editorRef.value!.innerHTML)
  }
}

const handleCommand = (cmd: Command, value?: string) => {
  if (cmd === 'undo') return undo()
  if (cmd === 'redo') return redo()
  if (cmd === 'link' && !value) value = prompt('Enter URL') || undefined
  if (cmd === 'image' && !value) value = prompt('Enter image URL') || undefined
  exec(cmd, value)
  emit('update:content', editorRef.value?.innerHTML || '')
  pushHistory()
  updateActive()
}

const updateActive = () => {
  active.value = detectFormats()
}

const onInput = () => {
  emit('update:content', editorRef.value?.innerHTML || '')
  pushHistory()
}

const onPaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') || ''
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return
  const range = sel.getRangeAt(0)
  range.deleteContents()
  range.insertNode(document.createTextNode(text))
  range.collapse(false)
  emit('update:content', editorRef.value?.innerHTML || '')
  pushHistory()
}

watch(() => props.content, (val) => {
  if (editorRef.value && editorRef.value.innerHTML !== val) {
    editorRef.value.innerHTML = val || ''
  }
})

onMounted(() => {
  if (props.content && editorRef.value) {
    editorRef.value.innerHTML = props.content
  }
  pushHistory()
  document.addEventListener('selectionchange', updateActive)
})

onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', updateActive)
})

const onKey = (e: KeyboardEvent) => {
  if (!e.ctrlKey && !e.metaKey) return
  switch (e.key.toLowerCase()) {
    case 'b':
      e.preventDefault()
      handleCommand('bold')
      break
    case 'i':
      e.preventDefault()
      handleCommand('italic')
      break
    case 'u':
      e.preventDefault()
      handleCommand('underline')
      break
    case 'z':
      e.preventDefault()
      undo()
      break
    case 'y':
      e.preventDefault()
      redo()
      break
  }
}
</script>

<template>
  <div :class="styles.wrapper" :data-readonly="readonly" :data-disabled="disabled">
    <slot name="toolbar" :active="active" :command="handleCommand">
      <Toolbar :disabled="disabled || readonly" :active="active" @command="handleCommand" />
    </slot>
    <div
      ref="editorRef"
      :class="styles.editor"
      :contenteditable="!readonly && !disabled"
      :data-placeholder="placeholder"
      @input="onInput"
      @paste="onPaste"
      @keydown="onKey"
      @focus="() => emit('focus')"
      @blur="() => emit('blur')"
    ></div>
  </div>
</template>
