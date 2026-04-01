'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

type QueryValue = string | number | boolean | null | undefined

export function useQueryParams() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  /* Get single param
    @param key - The key of the parameter to get
    @returns string | null
    @example
    getParam('page') => '1'
  */
  const getParam = useCallback(
    ((key: string, defaultValue?: string): string | null => {
      const value = searchParams.get(key)
      if (value === null || value === '') {
        return defaultValue !== undefined ? defaultValue : null
      }
      return value
    }) as {
      (key: string): string | null
      (key: string, defaultValue: string): string
    },
    [searchParams],
  )

  /* Get all params as object
    @returns Record<string, string>
    @example
    getAllParams() => {
      page: '1',
      limit: '10',
    }
  */
  const getAllParams = useCallback(() => {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  }, [searchParams])

  /* Set param (add/update)
    @param key - The key of the parameter to set
    @param value - The value of the parameter to set
    @returns void
    @example
    setParam('page', 1);
  */
  const setParam = useCallback(
    (key: string, value: QueryValue) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === null || value === undefined || value === '') {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  /* Set multiple params
    @param newParams - The new parameters to set
    @returns void
    @example
    setParams({
      page: 1,
      limit: 10,
    });
  */
  const setParams = useCallback(
    (newParams: Record<string, QueryValue>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  /* Remove param
    @param key - The key of the parameter to remove
    @returns void
    @example
    removeParam('page');
  */
  const removeParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(key)

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  /* Clear all params
    @returns void
    @example
    clearParams();
  */
  const clearParams = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  return {
    getParam,
    getAllParams,
    setParam,
    setParams,
    removeParam,
    clearParams,
  }
}
