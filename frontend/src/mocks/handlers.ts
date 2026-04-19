import { http, HttpResponse } from 'msw'
import { ITEM_API_MESSAGES, sampleItemResponse } from '@/mocks/itemApi.fixtures'
import { apiUrl } from './config'

function paginatedMeta(page: number, limit: number, total: number) {
  const totalPages = limit <= 0 ? 0 : Math.ceil(total / limit)
  return { page, limit, total, total_pages: totalPages }
}

export const handlers = [
  http.get(apiUrl('/api/v1/items/list'), () =>
    HttpResponse.json({
      error: false,
      message: ITEM_API_MESSAGES.itemsRetrieved,
      data: [] as { id: string; name: string }[],
    }),
  ),

  http.get(apiUrl('/api/v1/items'), ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const limit = Number(url.searchParams.get('limit') ?? 10)

    return HttpResponse.json({
      error: false,
      message: ITEM_API_MESSAGES.itemsRetrieved,
      data: {
        records: [] as (typeof sampleItemResponse)[],
        meta: paginatedMeta(page, limit, 0),
      },
    })
  }),

  http.post(apiUrl('/api/v1/items'), () =>
    HttpResponse.json(
      {
        error: false,
        message: ITEM_API_MESSAGES.itemCreated,
        data: sampleItemResponse,
      },
      { status: 201 },
    ),
  ),

  http.put(apiUrl('/api/v1/items/:id'), ({ params }) =>
    HttpResponse.json({
      error: false,
      message: ITEM_API_MESSAGES.itemUpdated,
      data: {
        ...sampleItemResponse,
        id: String(params.id),
      },
    }),
  ),

  http.delete(apiUrl('/api/v1/items/:id'), () =>
    HttpResponse.json({
      error: false,
      message: ITEM_API_MESSAGES.itemDeleted,
      data: null,
    }),
  ),
]
