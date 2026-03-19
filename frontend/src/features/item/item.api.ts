import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from '@/lib/baseQuery'
import type { ApiSuccessResponse } from '@/lib/response'
import type { Item } from './item.type'

export const itemApi = createApi({
  reducerPath: 'itemApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Item'],
  endpoints: (builder) => ({
    getItems: builder.query<ApiSuccessResponse<Item[]>, void>({
      query: () => ({
        url: '/api/v1/items/list',
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetItemsQuery } = itemApi
