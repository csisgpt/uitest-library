<template>
  <component
    :is="resolvedTag"
    :class="classes"
    v-bind="$attrs"
    :style="rootStyles"
  >
    <!-- Divider rendering (no extra wrappers; renders between children) -->
    <template v-if="hasDivider">
      <template v-for="(child, i) in slotChildren" :key="i">
        <component :is="child" />
        <div
          v-if="i < slotChildren.length - 1"
          :class="styles.divider"
        />
      </template>
    </template>
    <template v-else>
      <slot />
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed, useSlots, type CSSProperties } from 'vue'
import styles from './BaseStack.module.css'

// --- Types ---------------------------------------------------------------
export type Direction = 'row' | 'column' | 'row-reverse' | 'column-reverse'
export type PadToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type Justify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'

export interface BaseStackProps {
  /** HTML tag to render */
  as?: keyof HTMLElementTagNameMap
  /** (Deprecated) alias for `as` to keep backward-compat */
  tag?: keyof HTMLElementTagNameMap

  /** Stack direction */
  direction?: Direction

  /** Spacing between items. Accepts design tokens or any CSS length (e.g. '12px', '1.25rem') */
  spacing?: PadToken | string

  /** Cross-axis alignment */
  align?: Align

  /** Main-axis justification */
  justify?: Justify

  /** Allow items to wrap */
  wrap?: boolean

  /** Add dividers between items */
  divider?: {
    color?: string
    thickness?: string // e.g. '1px'
    style?: 'solid' | 'dashed' | 'dotted'
  } | false

  /** Responsive overrides per breakpoint */
  responsive?: {
    sm?: Partial<Pick<BaseStackProps, 'direction' | 'spacing' | 'align' | 'justify'>>
    md?: Partial<Pick<BaseStackProps, 'direction' | 'spacing' | 'align' | 'justify'>>
    lg?: Partial<Pick<BaseStackProps, 'direction' | 'spacing' | 'align' | 'justify'>>
    xl?: Partial<Pick<BaseStackProps, 'direction' | 'spacing' | 'align' | 'justify'>>
  }

  /** Minimum item size when wrapping (row: min-width, column: min-height) */
  minItemSize?: string

  /** Maximum number of items to render (visually hides the rest) */
  maxItems?: number

  /** Additional CSS class */
  className?: string

  /** Enable subtle child transitions (opt-in) */
  animated?: boolean
}

const props = withDefaults(defineProps<BaseStackProps>(), {
  as: undefined,
  tag: 'div',
  direction: 'column',
  spacing: 'md',
  align: 'stretch',
  justify: 'start',
  wrap: false,
  divider: false,
  responsive: undefined,
  minItemSize: undefined,
  maxItems: undefined,
  className: undefined,
  animated: false,
})

const resolvedTag = computed(() => props.as ?? props.tag ?? 'div')

// Compute class list (module-safe)
const classes = computed(() => {
  const list: string[] = [styles.stack]
  // direction
  list.push(styles[`direction-${props.direction}`])
  // spacing (token classes only; custom spacing handled via inline style)
  const token = props.spacing
  const spacingClass = typeof token === 'string' && (['none','xs','sm','md','lg','xl','2xl'] as const).includes(token as any)
    ? styles[`spacing-${token as PadToken}`]
    : undefined
  if (spacingClass) list.push(spacingClass)

  // alignment & justification
  list.push(styles[`align-${props.align}`])
  list.push(styles[`justify-${props.justify}`])

  if (props.wrap) list.push(styles.wrap)
  if (props.divider) list.push(styles.withDivider)
  if (props.animated) list.push(styles.animated)
  if (props.className) list.push(props.className)
  return list
})

// One-time slot extraction to avoid recomputing VNodes
const slots = useSlots()
const slotChildren = computed(() => slots.default?.() ?? [])
const hasDivider = computed(() => !!props.divider)

// Data attrs for responsive overrides + CSS vars for custom gaps
const dataAttrs = computed(() => {
  const attrs: Record<string, any> = {}
  const br = props.responsive
  if (!br) return attrs

  const apply = (bp: 'sm'|'md'|'lg'|'xl') => {
    const conf = br?.[bp]
    if (!conf) return
    if (conf.direction) attrs[`data-dir-${bp}`] = conf.direction
    if (conf.align) attrs[`data-align-${bp}`] = conf.align
    if (conf.justify) attrs[`data-justify-${bp}`] = conf.justify

    if (conf.spacing) {
      const s = conf.spacing
      const isToken = (['none','xs','sm','md','lg','xl','2xl'] as const).includes(s as any)
      if (isToken) {
        attrs[`data-gap-${bp}`] = s
      } else if (typeof s === 'string') {
        // custom length placed into CSS var consumed by media query
        attrs[`data-gap-${bp}`] = 'custom'
        attrs[`style`] = {
          ...(attrs.style as CSSProperties),
          [`--gap-${bp}`]: s,
        }
      }
    }
  }
  apply('sm'); apply('md'); apply('lg'); apply('xl')
  return attrs
})

// Inline root styles (custom spacing / divider / wrap size / max items)
const rootStyles = computed((): CSSProperties => {
  const s: CSSProperties = {}
  // custom spacing at base
  if (typeof props.spacing === 'string' && !(['none','xs','sm','md','lg','xl','2xl'] as const).includes(props.spacing as any)) {
    s.gap = props.spacing
  }
  if (props.minItemSize && props.wrap) s['--min-item-size' as any] = props.minItemSize
  if (props.maxItems) s['--max-items' as any] = String(props.maxItems)
  if (props.divider) {
    const { color, thickness, style } = props.divider
    if (color) s['--divider-color' as any] = color
    if (thickness) s['--divider-thickness' as any] = thickness
    if (style) s['--divider-style' as any] = style
  }
  return s
})
</script>