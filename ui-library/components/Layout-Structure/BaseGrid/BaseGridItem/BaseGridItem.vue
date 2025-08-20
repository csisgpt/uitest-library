<template>
  <component
    :is="resolvedTag"
    :class="classes"
    v-bind="passthroughAttrs"
    :style="[rootStyles, responsiveVars, attrs.style]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs, type CSSProperties } from 'vue'
import styles from './BaseGridItem.module.css'

type AlignSelf = 'start'|'center'|'end'|'stretch'
type JustifySelf = 'start'|'center'|'end'|'stretch'

export interface BaseGridItemProps {
  as?: keyof HTMLElementTagNameMap
  colSpan?: number | 'full'
  rowSpan?: number | 'full'
  area?: string
  colStart?: number
  colEnd?: number
  rowStart?: number
  rowEnd?: number
  responsive?: Partial<Record<'sm'|'md'|'lg'|'xl', number | 'full'>>
  alignSelf?: AlignSelf
  justifySelf?: JustifySelf
  order?: number
  className?: string
}

const props = withDefaults(defineProps<BaseGridItemProps>(), {
  as: 'div'
})

const attrs = useAttrs()
const resolvedTag = computed(() => props.as ?? 'div')

const classes = computed(() => {
  const list: any[] = [styles.gridItem]

  // span کلاس‌های آماده
  if (props.colSpan === 'full') list.push(styles['colSpan-full'])
  else if (typeof props.colSpan === 'number') list.push(styles[`colSpan-${Math.min(Math.max(props.colSpan,1),12)}`])

  if (props.rowSpan === 'full') list.push(styles['rowSpan-full'])
  else if (typeof props.rowSpan === 'number') list.push(styles[`rowSpan-${Math.max(props.rowSpan,1)}`])

  if (props.className) list.push(props.className)
  if ((attrs as any).class) list.push((attrs as any).class)

  return list
})

const rootStyles = computed((): CSSProperties => {
  const s: CSSProperties = {}
  if (props.colStart) s.gridColumnStart = String(props.colStart)
  if (props.colEnd) s.gridColumnEnd = String(props.colEnd)
  if (props.rowStart) s.gridRowStart = String(props.rowStart)
  if (props.rowEnd) s.gridRowEnd = String(props.rowEnd)
  if (props.area) s.gridArea = props.area
  if (props.alignSelf) s.alignSelf = props.alignSelf
  if (props.justifySelf) s.justifySelf = props.justifySelf
  if (props.order !== undefined) s.order = props.order
  return s
})

/** data-attrs ریسپانسیو (برای span) + vars */
const passthroughAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs as any
  if (props.responsive) {
    const map = props.responsive
    if (map.sm !== undefined) (rest as any)['data-colspan-sm'] = String(map.sm)
    if (map.md !== undefined) (rest as any)['data-colspan-md'] = String(map.md)
    if (map.lg !== undefined) (rest as any)['data-colspan-lg'] = String(map.lg)
    if (map.xl !== undefined) (rest as any)['data-colspan-xl'] = String(map.xl)
  }
  return rest
})

const responsiveVars = computed((): CSSProperties => ({}))
</script>
