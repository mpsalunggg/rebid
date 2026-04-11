import { afterEach, describe, expect, it, vi } from 'vitest'
import { getWebSocketUrl } from '../wsUrl'

describe('getWebSocketUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('maps http base to ws', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8080')
    expect(getWebSocketUrl('/api/v1/auctions/x/ws')).toBe(
      'ws://localhost:8080/api/v1/auctions/x/ws',
    )
  })

  it('maps https base to wss', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com')
    expect(getWebSocketUrl('/ws')).toBe('wss://api.example.com/ws')
  })

  it('adds leading slash when path has none', () => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://127.0.0.1:3001')
    expect(getWebSocketUrl('socket')).toBe('ws://127.0.0.1:3001/socket')
  })
})
