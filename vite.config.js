import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Configuración para DevTools y HMR
      fastRefresh: true,
      jsxRuntime: 'automatic'
    }), 
    tailwindcss()
  ],
  define: {
    // Variables esenciales
    'process.env.NODE_ENV': JSON.stringify(mode),
    'global': 'globalThis'
  },
  server: {
    port: 5173,
    host: true, // Exponer en la red local
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime']
  },
  esbuild: {
    keepNames: true,
    // Mejor debugging para componentes
    jsxDev: mode === 'development'
  }
}))
