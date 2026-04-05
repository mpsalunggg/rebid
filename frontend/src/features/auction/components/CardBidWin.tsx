import { Card, CardContent } from '@/components/ui/card'
import { Bid } from '@/features/auction/auction.type'
import TrophyIcon from '@/components/icon/IcThrophy'
import { formatPrice } from '@/utils/price'
import { MailIcon, ClockIcon } from 'lucide-react'
import { formatDateTime } from '@/utils/time'

type CardWinProps = {
  bid: Bid
}

export default function CardBidWin({ bid }: CardWinProps) {
  const initials = bid.user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Card className="relative overflow-hidden border border-amber-200 bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 shadow-md shadow-amber-100">
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-amber-200/30" />
      <div className="pointer-events-none absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-yellow-300/20" />

      <CardContent className="relative">
        <div className="mb-4 flex items-center gap-2">
          <TrophyIcon className="h-7 w-7 shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-700">
            Bid Winner
          </span>
        </div>

        <div className="mb-4 h-px bg-amber-200/70" />

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-800">
              {bid.user.name}
            </p>
            <div className="flex items-center gap-1">
              <MailIcon className="h-3 w-3 shrink-0 text-amber-600" />
              <p className="truncate text-xs text-gray-500">{bid.user.email}</p>
            </div>
          </div>
        </div>

        <div className="mb-3 rounded-lg bg-white/60 px-4 py-3 ring-1 ring-amber-200">
          <p className="mb-0.5 text-xs font-medium text-amber-600">
            Winning Bid
          </p>
          <p className="text-xl font-bold tracking-tight text-gray-900">
            {formatPrice(bid.amount)}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <ClockIcon className="h-3 w-3 text-amber-500" />
          <span className="text-xs text-gray-400">
            {formatDateTime(bid.created_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
