<template>
  <component
    :is="resolvedTag"
    :class="classes"
    v-bind="passthroughAttrs"
    :style="[rootStyles, responsiveVars, attrs.style]"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed, useAttrs, type CSSProperties } from 'vue'
import styles from './BaseSpacer.module.css'

type SizeToken = 'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'4xl'
type Direction = 'horizontal'|'vertical'|'both'

interface BaseSpacerProps {
  /** Element tag */
  as?: keyof HTMLElementTagNameMap
  /** Logical direction: horizontal -> عرض، vertical -> ارتفاع، both -> هر دو */
  direction?: Direction
  /** سایز توکنی (از توکن‌ها یا fallback) */
  size?: SizeToken
  /** ابعاد سفارشی */
  width?: string | number
  height?: string | number
  /** محدودیت‌ها */
  min?: string | number
  max?: string | number
  /** گسترش در فلکس */
  grow?: boolean
  /** اندازهٔ واکنشی (mobile-first)؛ مقدار هر breakpoint یک طول CSS است */
  responsive?: Partial<Record<'xs'|'sm'|'md'|'lg'|'xl', string | number>>
  /** نسبت تصویر (CSS) */
  aspectRatio?: string
  /** پراپ‌های دلخواه به‌صورت CSS Variable */
  customProperties?: Record<string, string>
  /** کلاس اضافی */
  className?: string
}

const props = withDefaults(defineProps<BaseSpacerProps>(), {
  as: 'div',
  direction: 'both',
  size: 'md',
  grow: false
})

const attrs = useAttrs()
const resolvedTag = computed(() => props.as ?? 'div')

/** کلاس‌ها (با ادغام کلاس کاربر) */
const classes = computed(() => {
  const list: any[] = [styles.spacer]
  list.push(styles[`direction-${props.direction}`])
  if (props.size) list.push(styles[`size-${props.size}`])
  if (props.grow) list.push(styles.grow)
  if (props.className) list.push(props.className)
  if ((attrs as any).class) list.push((attrs as any).class)
  return list
})

/** تبدیل عدد به px */
function toLen(v?: string | number) {
  if (v === undefined || v === null) return undefined
  return typeof v === 'number' ? `${v}px` : v
}

/** استایل‌های پایه */
const rootStyles = computed((): CSSProperties => {
  const s: CSSProperties = {}

  // ابعاد مستقیم (در اولویت نسبت به size)
  if (props.width)  s['inlineSize' as any] = toLen(props.width)
  if (props.height) s['blockSize'  as any] = toLen(props.height)

  // محدودیت‌ها بر اساس جهت منطقی
  const min = toLen(props.min)
  const max = toLen(props.max)
  if (min) {
    if (props.direction === 'horizontal' || props.direction === 'both') s['minInlineSize' as any] = min
    if (props.direction === 'vertical'   || props.direction === 'both') s['minBlockSize'  as any] = min
  }
  if (max) {
    if (props.direction === 'horizontal' || props.direction === 'both') s['maxInlineSize' as any] = max
    if (props.direction === 'vertical'   || props.direction === 'both') s['maxBlockSize'  as any] = max
  }

  // Aspect ratio
  if (props.aspectRatio) s.aspectRatio = props.aspectRatio

  // CSS vars سفارشی
  if (props.customProperties) {
    for (const [k, v] of Object.entries(props.customProperties)) {
      (s as any)[`--${k}`] = v
    }
  }

  return s
})

/** سایزهای واکنشی به‌صورت CSS vars (در media queries مصرف می‌شوند) */
const responsiveVars = computed((): CSSProperties => {
  const r = props.responsive
  if (!r) return {}
  const vars: CSSProperties = {}
  if (r.xs !== undefined) (vars as any)['--spacer-size-xs'] = toLen(r.xs)
  if (r.sm !== undefined) (vars as any)['--spacer-size-sm'] = toLen(r.sm)
  if (r.md !== undefined) (vars as any)['--spacer-size-md'] = toLen(r.md)
  if (r.lg !== undefined) (vars as any)['--spacer-size-lg'] = toLen(r.lg)
  if (r.xl !== undefined) (vars as any)['--spacer-size-xl'] = toLen(r.xl)
  return vars
})

/** عبور بقیه attrs بدون class/style (چون بالاتر مرج‌شان کرده‌ایم) */
const passthroughAttrs = computed(() => {
  const { class: _c, style: _s, ...rest } = attrs as any
  return rest
})
</script>
