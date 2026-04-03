'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { closeDialog } from '@/store/dialog.slice'
import { Gavel, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useCreateBidMutation } from '@/features/bid/bid.api'
import { formatPrice } from '@/utils/price'

interface PlaceBidDialogProps {
  auctionId: string
  currentPrice: number
  itemName: string
}

export default function PlaceBidDialog({
  auctionId,
  currentPrice,
  itemName,
}: PlaceBidDialogProps) {
  const dispatch = useDispatch()
  const [amount, setAmount] = useState('')
  const [createBid, { isLoading }] = useCreateBidMutation()

  const minBid = currentPrice + 1
  const parsedAmount = Number(amount)
  const isValid = parsedAmount >= minBid

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid) return

    try {
      await createBid({ auction_id: auctionId, amount: parsedAmount }).unwrap()
      toast.success('Bid placed!', {
        description: `Your bid of ${formatPrice(parsedAmount)} has been submitted.`,
      })
      dispatch(closeDialog())
    } catch (err: any) {
      const message =
        err?.data?.message ?? 'Failed to place bid. Please try again.'
      toast.error('Bid failed', { description: message })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Gavel className="w-4 h-4" />
          Place a Bid
        </DialogTitle>
        <DialogDescription>
          You are bidding on{' '}
          <span className="font-medium text-foreground">{itemName}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 py-4">
        <div className="rounded-lg bg-muted/50 border px-4 py-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current bid</span>
          <span className="font-semibold text-base">{formatPrice(currentPrice)}</span>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bid-amount">Your bid</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">
              Rp
            </span>
            <Input
              id="bid-amount"
              type="number"
              min={minBid}
              step={1}
              placeholder={minBid.toString()}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-9"
              disabled={isLoading}
              autoFocus
            />
          </div>
          {amount && !isValid && (
            <p className="text-xs text-destructive">
              Minimum bid is {formatPrice(minBid)}
            </p>
          )}
          {isValid && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{formatPrice(parsedAmount - currentPrice)} above current bid
            </p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => dispatch(closeDialog())}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Placing…
            </span>
          ) : (
            <>
              <Gavel className="w-4 h-4 mr-1.5" />
              Confirm Bid
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
