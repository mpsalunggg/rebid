import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from '@/lib/baseQuery'
import type { ApiSuccessResponse } from '@/lib/response'
import type { Bid } from '@/features/auction/auction.type'

export interface CreateBidPayload {
  auction_id: string
  amount: number
}

export const bidApi = createApi({
  reducerPath: 'bidApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    createBid: builder.mutation<ApiSuccessResponse<Bid>, CreateBidPayload>({
      query: (body) => ({
        url: '/api/v1/bids',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useCreateBidMutation } = bidApi
