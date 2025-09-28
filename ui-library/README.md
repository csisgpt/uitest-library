# 📦 ui-library-csis

کتابخانهٔ کامپوننت‌های **Vue 3** با تمرکز روی DX خوب، Tree-Shaking و سفارشی‌سازی مبتنی بر CSS Variables.

<p align="center">
  <a href="https://www.npmjs.com/package/ui-library-csis">
    <img alt="npm" src="https://img.shields.io/npm/v/ui-library-csis.svg?logo=npm&label=npm&color=cb0000">
  </a>
  <a href="https://bundlephobia.com/package/ui-library-csis">
    <img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/ui-library-csis?label=minzip">
  </a>
  <img alt="types included" src="https://img.shields.io/badge/types-included-4B9FE1">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-0A7">
</p>

## فهرست

* [ویژگی‌ها](#ویژگیها)
* [نصب](#نصب)
* [شروع سریع](#شروع-سریع)
* [ایمپورت درختی](#ایمپورت-درختی)
* [استایل و تم](#استایل-و-تم)
* [TypeScript / IntelliSense](#typescript--intellisense)
* [وابستگی‌ها](#وابستگیها)
* [SSR / Nuxt](#ssr--nuxt)
* [Build و انتشار](#build-و-انتشار)
* [مشارکت](#مشارکت)
* [مجوز](#مجوز)

## ویژگی‌ها

* ⚡️ ساخته‌شده با **Vite** و **Vue 3**
* 🌲 **Tree-Shaking** و خروجی‌های ESM/UMD
* 🎨 سیستم **Theme** با CSS Variables (لایت/دارک)
* 🧩 مجموعه کامپوننت‌های پرکاربرد (Table, Popover, Toast, Grid/Flex و …)
* 🧰 **Types داخلی** (خروجی `dist-types/`) برای IntelliSense بهتر

---

## نصب

```bash
# npm
npm i ui-library-csis

# yarn
yarn add ui-library-csis

# pnpm
pnpm add ui-library-csis
```

> پیش‌نیاز: `vue@^3.3.0` (به‌عنوان peer نصب شود)

---

## شروع سریع

**main.ts**

```ts
import { createApp } from 'vue'
import App from './App.vue'

// استایل کتابخانه (یک‌بار در ورودی پروژه)
import 'ui-library-csis/style.css'

// ایمپورت گزینشی کامپوننت‌ها
import { BaseButton, BaseTable } from 'ui-library-csis'

createApp(App)
  .component('BaseButton', BaseButton) // ثبت سراسری (اختیاری)
  .component('BaseTable', BaseTable)
  .mount('#app')
```

**App.vue**

```vue
<script setup lang="ts">
import { BaseButton } from 'ui-library-csis'
</script>

<template>
  <BaseButton @click="() => alert('Hi')">سلام</BaseButton>
</template>
```

---

## ایمپورت درختی

فقط همان چیزی را که نیاز دارید ایمپورت کنید:

```ts
import { BasePopover, BaseGrid, BaseGridItem } from 'ui-library-csis'
```

---

## استایل و تم

* **استایل اصلی:** با یک ایمپورت فعال می‌شود:

  ```ts
  import 'ui-library-csis/style.css'
  ```
* کتابخانه از **CSS Variables** برای رنگ‌ها، فاصله‌ها، ترنزیشن‌ها و… استفاده می‌کند. برای سفارشی‌سازی، کافی‌ست مقادیر را override کنید:

  ```css
  :root {
    --color-primary: #1e8759;
    --transition-fast: 120ms ease-in-out;
    --radius-md: 8px;
  }
  ```
* حالت تاریک با اتریبیوت داده‌ای فعال می‌شود (اگر در پروژه‌ات این الگو را گذاشتی):

  ```html
  <html data-theme="dark">…</html>
  ```

> نکته: `style.css` شامل توکن‌ها (spacing/radius/typography/…)، theme لایت/دارک و فونت‌های تعریف‌شده در پکیج است.

---

## TypeScript / IntelliSense

* دکلریشن‌ها در مسیر **`dist-types/`** منتشر می‌شوند و به‌صورت خودکار توسط IDEها شناخته می‌شوند.
* اگر IntelliSense را نمی‌بینی:

  * پکیج را به آخرین نسخه به‌روزرسانی کن
  * VS Code → **TypeScript: Restart TS Server**
  * مطمئن شو `moduleResolution` پروژهٔ مصرف‌کننده با Vite سازگار است (مثلاً `bundler`، `node16` یا `nodenext`).

---

## وابستگی‌ها

این پکیج از برخی وابستگی‌ها به‌عنوان **Peer** استفاده می‌کند تا داخل باندل شما تکراری نشوند:

* **Peer Dependencies**

  * `vue` `^3.3.0`
  * (در صورت استفاده از آیکن‌ها) `@tabler/icons-vue` `^3`
  * (برای پاپ‌اور/منو) `@popperjs/core`

اگر به آیکن/پاپ‌اور نیاز دارید:

```bash
npm i @tabler/icons-vue @popperjs/core
```

---

## SSR / Nuxt

* قابل استفاده در SSR/Nuxt 3.
* اگر کامپوننتی از DOM/Window استفاده می‌کند، در Nuxt داخل `<client-only>` رندرش کن:

  ```vue
  <client-only>
    <BasePopover />
  </client-only>
  ```
* `style.css` را در ورودی کلاینت ایمپورت کن.

---

## Build و انتشار

**اسکریپت‌ها (داخل پکیج):**

```json
{
  "scripts": {
    "dev": "vite --config vite.config.ts",
    "build": "vite build && vue-tsc -p tsconfig.types.json",
    "preview": "vite preview",
    "prepublishOnly": "npm run build"
  }
}
```

**خروجی‌ها:**

* ESM: `dist/ui-library.es.js`
* UMD: `dist/ui-library.umd.js`
* CSS: `dist/style.css` (با اکسپورت `ui-library-csis/style.css`)
* Types: `dist-types/index.d.ts`

**انتشار:**

```bash
npm version patch
npm publish --access public
```

> مطمئن شو در `package.json`:
>
> * `publishConfig.access = "public"`
> * فیلد `exports` شامل مسیر `./style.css` و `types` از `dist-types` است
> * `vue` داخل **peerDependencies** و (برای بیلد) در **devDependencies** وجود دارد

---

## مشارکت

* باگ/پیشنهاد: لطفاً Issue باز کنید.
* Pull Request ها خوش‌آمدند ✨

---

## مجوز

**MIT** — از استفاده لذت ببر 🙌
