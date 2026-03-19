import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from '@/lib/baseQuery'
import type { ApiSuccessResponse } from '@/lib/response'
import type { Auction } from './auction.type'

export const auctionApi = createApi({
  reducerPath: 'auctionApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Auction'],
  endpoints: (builder) => ({
    getAuctions: builder.query<ApiSuccessResponse<Auction[]>, void>({
      query: () => ({
        url: '/api/v1/auctions',
        method: 'GET',
      }),
      providesTags: ['Auction'],
    }),
  }),
})

export const { useGetAuctionsQuery } = auctionApi
