import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/auth.slice'
import dialogReducer from './dialog.slice'
import { authApi } from '@/features/auth/auth.api'
import { auctionApi } from '@/features/auction/auction.api'
import { itemApi } from '@/features/item/item.api'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dialog: dialogReducer,
    [authApi.reducerPath]: authApi.reducer,
    [auctionApi.reducerPath]: auctionApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['dialog/openDialog'],
        ignoredPaths: ['dialog.component'],
      },
    }).concat(authApi.middleware, auctionApi.middleware, itemApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
