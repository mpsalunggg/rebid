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
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
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
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload.data.user
        state.isAuthenticated = true
      })
      .addMatcher(
        authApi.endpoints.googleLogin.matchFulfilled,
        (state, action) => {
          state.user = action.payload.data.user
          state.isAuthenticated = true
        },
      )
      .addMatcher(authApi.endpoints.getUserMe.matchPending, (state) => {
        state.isLoading = true
      })
      .addMatcher(
        authApi.endpoints.getUserMe.matchFulfilled,
        (state, action) => {
          state.user = action.payload.data
          state.isAuthenticated = true
          state.isLoading = false
        },
      )
      .addMatcher(
        authApi.endpoints.getUserMe.matchRejected,
        (state, action) => {
          if (action.payload?.status === 401) {
            state.user = null
            state.isAuthenticated = false
            state.isLoading = false
          }
        },
      )
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
