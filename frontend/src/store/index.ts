import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/auth.slice'

import { authApi } from '@/features/auth/auth.api'
import { auctionApi } from '@/features/auction/auction.api'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [auctionApi.reducerPath]: auctionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, auctionApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
