import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/widget.js'),
      name: 'SegurBotWidget',
      fileName: 'segurbot-widget',
      formats: ['umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        // Configuración específica para UMD
        format: 'umd',
        name: 'SegurBotWidget',
        exports: 'default'
      }
    },
    cssCodeSplit: false,
    sourcemap: false,
    minify: 'terser'
  }
})
