import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        background: fileURLToPath(new URL('./src/Lib/background.ts', import.meta.url))
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'background'
            ? 'assets/js/[name].js'
            : 'assets/[name]-[hash].js'
        }
      }
    }
  }
})
