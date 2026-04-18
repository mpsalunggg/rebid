import { http, HttpResponse } from 'msw'
import { apiUrl } from './config'

export const handlers = [
  http.get(apiUrl('/api/v1/items'), ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')

    return HttpResponse.json({
      data: [],
      meta: { page: Number(page ?? 1), limit: 10, total: 0 },
    })
  }),
]
