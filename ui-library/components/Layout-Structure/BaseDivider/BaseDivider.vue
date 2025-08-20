<template>
  <div
    :class="['base-divider', dividerClass]"
    :style="dividerStyle"
    :aria-disabled="isDisabled ? 'true' : 'false'"
  />
</template>

<script setup>
  import { defineProps, computed } from 'vue';
  import styles from './BaseDivider.module.css'; // بارگذاری فایل CSS ماژول

  // تعریف پراپ‌ها
  const props = defineProps({
    color: {
      type: String,
      default: 'var(--color-border)', // رنگ پیش‌فرض
    },
    height: {
      type: String,
      default: '1px', // ارتفاع پیش‌فرض
    },
    margin: {
      type: String,
      default: 'var(--space-md) 0', // فاصله پیش‌فرض
    },
    hoverColor: {
      type: String,
      default: 'var(--color-muted)', // رنگ پیش‌فرض هنگام هاور
    },
    disabled: {
      type: Boolean,
      default: false, // وضعیت غیرفعال
    },
    transitionDuration: {
      type: String,
      default: 'var(--transition-base)', // زمان انتقال پیش‌فرض
    },
    borderRadius: {
      type: String,
      default: 'var(--radius-sm)', // گوشه‌های گرد پیش‌فرض
    },
  });

  // بررسی وضعیت غیرفعال بودن دیوایدر
  const isDisabled = props.disabled;

  // کلاس‌های دیوایدر بر اساس پراپ‌ها
  const dividerClass = computed(() => {
    return {
      [styles['base-divider--disabled']]: isDisabled,
    };
  });

  // استایل‌های دیوایدر که براساس پراپ‌ها تنظیم می‌شوند
  const dividerStyle = computed(() => ({
    backgroundColor: props.color,
    height: props.height,
    margin: props.margin,
    borderRadius: props.borderRadius,
    transition: `background-color ${props.transitionDuration}, margin ${props.transitionDuration}`,
  }));
</script>

<style scoped>
  /* استایل‌های کامپوننت در اینجا قرار نمی‌گیرد. تمامی استایل‌ها از فایل BaseDivider.module.css بارگذاری می‌شود. */
</style>
