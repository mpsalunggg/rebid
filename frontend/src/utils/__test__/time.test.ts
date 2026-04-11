import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatDateTime, formatTimeAgo } from '../time'

describe('formatTimeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-06-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns just now under 60 seconds', () => {
    expect(formatTimeAgo('2025-06-15T11:59:10.000Z')).toBe('just now')
  })

  it('returns minutes between 1m and 59m', () => {
    expect(formatTimeAgo('2025-06-15T11:57:00.000Z')).toBe('3m')
  })

  it('returns hours between 1h and 23h', () => {
    expect(formatTimeAgo('2025-06-15T10:00:00.000Z')).toBe('2h')
  })

  it('returns days between 1d and 29d', () => {
    expect(formatTimeAgo('2025-06-14T12:00:00.000Z')).toBe('1d')
  })

  it('returns months for 30d or more', () => {
    expect(formatTimeAgo('2025-05-01T12:00:00.000Z')).toBe('1mo')
  })
})

describe('formatDateTime', () => {
  it('returns a non-empty localized string', () => {
    const out = formatDateTime('2025-06-15T09:30:00.000Z')
    expect(typeof out).toBe('string')
    expect(out.length).toBeGreaterThan(4)
    expect(out).toMatch(/2025/)
  })
})
