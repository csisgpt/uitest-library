<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import Toolbar from './Toolbar.vue'
import styles from './RichTextEditor.module.css'
import type { ToolbarButton } from './types'

const props = withDefaults(defineProps<{
  content: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  toolbarButtons?: ToolbarButton[]
}>(), {
  content: '',
  placeholder: '',
  disabled: false,
  readonly: false,
  toolbarButtons: () => []
})

const emit = defineEmits<{(e:'update:content', value:string):void}>()

const editorRef = ref<HTMLDivElement>()
const fileInput = ref<HTMLInputElement>()
const history = ref<string[]>([])
const historyIndex = ref(-1)

const defaultButtons: ToolbarButton[] = [
  { command: 'undo', label: '↺' },
  { command: 'redo', label: '↻' },
  { command: 'bold', label: 'B' },
  { command: 'italic', label: 'I' },
  { command: 'underline', label: 'U' },
  { command: 'strike', label: 'S' },
  { command: 'paragraph', label: 'P' },
  { command: 'h1', label: 'H1' },
  { command: 'h2', label: 'H2' },
  { command: 'blockquote', label: '❝' },
  { command: 'code', label: '</>' },
  { command: 'orderedList', label: 'OL' },
  { command: 'unorderedList', label: 'UL' },
  { command: 'alignLeft', label: '⭰' },
  { command: 'alignCenter', label: '⭯' },
  { command: 'alignRight', label: '⭲' },
  { command: 'alignJustify', label: '⯀' },
  { command: 'link', label: '🔗' },
  { command: 'removeLink', label: '❌' },
  { command: 'image', label: '🖼️' },
  { command: 'hr', label: '―' },
  { command: 'color', label: 'A' },
  { command: 'background', label: '🖌️' },
  { command: 'indent', label: '→' },
  { command: 'outdent', label: '←' },
  { command: 'clear', label: '⌫' }
]

const buttons = computed(() => props.toolbarButtons.length ? props.toolbarButtons : defaultButtons)

watch(() => props.content, (v) => {
  if (editorRef.value && editorRef.value.innerHTML !== v) {
    editorRef.value.innerHTML = v
  }
})

const pushHistory = (val: string) => {
  // truncate redo stack
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(val)
  historyIndex.value = history.value.length - 1
}

const update = () => {
  if (!editorRef.value) return
  const val = editorRef.value.innerHTML
  emit('update:content', val)
  pushHistory(val)
}

const applyButton = async (btn: ToolbarButton) => {
  if (props.disabled || props.readonly) return
  if (!editorRef.value) return
  editorRef.value.focus()

  if (btn.command === 'image') {
    const url = window.prompt('Image URL or leave empty to upload file:')
    if (url) {
      exec('image', url)
      update()
    } else {
      fileInput.value?.click()
    }
    return
  }

  if (btn.command === 'color') {
    const color = window.prompt('Text color (css value):', '#000000')
    if (color) exec('color', color)
    update()
    return
  }

  if (btn.command === 'background') {
    const color = window.prompt('Background color (css value):', '#ffff00')
    if (color) exec('background', color)
    update()
    return
  }

  exec(btn.command as any, btn.value)
  update()
}

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    exec('image', reader.result as string)
    update()
  }
  reader.readAsDataURL(file)
}

function getRange(): Range | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return null
  return sel.getRangeAt(0)
}

function surroundInline(range: Range, tag: string) {
  const wrapper = document.createElement(tag)
  range.surroundContents(wrapper)
}

function wrapBlock(range: Range, tag: string) {
  let start: Node = range.startContainer
  while (start && start.nodeType === 3) start = start.parentElement as Node
  const block = (start as HTMLElement)
  if (!block) return
  if (block.tagName.toLowerCase() === tag) return
  const newEl = document.createElement(tag)
  newEl.innerHTML = block.innerHTML
  block.replaceWith(newEl)
  selectNode(newEl)
}

function selectNode(node: Node) {
  const sel = window.getSelection()
  if (!sel) return
  const range = document.createRange()
  range.selectNodeContents(node)
  sel.removeAllRanges()
  sel.addRange(range)
}

function toggleList(range: Range, tag: string) {
  const list = document.createElement(tag)
  const item = document.createElement('li')
  item.appendChild(range.extractContents())
  list.appendChild(item)
  range.insertNode(list)
  selectNode(list)
}

function setAlign(range: Range, align: string) {
  let node = range.startContainer as HTMLElement
  if (node.nodeType === 3) node = node.parentElement as HTMLElement
  node.style.textAlign = align
}

function surroundLink(range: Range, url: string) {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  range.surroundContents(a)
}

function removeLink(range: Range) {
  let node = range.startContainer
  while (node && (node as HTMLElement).tagName !== 'A') node = node.parentNode!
  if (node && node.parentNode) {
    const parent = node.parentNode
    while (node.firstChild) parent.insertBefore(node.firstChild, node)
    parent.removeChild(node)
  }
}

function insertImage(range: Range, src: string) {
  const img = document.createElement('img')
  img.src = src
  img.alt = ''
  range.insertNode(img)
}

function insertHr(range: Range) {
  const hr = document.createElement('hr')
  range.insertNode(hr)
}

function surroundSpan(range: Range, style: string, value: string) {
  const span = document.createElement('span')
  ;(span.style as any)[style] = value
  range.surroundContents(span)
}

function indent(range: Range, dir: 1 | -1) {
  let node = range.startContainer as HTMLElement
  if (node.nodeType === 3) node = node.parentElement as HTMLElement
  const current = parseInt(node.style.marginLeft || '0', 10)
  node.style.marginLeft = Math.max(0, current + dir * 20) + 'px'
}

function clearFormat(range: Range) {
  const text = range.toString()
  range.deleteContents()
  range.insertNode(document.createTextNode(text))
}

function undo() {
  if (historyIndex.value <= 0) return
  historyIndex.value--
  const val = history.value[historyIndex.value]
  if (editorRef.value) editorRef.value.innerHTML = val
  emit('update:content', val)
}

function redo() {
  if (historyIndex.value >= history.value.length - 1) return
  historyIndex.value++
  const val = history.value[historyIndex.value]
  if (editorRef.value) editorRef.value.innerHTML = val
  emit('update:content', val)
}

function exec(command: string, value?: string) {
  const range = getRange()
  if (!range) return
  switch (command) {
    case 'bold':
      surroundInline(range, 'strong')
      break
    case 'italic':
      surroundInline(range, 'em')
      break
    case 'underline':
      surroundInline(range, 'u')
      break
    case 'strike':
      surroundInline(range, 's')
      break
    case 'paragraph':
      wrapBlock(range, 'p')
      break
    case 'h1':
      wrapBlock(range, 'h1')
      break
    case 'h2':
      wrapBlock(range, 'h2')
      break
    case 'h3':
      wrapBlock(range, 'h3')
      break
    case 'h4':
      wrapBlock(range, 'h4')
      break
    case 'h5':
      wrapBlock(range, 'h5')
      break
    case 'h6':
      wrapBlock(range, 'h6')
      break
    case 'code':
      wrapBlock(range, 'pre')
      break
    case 'blockquote':
      wrapBlock(range, 'blockquote')
      break
    case 'orderedList':
      toggleList(range, 'ol')
      break
    case 'unorderedList':
      toggleList(range, 'ul')
      break
    case 'alignLeft':
      setAlign(range, 'left')
      break
    case 'alignCenter':
      setAlign(range, 'center')
      break
    case 'alignRight':
      setAlign(range, 'right')
      break
    case 'alignJustify':
      setAlign(range, 'justify')
      break
    case 'link':
      if (value) surroundLink(range, value)
      break
    case 'removeLink':
      removeLink(range)
      break
    case 'image':
      if (value) insertImage(range, value)
      break
    case 'hr':
      insertHr(range)
      break
    case 'color':
      if (value) surroundSpan(range, 'color', value)
      break
    case 'background':
      if (value) surroundSpan(range, 'backgroundColor', value)
      break
    case 'indent':
      indent(range, 1)
      break
    case 'outdent':
      indent(range, -1)
      break
    case 'clear':
      clearFormat(range)
      break
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (!e.ctrlKey) return
  const key = e.key.toLowerCase()
  if (key === 'b') {
    e.preventDefault(); exec('bold'); update()
  } else if (key === 'i') {
    e.preventDefault(); exec('italic'); update()
  } else if (key === 'u') {
    e.preventDefault(); exec('underline'); update()
  } else if (key === 'z') {
    e.preventDefault(); undo()
  } else if (key === 'y') {
    e.preventDefault(); redo()
  }
}

const onPaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') || ''
  const range = getRange()
  if (!range) return
  range.deleteContents()
  range.insertNode(document.createTextNode(text))
  range.collapse(false)
  update()
}

nextTick(() => {
  if (props.content) pushHistory(props.content)
})
</script>

<template>
  <div :class="[styles.wrapper, (disabled || readonly) && styles.disabled]">
    <Toolbar :buttons="buttons" :disabled="disabled || readonly" @command="applyButton" />
    <div
      ref="editorRef"
      :class="styles.editor"
      :contenteditable="!disabled && !readonly"
      :data-placeholder="placeholder"
      @input="update"
      @keydown="onKeydown"
      @paste="onPaste"
    ></div>
    <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="onFileChange" />
  </div>
</template>
