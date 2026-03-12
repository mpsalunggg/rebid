import { customBaseQuery } from "@/lib/baseQuery";
import { ApiSuccessResponse } from "@/lib/response";
import { createApi } from "@reduxjs/toolkit/query/react";
import { Auction } from "./auction.type";

export const auctionApi = createApi({
	reducerPath: "auctionApi",
	baseQuery: customBaseQuery,
	tagTypes: ["Auction"],
	endpoints: (builder) => ({
		getAuctions: builder.query<ApiSuccessResponse<Auction[]>, void>({
			query: () => ({
				url: "/api/v1/auctions",
				method: "GET",
			}),
			providesTags: ["Auction"],
		}),
	}),
});

export const { useGetAuctionsQuery } = auctionApi;
