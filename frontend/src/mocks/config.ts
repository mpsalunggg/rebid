import { BASE_URL } from '@/constants/url'

export function apiUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${p}`
}
