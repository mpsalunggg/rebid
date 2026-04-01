export type Meta = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type ApiResponse<T = unknown> = {
  error: boolean
  message: string
  data?: T
}

export type ApiSuccessResponse<T> = ApiResponse<T> & {
  error: false
  data: T
}

export type ApiErrorResponse = ApiResponse<never> & {
  error: true
  message: string
  status: number
}

export type PaginatedData<T = unknown> = {
  records: T[]
  meta: Meta
}

export type ApiPaginatedResponse<T = unknown> = ApiResponse<
  PaginatedData<T>
> & {
  error: false
  data: PaginatedData<T>
}