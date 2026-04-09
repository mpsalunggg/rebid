'use client'
import { AppLayout as AppWrapper } from '@/components/layout/AppLayout'
import AppDialog from '@/components/common/AppDialog'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import LandingPage from '@/features/landing/LandingPage'
import { useGetUserMeQuery } from '@/features/auth/auth.api'
import { Spinner } from '@/components/ui/spinner'
import { AuctionEndedConfettiListener } from '@/components/common/AuctionEndedConfettiListener'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth)
  const { isLoading, isFetching, isError } = useGetUserMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    skip: !!user,
  })
  
  const sessionPending = !user && !isError && (isLoading || isFetching)
  if (sessionPending) {
    return (  
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="size-12 text-primary" />
      </div>
    )
  }
  if (!user) {
    return <LandingPage />
  }

  return (
    <>
      <AuctionEndedConfettiListener />
      <AppWrapper>
        {children}
        <AppDialog />
      </AppWrapper>
    </>
  )
}
