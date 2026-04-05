'use client'

import { use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { openDialog } from '@/store/dialog.slice'
import { useGetAuctionByIdQuery } from '@/features/auction/auction.api'
import { useGetUserMeQuery } from '@/features/auth/auth.api'
import { formatPrice } from '@/utils/price'
import { formatDateTime, formatTimeAgo } from '@/utils/time'
import { getStatusColor } from '@/features/auction/auction.constant'
import {
  AuctionImageCarousel,
  InfoRow,
  AuctionDetailSkeleton,
  PlaceBidDialog,
} from '@/features/auction/components'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Gavel,
  TrendingUp,
  User,
  History,
} from 'lucide-react'
import CountdownTimer from '@/components/common/CountdownTimer'

export default function AuctionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const dispatch = useDispatch()
  const { data, isLoading, isError } = useGetAuctionByIdQuery(id)
  const { data: meData } = useGetUserMeQuery()

  const auction = data?.auction
  const bids = data?.bids ?? []
  const currentPrice = auction?.current_price ?? 0
  const hasItem = !!auction?.item
  const isOwner = !!meData?.data?.id && meData.data.id === auction?.created_by

  const openBidDialog = useCallback(() => {
    if (!auction) return
    dispatch(
      openDialog({
        id: 'place-bid',
        component: (
          <PlaceBidDialog
            auctionId={auction.id}
            currentPrice={currentPrice}
            itemName={hasItem ? auction.item.name : 'this auction'}
          />
        ),
      }),
    )
  }, [dispatch, auction, currentPrice, hasItem])

  if (isLoading) return <AuctionDetailSkeleton />

  if (isError || !auction) {
    return (
      <div className="col-span-12 lg:col-span-9 text-center">
        <p className="text-muted-foreground text-sm">Auction not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go back
        </Button>
      </div>
    )
  }

  const priceDelta = currentPrice - auction.starting_price

  return (
    <div className="space-y-4 col-span-12 lg:col-span-9">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {hasItem ? auction.item.name : 'Auction Detail'}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {auction.user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <span className="text-sm text-muted-foreground">
              {auction.user?.name ?? 'Unknown'}
            </span>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(auction.created_at)}
            </span>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${getStatusColor(auction.status)}`}
        >
          {auction.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <AuctionImageCarousel images={hasItem ? auction.item.images : null} />
          <CountdownTimer date={auction.end_time} />
          <Card className="border shadow-none">
            <CardContent>
              {hasItem && auction.item.description && (
                <div className="mb-4">
                  <h2 className="text-sm font-semibold mb-1.5">Description</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {auction.item.description}
                  </p>
                </div>
              )}

              <h2 className="text-sm font-semibold mb-4">Auction Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow
                  icon={Calendar}
                  label="Start Time"
                  value={formatDateTime(auction.start_time)}
                />
                <InfoRow
                  icon={Clock}
                  label="End Time"
                  value={formatDateTime(auction.end_time)}
                />
                <InfoRow
                  icon={User}
                  label="Seller"
                  value={`${auction.user?.name ?? '—'} · ${auction.user?.email ?? '—'}`}
                />
                <InfoRow
                  icon={Calendar}
                  label="Posted"
                  value={formatDateTime(auction.created_at)}
                />
              </div>
            </CardContent>
          </Card>

          {bids.length > 0 && (
            <Card className="border shadow-none">
              <CardContent>
                <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Bid History
                </h2>
                <div className="space-y-3">
                  {bids.map((bid, index) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                          {bid.user?.name?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p className="font-medium leading-none">
                            {bid.user?.name ?? 'Unknown'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDateTime(bid.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatPrice(bid.amount)}
                        </p>
                        {index === 0 && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400">
                            Highest
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:sticky lg:top-20 h-fit">
          <Card className="border shadow-none">
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                  Current Bid
                </p>
                <p className="text-3xl font-bold tracking-tight">
                  {formatPrice(currentPrice)}
                </p>
                {priceDelta > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      +{formatPrice(priceDelta)} from start
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Starting price</span>
                  <span className="font-medium">
                    {formatPrice(auction.starting_price)}
                  </span>
                </div>

                {auction.current_bidder_id && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    Active bidder
                  </div>
                )}
              </div>

              {!isOwner && (
                <>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    size="lg"
                    disabled={auction.status !== 'ACTIVE'}
                    onClick={openBidDialog}
                  >
                    <Gavel className="w-4 h-4 mr-2" />
                    {auction.status === 'ACTIVE'
                      ? 'Place Bid'
                      : 'Bidding Unavailable'}
                  </Button>

                  {auction.status !== 'ACTIVE' && (
                    <p className="text-xs text-center text-muted-foreground">
                      This auction is{' '}
                      <span className="lowercase">{auction.status}</span>
                    </p>
                  )}
                </>
              )}

              {isOwner && (
                <p className="text-xs text-center text-muted-foreground border rounded-md py-2 px-3">
                  You cannot bid on your own auction.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
