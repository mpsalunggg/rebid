import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from '@/lib/baseQuery'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/lib/response'
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
    getAll: builder.query<ApiPaginatedResponse<Item>, { page: number; limit: number }>({
      query: (query) => ({
        url: '/api/v1/items',
        method: 'GET',
        params: query,
      }),
    }),
  }),
})

export const { useGetItemsQuery, useGetAllQuery } = itemApi
