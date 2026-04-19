import { configureStore } from '@reduxjs/toolkit'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ITEM_API_MESSAGES,
  sampleItemResponse,
  sampleMyItemRow,
} from '@/mocks/itemApi.fixtures'
import { BASE_URL } from '@/constants/url'
import { apiUrl } from '@/mocks/config'
import { server } from '@/mocks/server'
import type { Item } from '../item.type'

const { delegateBaseQuery, mockBaseQuery } = vi.hoisted(() => {
  const mockBaseQuery = vi.fn()
  const delegateBaseQuery = { useRealFetch: true }
  return { delegateBaseQuery, mockBaseQuery }
})

vi.mock('@/lib/baseQuery', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/baseQuery')>()
  return {
    customBaseQuery: (
      ...args: Parameters<typeof actual.customBaseQuery>
    ): ReturnType<typeof actual.customBaseQuery> => {
      if (delegateBaseQuery.useRealFetch) {
        return actual.customBaseQuery(...args)
      }
      return mockBaseQuery(...args) as ReturnType<typeof actual.customBaseQuery>
    },
  }
})

import { itemApi } from '../item.api'

const unitMockItem: Item = {
  ...sampleItemResponse,
  description: 'Mock description.',
  images: [],
  created_at: '',
  updated_at: '',
}

function apiSuccess<T>(
  data: T,
  message: (typeof ITEM_API_MESSAGES)[keyof typeof ITEM_API_MESSAGES] = ITEM_API_MESSAGES.itemsRetrieved,
) {
  return { data: { error: false as const, message, data } }
}

function paginatedMeta(page: number, limit: number, total: number) {
  const totalPages = limit <= 0 ? 0 : Math.ceil(total / limit)
  return { page, limit, total, total_pages: totalPages }
}

function createTestStore() {
  return configureStore({
    reducer: { [itemApi.reducerPath]: itemApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        itemApi.middleware,
      ),
  })
}

describe('itemApi — MSW integration', () => {
  beforeEach(() => {
    delegateBaseQuery.useRealFetch = true
  })

  it('getItems: empty list — envelope similar to backend', async () => {
    const store = createTestStore()

    const res = await store
      .dispatch(
        itemApi.endpoints.getItems.initiate(undefined, { subscribe: false }),
      )
      .unwrap()

    expect(res.error).toBe(false)
    expect(res.message).toBe(ITEM_API_MESSAGES.itemsRetrieved)
    expect(res.data).toEqual([])
  })

  it('getItems: populated list — MyItemResponse (id, name)', async () => {
    server.use(
      http.get('*/api/v1/items/list', () =>
        HttpResponse.json({
          error: false,
          message: ITEM_API_MESSAGES.itemsRetrieved,
          data: [sampleMyItemRow],
        }),
      ),
    )

    const store = createTestStore()
    const res = await store
      .dispatch(
        itemApi.endpoints.getItems.initiate(undefined, { subscribe: false }),
      )
      .unwrap()

    expect(res.message).toBe(ITEM_API_MESSAGES.itemsRetrieved)
    expect(res.data).toHaveLength(1)
    expect(res.data[0]).toMatchObject({
      id: sampleMyItemRow.id,
      name: sampleMyItemRow.name,
    })
  })

  it('getAll: empty pagination — meta matches query', async () => {
    const store = createTestStore()

    const res = await store
      .dispatch(
        itemApi.endpoints.getAll.initiate(
          { page: 2, limit: 20 },
          { subscribe: false },
        ),
      )
      .unwrap()

    expect(res.message).toBe(ITEM_API_MESSAGES.itemsRetrieved)
    expect(res.data.records).toEqual([])
    expect(res.data.meta.page).toBe(2)
    expect(res.data.meta.limit).toBe(20)
    expect(res.data.meta.total).toBe(0)
    expect(res.data.meta.total_pages).toBe(0)
  })

  it('getAll: pagination with records', async () => {
    const second = {
      ...sampleItemResponse,
      id: 'mock-item-2',
      name: 'Second',
    }
    server.use(
      http.get('*/api/v1/items', ({ request }) => {
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') ?? 1)
        const limit = Number(url.searchParams.get('limit') ?? 10)
        return HttpResponse.json({
          error: false,
          message: ITEM_API_MESSAGES.itemsRetrieved,
          data: {
            records: [sampleItemResponse, second],
            meta: paginatedMeta(page, limit, 2),
          },
        })
      }),
    )

    const store = createTestStore()
    const res = await store
      .dispatch(
        itemApi.endpoints.getAll.initiate(
          { page: 1, limit: 10 },
          { subscribe: false },
        ),
      )
      .unwrap()

    expect(res.data.records).toHaveLength(2)
    expect(res.data.meta.total).toBe(2)
    expect(res.data.meta.total_pages).toBe(1)
  })

  it('getAll: pagination with limit 0', async () => {
    const store = createTestStore()
    const res = await store
      .dispatch(
        itemApi.endpoints.getAll.initiate(
          { page: 1, limit: 0 },
          { subscribe: false },
        ),
      )
      .unwrap()

    expect(res.data.meta.total_pages).toBe(0)
  })

  it('getAll: default page & limit', async () => {
    const store = createTestStore()

    const res = await store
      .dispatch(
        itemApi.endpoints.getAll.initiate(
          { page: 1, limit: 10 },
          { subscribe: false },
        ),
      )
      .unwrap()

    expect(res.data.meta.page).toBe(1)
    expect(res.data.meta.limit).toBe(10)
  })

  it('createItem: POST 201 + backend message', async () => {
    const store = createTestStore()
    const file = new File(['x'], 'shot.png', { type: 'image/png' })

    const res = await store
      .dispatch(
        itemApi.endpoints.createItem.initiate({
          data: {
            name: 'Vintage camera',
            description: 'A longer description for the item.',
            images: [file],
          },
        }),
      )
      .unwrap()

    expect(res.error).toBe(false)
    expect(res.message).toBe(ITEM_API_MESSAGES.itemCreated)
    expect(res.data).toMatchObject({ id: sampleItemResponse.id })
  })

  it('updateItem: PUT + backend message', async () => {
    const store = createTestStore()
    const newFile = new File(['y'], 'new.png', { type: 'image/png' })

    const res = await store
      .dispatch(
        itemApi.endpoints.updateItem.initiate({
          id: 'item-1',
          data: {
            name: 'Updated name',
            description: 'Updated description text here.',
            keep_image_ids: ['img-a', 'img-b'],
            images: [newFile],
          },
        }),
      )
      .unwrap()

    expect(res.message).toBe(ITEM_API_MESSAGES.itemUpdated)
    expect(res.data).toMatchObject({ id: 'item-1' })
  })

  it('deleteItem: DELETE + backend message', async () => {
    const store = createTestStore()

    const res = await store
      .dispatch(itemApi.endpoints.deleteItem.initiate({ id: 'abc-123' }))
      .unwrap()

    expect(res.data).toBeNull()
    expect(res.message).toBe(ITEM_API_MESSAGES.itemDeleted)
  })
})

describe('itemApi — request shape (spy on customBaseQuery)', () => {
  beforeEach(() => {
    delegateBaseQuery.useRealFetch = false
    mockBaseQuery.mockReset()
    mockBaseQuery.mockResolvedValue(
      apiSuccess(unitMockItem, ITEM_API_MESSAGES.itemCreated),
    )
  })

  it('createItem: POST FormData contains name, description, images', async () => {
    const store = createTestStore()
    const file = new File(['x'], 'shot.png', { type: 'image/png' })

    await store
      .dispatch(
        itemApi.endpoints.createItem.initiate({
          data: {
            name: 'Vintage camera',
            description: 'A longer description for the item.',
            images: [file],
          },
        }),
      )
      .unwrap()

    const req = mockBaseQuery.mock.calls[0]?.[0] as {
      url: string
      method?: string
      body: FormData
    }
    expect(req.url).toBe('/api/v1/items')
    expect(req.method).toBe('POST')
    expect(req.body.get('name')).toBe('Vintage camera')
    expect(req.body.get('description')).toBe(
      'A longer description for the item.',
    )
    expect(req.body.getAll('images')).toHaveLength(1)
  })

  it('updateItem: PUT FormData contains keep_image_ids and images', async () => {
    mockBaseQuery.mockResolvedValue(
      apiSuccess(unitMockItem, ITEM_API_MESSAGES.itemUpdated),
    )
    const store = createTestStore()
    const newFile = new File(['y'], 'new.png', { type: 'image/png' })

    await store
      .dispatch(
        itemApi.endpoints.updateItem.initiate({
          id: 'item-1',
          data: {
            name: 'Updated name',
            description: 'Updated description text here.',
            keep_image_ids: ['img-a', 'img-b'],
            images: [newFile],
          },
        }),
      )
      .unwrap()

    const req = mockBaseQuery.mock.calls[0]?.[0] as {
      url: string
      method?: string
      body: FormData
    }
    expect(req.url).toBe('/api/v1/items/item-1')
    expect(req.method).toBe('PUT')
    expect(req.body.get('name')).toBe('Updated name')
    expect(req.body.getAll('keep_image_ids')).toEqual(
      expect.arrayContaining(['img-a', 'img-b']),
    )
    expect(req.body.getAll('keep_image_ids')).toHaveLength(2)
    expect(req.body.getAll('images')).toHaveLength(1)
  })

  it('getItems: GET path & method', async () => {
    mockBaseQuery.mockResolvedValue(
      apiSuccess([], ITEM_API_MESSAGES.itemsRetrieved),
    )
    const store = createTestStore()

    await store
      .dispatch(
        itemApi.endpoints.getItems.initiate(undefined, { subscribe: false }),
      )
      .unwrap()

    const req = mockBaseQuery.mock.calls[0]?.[0] as {
      url: string
      method?: string
    }
    expect(req.url).toBe('/api/v1/items/list')
    expect(req.method).toBe('GET')
  })

  it('getAll: GET path, method, params', async () => {
    mockBaseQuery.mockResolvedValue(
      apiSuccess(
        {
          records: [],
          meta: { page: 2, limit: 15, total: 0, total_pages: 0 },
        },
        ITEM_API_MESSAGES.itemsRetrieved,
      ),
    )
    const store = createTestStore()

    await store
      .dispatch(
        itemApi.endpoints.getAll.initiate(
          { page: 2, limit: 15 },
          { subscribe: false },
        ),
      )
      .unwrap()

    const req = mockBaseQuery.mock.calls[0]?.[0] as {
      url: string
      method?: string
      params: { page: number; limit: number }
    }
    expect(req.url).toBe('/api/v1/items')
    expect(req.method).toBe('GET')
    expect(req.params).toEqual({ page: 2, limit: 15 })
  })

  it('deleteItem: DELETE path & method', async () => {
    mockBaseQuery.mockResolvedValue(
      apiSuccess(null, ITEM_API_MESSAGES.itemDeleted),
    )
    const store = createTestStore()

    await store
      .dispatch(itemApi.endpoints.deleteItem.initiate({ id: 'abc-123' }))
      .unwrap()

    const req = mockBaseQuery.mock.calls[0]?.[0] as {
      url: string
      method?: string
    }
    expect(req.url).toBe('/api/v1/items/abc-123')
    expect(req.method).toBe('DELETE')
  })
})

describe('mocks/config — apiUrl', () => {
  it('normalizes path with or without leading slash', () => {
    expect(apiUrl('/api/v1/items')).toBe(`${BASE_URL}/api/v1/items`)
    expect(apiUrl('api/v1/items')).toBe(`${BASE_URL}/api/v1/items`)
  })
})
