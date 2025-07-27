import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'UiLibrary',
      fileName: format => `ui-library.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'tailwindcss'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
