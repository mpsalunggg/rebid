import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/auth.slice'
import dialogReducer from './dialog.slice'
import celebrationReducer from './celebration.slice'
import { authApi } from '@/features/auth/auth.api'
import { auctionApi } from '@/features/auction/auction.api'
import { itemApi } from '@/features/item/item.api'
import { bidApi } from '@/features/bid/bid.api'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dialog: dialogReducer,
    celebration: celebrationReducer,
    [authApi.reducerPath]: authApi.reducer,
    [auctionApi.reducerPath]: auctionApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
    [bidApi.reducerPath]: bidApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['dialog/openDialog'],
        ignoredPaths: ['dialog.component'],
      },
    }).concat(authApi.middleware, auctionApi.middleware, itemApi.middleware, bidApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
