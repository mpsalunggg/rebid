import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
    css: true,
    setupFiles: ['./src/test/msw.ts'],
    coverage: {
      provider: 'v8',
      // include: ['src/**/*.{ts,tsx}'],
      enabled: false,
      exclude: ['**/*.{test,spec}.{ts,tsx}', 'node_modules', '.next'],
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 85,
        statements: 80,
      },
      reporter: ['text', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
