export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export function apiUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${p}`
}
