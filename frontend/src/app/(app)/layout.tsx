"use client"
import { AppLayout as AppWrapper } from '@/components/layout/AppLayout'
import AppDialog from '@/components/common/AppDialog'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import LandingPage from '@/features/landing/LandingPage'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth)

  if(!user) {
    return <LandingPage />
  }

  return (
    <AppWrapper>
      {children}
      <AppDialog />
    </AppWrapper>
  )
}
