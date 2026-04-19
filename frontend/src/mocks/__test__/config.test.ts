import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiUrl } from '../config'

describe('mocks/config API_BASE', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('uses NEXT_PUBLIC_API_URL when set', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://custom-from-env.test')
    vi.resetModules()
    const { BASE_URL } = await import('@/constants/url')
    expect(BASE_URL).toBe('http://custom-from-env.test')
  })

  it('falls back to localhost when env is unset', async () => {
    vi.unstubAllEnvs()
    vi.resetModules()
    const { BASE_URL } = await import('@/constants/url')
    expect(BASE_URL).toBe('http://localhost:8080')
  })

  it('handles empty path', () => {
    expect(apiUrl('')).toBe('http://localhost:8080/')
  })
})
