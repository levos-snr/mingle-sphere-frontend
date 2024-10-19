import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  server: {
    port: 3000,
    cors: true,
    proxy: {
      "/api": {
        target: "https://mingle-sphere-backend.vercel.app/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})