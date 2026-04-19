import { describe, it, expect, vi, beforeEach } from 'vitest'
import { customBaseQuery } from '../baseQuery'
import { BaseQueryApi } from '@reduxjs/toolkit/query'

const { mockRawBaseQuery } = vi.hoisted(() => ({
  mockRawBaseQuery: vi.fn(),
}))

vi.mock('@reduxjs/toolkit/query', () => ({
  fetchBaseQuery: vi.fn(() => mockRawBaseQuery),
}))

const mockApi = {} as BaseQueryApi
const call = (args = { url: '/test' }) => customBaseQuery(args, mockApi, {})

beforeEach(() => {
  mockRawBaseQuery.mockReset()
})

describe('customBaseQuery', () => {
  describe('success', () => {
    it('returns data when no error', async () => {
      mockRawBaseQuery.mockResolvedValue({ data: { id: 1 } })

      const result = await call()

      expect(result).toEqual({ data: { id: 1 } })
    })
  })

  describe('known string error status', () => {
    it.each([
      ['FETCH_ERROR', 'Network error, please check your connection'],
      ['TIMEOUT_ERROR', 'Request timed out'],
      ['PARSING_ERROR', 'Invalid response from server'],
    ])('status %s → "%s"', async (status, expectedMessage) => {
      mockRawBaseQuery.mockResolvedValue({ error: { status } })

      const result = await call()

      expect(result).toEqual({
        error: { error: true, message: expectedMessage, status: 500 },
      })
    })
  })

  describe('HTTP numeric error status', () => {
    it('uses message from response body', async () => {
      mockRawBaseQuery.mockResolvedValue({
        error: { status: 422, data: { message: 'Validation failed' } },
      })

      expect(await call()).toEqual({
        error: { error: true, message: 'Validation failed', status: 422 },
      })
    })

    it('fallback to "Something went wrong" if body has no message', async () => {
      mockRawBaseQuery.mockResolvedValue({
        error: { status: 500, data: {} },
      })

      expect(await call()).toEqual({
        error: { error: true, message: 'Something went wrong', status: 500 },
      })
    })
  })

  describe('getMessage fallback', () => {
    it('uses err.error string if present', async () => {
      mockRawBaseQuery.mockResolvedValue({
        error: { status: 'CUSTOM_ERROR', error: 'Custom error message' },
      })

      expect(await call()).toEqual({
        error: { error: true, message: 'Custom error message', status: 500 },
      })
    })

    it('fallback to "Something went wrong" if no error info', async () => {
      mockRawBaseQuery.mockResolvedValue({
        error: { status: 'UNKNOWN_ERROR' },
      })

      expect(await call()).toEqual({
        error: { error: true, message: 'Something went wrong', status: 500 },
      })
    })
  })
})
