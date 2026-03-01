'use client'

import Link from 'next/link'
import Image from 'next/image'
import ToggleSwitch from '@/components/common/ToggleSwitch'
import { Input } from '@/components/ui/input'
import AvatarProfile from '@/components/common/AvatarProfile'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Button } from '@/components/ui/button'
import { LogInIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGetUserMeQuery } from '@/features/auth/auth.api'
import { Skeleton } from '@/components/ui/skeleton'

export function TopBar() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  )
  const { isFetching } = useGetUserMeQuery(undefined, { skip: !!user })
  const router = useRouter()
  const isLoading = isFetching
  return (
    <div className="rounded-b-2xl bg-card p-3 shadow-sm ring-1 ring-black/5">
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

          {isLoading ? (
            <Skeleton className="w-9 h-9 rounded-full" />
          ) : isAuthenticated ? (
            <AvatarProfile />
          ) : (
            <Button onClick={() => router.push('/login')}>
              <LogInIcon />
              Login{' '}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
