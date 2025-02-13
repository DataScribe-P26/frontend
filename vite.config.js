import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },
  server: {
    allowedHosts: [
      'https://b25a-2409-40c2-2044-e3c0-8576-7b1b-aa1-deeb.ngrok-free.app' // Add your ngrok host here
    ],
    host: '0.0.0.0', // Allows access from any network
    port: 5173, // Change if needed
  }
})
