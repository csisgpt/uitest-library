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
import styles from './BaseGrid.module.css'

type GapToken = 'none'|'xs'|'sm'|'md'|'lg'|'xl'|'2xl'
type AlignItem = 'start'|'center'|'end'|'stretch'
type JustifyItem = 'start'|'center'|'end'|'stretch'
type Flow = 'row'|'column'|'row-dense'|'column-dense'

export interface BaseGridProps {
  /** عنصر ریشه */
  as?: keyof HTMLElementTagNameMap
  /** تعداد ستون‌ها (۱..۱۲) یا 'auto' */
  cols?: number | 'auto'
  /** فاصله بین آیتم‌ها (توکن یا طول سفارشی) */
  gap?: GapToken | string
  /** هم‌ترازی عمودی آیتم‌ها */
  align?: AlignItem
  /** هم‌ترازی افقی آیتم‌ها */
  justify?: JustifyItem
  /** جریان چیدمان خودکار گرید */
  flow?: Flow
  /** ریسپانسیو: تعداد ستون‌ها در bpها */
  responsive?: Partial<Record<'sm'|'md'|'lg'|'xl', number | 'auto'>>
  /** auto-fit با حداقل/حداکثر عرض */
  autoFit?: { minWidth: string; maxWidth?: string }
  /** CSS vars سفارشی */
  customProperties?: Record<string, string>
  /** کلاس اضافه */
  className?: string
}

const props = withDefaults(defineProps<BaseGridProps>(), {
  as: 'div',
  cols: 12,
  gap: 'md',
  flow: 'row',
})

const attrs = useAttrs()
const resolvedTag = computed(() => props.as ?? 'div')

/** کلاس‌های ماژول + ادغام class کاربر */
const classes = computed(() => {
  const list: any[] = [styles.grid]

  // ستون‌ها (کلاس‌های آماده 1..12 و auto)
  const baseCols = props.cols === 'auto' ? 'auto' : Math.min(Math.max(Number(props.cols ?? 12), 1), 12)
  list.push(styles[`cols-${baseCols}`])

  // فاصله‌ی توکنی → فقط var ست می‌شود (custom در style)
  if (typeof props.gap === 'string' && ['none','xs','sm','md','lg','xl','2xl'].includes(props.gap)) {
    list.push(styles[`gap-${props.gap as GapToken}`])
  }

  // align / justify
  if (props.align) list.push(styles[`align-${props.align}`])
  if (props.justify) list.push(styles[`justify-${props.justify}`])

  // flow
  if (props.flow === 'row-dense' || props.flow === 'column-dense') {
    list.push(styles.dense)
    list.push(props.flow.startsWith('column') ? styles.flowColumn : styles.flowRow)
  } else {
    list.push(props.flow === 'column' ? styles.flowColumn : styles.flowRow)
  }

  if (props.className) list.push(props.className)
  if ((attrs as any).class) list.push((attrs as any).class)

  return list
})

/** استایل‌های پایه (custom gap و autoFit + CSS vars عمومی) */
const rootStyles = computed((): CSSProperties => {
  const s: CSSProperties = {}

  // gap سفارشی (طول دلخواه)
  if (typeof props.gap === 'string' && !(['none','xs','sm','md','lg','xl','2xl'] as const).includes(props.gap as any)) {
    s['--grid-gap' as any] = props.gap
  }

  // autoFit → از CSS vars استفاده می‌کنیم (ایمن‌تر از inline ثابت)
  if (props.autoFit) {
    s['--grid-auto-min' as any] = props.autoFit.minWidth
    if (props.autoFit.maxWidth) s['--grid-auto-max' as any] = props.autoFit.maxWidth
  }

  // customProperties
  if (props.customProperties) {
    for (const [k, v] of Object.entries(props.customProperties)) {
      (s as any)[`--${k}`] = v
    }
  }

  return s
})

/** vars ریسپانسیو برای gap سفارشی و cols (از طریق data-* و CSS map می‌شوند) */
const responsiveVars = computed((): CSSProperties => {
  const s: CSSProperties = {}
  const bp = props.responsive
  if (!bp) return s

  // gap سفارشی برای bpها را هم می‌توانی بعداً اضافه کنی: --grid-gap-sm/md/... (در این نسخه روی cols تمرکز شده)
  return s
})

/** فقط attrs غیر از class/style (چون جدا ادغام‌شان کرده‌ایم) + data attrs ریسپانسیو */
const passthroughAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs as any
  // data-cols-* برای 1..12 یا auto
  if (props.responsive) {
    const map = props.responsive
    if (map.sm !== undefined) (rest as any)['data-cols-sm'] = String(map.sm)
    if (map.md !== undefined) (rest as any)['data-cols-md'] = String(map.md)
    if (map.lg !== undefined) (rest as any)['data-cols-lg'] = String(map.lg)
    if (map.xl !== undefined) (rest as any)['data-cols-xl'] = String(map.xl)
  }
  return rest
})
</script>
