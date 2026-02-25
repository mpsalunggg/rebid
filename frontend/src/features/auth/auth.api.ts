import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { User } from './auth.slice'

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
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
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
  }),
})

export const { useLoginMutation, useLogoutMutation } = authApi
