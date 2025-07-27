# ui-library

Reusable Vue 3 component library built with Vite, Tailwind CSS and TypeScript.

## Installation

```bash
npm install ui-library
```

Add Tailwind CSS styles in your project:

```ts
// main.ts
import 'ui-library/theme/index.css'
```

## Usage

```ts
import { BaseButton, BaseInput } from 'ui-library'
```

```vue
<template>
  <BaseButton variant="primary">Click me</BaseButton>
  <BaseInput v-model="text" />
</template>
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
