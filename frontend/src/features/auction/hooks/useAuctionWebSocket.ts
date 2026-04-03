'use client'

import { useEffect, useState } from 'react'
import { getWebSocketUrl } from '@/utils/wsUrl'
import type { AuctionWsMessage, Bid } from '../auction.type'

export type AuctionWsStatus =
  | 'idle'
  | 'connecting'
  | 'open'
  | 'closed'
  | 'error'

export function useAuctionWebSocket(auctionId: string | undefined) {
  const [status, setStatus] = useState<AuctionWsStatus>('idle')
  const [data, setData] = useState<AuctionWsMessage | null>(null)
  const [bids, setBids] = useState<Bid[]>([])

  useEffect(() => {
    if (!auctionId) {
      setStatus('idle')
      return
    }

    setStatus('connecting')
    const url = getWebSocketUrl(`/api/v1/auctions/${auctionId}/ws`)
    const ws = new WebSocket(url)

    ws.onopen = () => {
      setStatus('open')
    }

    ws.onmessage = (ev: MessageEvent<string>) => {
      const parsed = JSON.parse(ev.data) as AuctionWsMessage
      setData(parsed)
      if (parsed.bids?.length) {
        setBids(parsed.bids)
      }
    }

    ws.onerror = () => {
      setStatus('error')
    }

    ws.onclose = () => {
      setStatus((s) => (s === 'error' ? 'error' : 'closed'))
    }

    return () => {
      ws.close()
    }
  }, [auctionId])

  return { status, data, bids }
}
