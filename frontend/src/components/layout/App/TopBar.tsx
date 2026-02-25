import Link from 'next/link'
import Image from 'next/image'
import ToggleSwitch from '@/components/common/ToggleSwitch'
import { Input } from '@/components/ui/input'
import AvatarProfile from '@/components/common/AvatarProfile'

export function TopBar() {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/rebid.svg" alt="Rebid" width={32} height={32} />
          <span className="text-lg font-semibold">Rebid</span>
        </Link>

        <div className="flex gap-3">
          <Input
            placeholder="Search auctions, sellers, items..."
            className="w-96"
          />

          <ToggleSwitch />

          <AvatarProfile />
        </div>
      </div>
    </div>
  )
}
