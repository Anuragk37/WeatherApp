import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174 // Specify the desired port here
  },
  test: {
    testEnvironment: 'jsdom',
  }
})
