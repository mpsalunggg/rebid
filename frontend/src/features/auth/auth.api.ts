import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { User } from './auth.slice'
import { ApiSuccessResponse } from '@/lib/response'
import { customBaseQuery } from '@/lib/baseQuery'

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  user: User
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<ApiSuccessResponse<LoginResponse>, LoginRequest>({
      query: (body) => ({
        url: '/api/v1/users/login',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/api/v1/users/logout',
        method: 'POST',
      }),
    }),
    googleLogin: builder.mutation<
      ApiSuccessResponse<LoginResponse>,
      { code: string }
    >({
      query: (body) => ({
        url: '/api/v1/auth/google',
        method: 'POST',
        body,
      }),
    }),
    googleOneTapLogin: builder.mutation<
      ApiSuccessResponse<LoginResponse>,
      { credential: string }
    >({
      query: (body) => ({
        url: '/api/v1/auth/google/one-tap',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useGoogleLoginMutation,
  useGoogleOneTapLoginMutation,
} = authApi
