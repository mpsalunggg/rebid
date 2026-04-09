import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from '@/lib/baseQuery'
import type { ApiSuccessResponse } from '@/lib/response'
import type { Auction, AuctionDetail, AuctionWsMessage } from './auction.type'
import { getWebSocketUrl } from '@/utils/wsUrl'
import { CreateAuctionFormData } from './auction.schema'
import { AUCTION_WS_CHANGE_ENDED } from './auction.constant'
import { triggerAuctionEndedConfetti } from '@/store/celebration.slice'

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
    getAuctionById: builder.query<AuctionDetail, string>({
      query: (id) => ({
        url: `/api/v1/auctions/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiSuccessResponse<Auction>): AuctionDetail => ({
        auction: res.data,
        bids: [],
      }),
      async onCacheEntryAdded(auctionId, api) {
        await api.cacheDataLoaded

        const url = getWebSocketUrl(`/api/v1/auctions/${auctionId}/ws`)
        const ws = new WebSocket(url)

        ws.onmessage = (ev: MessageEvent<string>) => {
          const msg = JSON.parse(ev.data) as AuctionWsMessage
          api.updateCachedData((draft) => {
            draft.auction.current_price = msg.current_price
            draft.auction.current_bidder_id = msg.current_bidder_id
            draft.auction.status = msg.auction.status
            if (msg.bids?.length) {
              draft.bids = msg.bids
            }
          })
          if (msg.change === AUCTION_WS_CHANGE_ENDED) {
            api.dispatch(triggerAuctionEndedConfetti())
          }
        }

        await api.cacheEntryRemoved
        ws.close()
      },
    }),
    createAuction: builder.mutation<
      ApiSuccessResponse<Auction>,
      CreateAuctionFormData
    >({
      query: (data) => ({
        url: '/api/v1/auctions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auction'],
    }),
  }),
})

export const { useGetAuctionsQuery, useGetAuctionByIdQuery, useCreateAuctionMutation } = auctionApi
