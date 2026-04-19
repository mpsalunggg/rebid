import { afterEach, describe, expect, it } from 'vitest'
import { BASE_URL } from '@/constants/url'
import { server } from '../server'

describe('MSW default handlers', () => {
  afterEach(() => server.resetHandlers())

  it('GET /api/v1/items/list', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/items/list`)
    expect(res.ok).toBe(true)
    const json = (await res.json()) as { error: boolean; data: unknown[] }
    expect(json.error).toBe(false)
    expect(Array.isArray(json.data)).toBe(true)
  })

  it('GET /api/v1/items — no query (default page/limit)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/items`)
    expect(res.ok).toBe(true)
    const json = (await res.json()) as {
      data: { meta: { page: number; limit: number } }
    }
    expect(json.data.meta.page).toBe(1)
    expect(json.data.meta.limit).toBe(10)
  })

  it('GET /api/v1/items — with page and limit', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/items?page=2&limit=5`)
    expect(res.ok).toBe(true)
    const json = (await res.json()) as {
      data: { meta: { page: number; limit: number } }
    }
    expect(json.data.meta.page).toBe(2)
    expect(json.data.meta.limit).toBe(5)
  })

  it('GET /api/v1/items — limit 0 (paginatedMeta branch)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/items?page=1&limit=0`)
    expect(res.ok).toBe(true)
    const json = (await res.json()) as {
      data: { meta: { total_pages: number } }
    }
    expect(json.data.meta.total_pages).toBe(0)
  })

  it('POST /api/v1/items', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/items`, {
      method: 'POST',
      body: new FormData(),
    })
    expect(res.status).toBe(201)
  })

  it('PUT /api/v1/items/:id', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/items/row-1`, {
      method: 'PUT',
      body: new FormData(),
    })
    expect(res.ok).toBe(true)
    const json = (await res.json()) as { data: { id: string } }
    expect(json.data.id).toBe('row-1')
  })

  it('DELETE /api/v1/items/:id', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/items/row-1`, {
      method: 'DELETE',
    })
    expect(res.ok).toBe(true)
    const json = (await res.json()) as { data: null }
    expect(json.data).toBeNull()
  })
})
