import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    testTimeout: 20_000,
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
  },
})
