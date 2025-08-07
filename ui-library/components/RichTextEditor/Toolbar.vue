<script setup lang="ts">
import styles from './Toolbar.module.css'
import type { Command } from './commands'

const props = defineProps<{ active: Set<Command>; disabled?: boolean }>()
const emit = defineEmits<{ (e: 'command', cmd: Command, value?: string): void }>()

const isActive = (cmd: Command) => props.active.has(cmd)
</script>

<template>
  <div :class="styles.toolbar">
    <select :disabled="props.disabled" @change="emit('command', $event.target.value)">
      <option value="p">P</option>
      <option value="h1">H1</option>
      <option value="h2">H2</option>
      <option value="h3">H3</option>
      <option value="blockquote">Quote</option>
      <option value="code">Code</option>
    </select>
    <button :class="[styles.button, isActive('bold') && styles.active]" :disabled="props.disabled" @click="emit('command','bold')"><strong>B</strong></button>
    <button :class="[styles.button, isActive('italic') && styles.active]" :disabled="props.disabled" @click="emit('command','italic')"><em>I</em></button>
    <button :class="[styles.button, isActive('underline') && styles.active]" :disabled="props.disabled" @click="emit('command','underline')"><u>U</u></button>
    <button :class="[styles.button, isActive('strike') && styles.active]" :disabled="props.disabled" @click="emit('command','strike')"><s>S</s></button>
    <button :class="[styles.button, isActive('orderedList') && styles.active]" :disabled="props.disabled" @click="emit('command','orderedList')">OL</button>
    <button :class="[styles.button, isActive('unorderedList') && styles.active]" :disabled="props.disabled" @click="emit('command','unorderedList')">UL</button>
    <button :class="styles.button" :disabled="props.disabled" @click="emit('command','link')">🔗</button>
    <button :class="styles.button" :disabled="props.disabled" @click="emit('command','image')">🖼️</button>
    <button :class="[styles.button, isActive('alignLeft') && styles.active]" :disabled="props.disabled" @click="emit('command','alignLeft')">⯇</button>
    <button :class="[styles.button, isActive('alignCenter') && styles.active]" :disabled="props.disabled" @click="emit('command','alignCenter')">≡</button>
    <button :class="[styles.button, isActive('alignRight') && styles.active]" :disabled="props.disabled" @click="emit('command','alignRight')">⯈</button>
    <input type="color" :disabled="props.disabled" @input="emit('command','textColor', ($event.target as HTMLInputElement).value)" class="styles.color" />
    <input type="color" :disabled="props.disabled" @input="emit('command','backgroundColor', ($event.target as HTMLInputElement).value)" class="styles.color" />
    <button :class="styles.button" :disabled="props.disabled" @click="emit('command','undo')">↺</button>
    <button :class="styles.button" :disabled="props.disabled" @click="emit('command','redo')">↻</button>
    <button :class="styles.button" :disabled="props.disabled" @click="emit('command','hr')">―</button>
    <button :class="styles.button" :disabled="props.disabled" @click="emit('command','clear')">✖</button>
  </div>
</template>
