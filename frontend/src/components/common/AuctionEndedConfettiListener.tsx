'use client'

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { runAuctionEndedConfetti } from '@/components/common/ConvettiFireworks'
import type { RootState } from '@/store'

export function AuctionEndedConfettiListener() {
  const nonce = useSelector(
    (state: RootState) => state.celebration.auctionEndedConfettiNonce,
  )
  const prevNonceRef = useRef(0)

  useEffect(() => {
    if (nonce > prevNonceRef.current) {
      prevNonceRef.current = nonce
      runAuctionEndedConfetti()
    }
  }, [nonce])

  return null
}
