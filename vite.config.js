import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:5000'  
          : 'https://mernstackbackend-production-86ac.up.railway.app', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
