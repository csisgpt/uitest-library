import { defineConfig } from 'tailwindcss/helpers'

export default defineConfig({
  content: [],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#3AB0FF',
          DEFAULT: '#0080FF',
          dark: '#005BBB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        full: '9999px',
      },
      spacing: {
        18: '4.5rem',
      },
      boxShadow: {
        outline: '0 0 0 3px rgba(0, 128, 255, 0.5)',
      },
    },
  },
  plugins: [],
})
