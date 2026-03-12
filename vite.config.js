import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/april_fools/',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: false,
    open: true
  },
  preview: {
    host: '127.0.0.1',
    port: 3000
  }
})
