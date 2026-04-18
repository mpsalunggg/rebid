import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from '@/mocks/server'

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error', // atau 'warn' saat masih banyak endpoint belum di-mock
  }),
)
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
