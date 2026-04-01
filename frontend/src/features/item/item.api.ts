import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from '@/lib/baseQuery'
import type { ApiPaginatedResponse, ApiSuccessResponse } from '@/lib/response'
import type { Item } from './item.type'
import { CreateItemFormData } from './item.schemas'

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
    getAll: builder.query<
      ApiPaginatedResponse<Item>,
      { page: number; limit: number }
    >({
      query: (query) => ({
        url: '/api/v1/items',
        method: 'GET',
        params: query,
      }),
      providesTags: ['Item'],
    }),
    createItem: builder.mutation<
      ApiSuccessResponse<Item>,
      { data: CreateItemFormData }
    >({
      query: ({ data }) => {
        const formData = new FormData()

        formData.append('name', data.name)
        formData.append('description', data.description)
        data.images.forEach((image) => {
          formData.append('images', image)
        })

        return {
          url: '/api/v1/items',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['Item'],
    }),
    deleteItem: builder.mutation<ApiSuccessResponse<void>, { id: string }>({
      query: ({ id }) => ({
        url: `/api/v1/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Item'],
    }),
  }),
})

export const { useGetItemsQuery, useGetAllQuery, useDeleteItemMutation, useCreateItemMutation } =
  itemApi
