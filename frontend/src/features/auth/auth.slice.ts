import { createSlice } from '@reduxjs/toolkit'
import { authApi } from './auth.api'

export type User = {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.user = action.payload.data.user
        state.isAuthenticated = true
      },
    )
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
