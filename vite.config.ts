import { execSync } from 'child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const gitCommit = execSync('git rev-parse --short HEAD').toString().trim()
const buildDate = new Date().toISOString()

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __GIT_COMMIT__: JSON.stringify(gitCommit),
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
})
