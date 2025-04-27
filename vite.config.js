import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Backend ka URL
        changeOrigin: true,              // Origin ko change karne ke liye
        secure: false,                   // Agar backend HTTP pe ho toh
      }
    }
  }
})
