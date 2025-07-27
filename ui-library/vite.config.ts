import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    dts({ outputDir: 'dist/types', include: ['components', 'index.ts'] })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'UiLibrary',
      fileName: format => (format === 'es' ? 'index.js' : `index.${format}.js`),
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
