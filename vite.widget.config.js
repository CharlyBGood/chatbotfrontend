import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false, // No vaciar el directorio dist
    lib: {
      entry: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/widget.js'),
      name: 'SegurBotWidget',
      fileName: (format) => `segurbot-widget.${format}.js`,
      formats: ['umd', 'es']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    cssCodeSplit: false,
    sourcemap: false,
    minify: 'terser'
  }
})
