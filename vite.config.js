import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import sass from 'vite-plugin-sass';

export default defineConfig({
  plugins: [vue(), vueDevTools(), sass()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/scss/icons.scss";
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
