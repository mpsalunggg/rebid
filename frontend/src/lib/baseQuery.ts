import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import type { ApiErrorResponse } from '@/lib/response'

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
})

function getMessage(err: FetchBaseQueryError): string {
  if (typeof err.status === 'number' && err.data != null) {
    const body = err.data as ApiErrorResponse
    if (typeof body?.message === 'string') return body.message
  }
  if ('error' in err && typeof err.error === 'string') return err.error
  return 'Something went wrong'
}

export const customBaseQuery: BaseQueryFn<
  FetchArgs,
  unknown,
  ApiErrorResponse
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)
  if (result.error) {
    const err = result.error as FetchBaseQueryError
    const message =
      err.status === 'FETCH_ERROR'
        ? 'Network error, please check your connection'
        : err.status === 'TIMEOUT_ERROR'
          ? 'Request timed out'
          : err.status === 'PARSING_ERROR'
            ? 'Invalid response from server'
            : getMessage(err)

    return {
      error: {
        error: true,
        message,
        status: typeof err.status === 'number' ? err.status : 500,
      } satisfies ApiErrorResponse,
    }
  }

  return { data: result.data }
}
