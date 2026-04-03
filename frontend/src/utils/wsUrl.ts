export function getWebSocketUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
  const u = new URL(base)
  const protocol = u.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${u.host}${path.startsWith('/') ? path : `/${path}`}`
}
