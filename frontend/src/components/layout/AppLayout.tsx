'use client'

import { type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { LeftNav } from './App/LeftNav'
import { TopBar } from './App/TopBar'
import { RightSidebar } from './App/RightSidebar'
import ParticleLayout from './ParticleLayout'
import { RootState } from '@/store'
import { useGetUserMeQuery } from '@/features/auth/auth.api'
import { Spinner } from '../ui/spinner'

export function AppLayout({ children }: { children: ReactNode }) {
  const { isLoading, user } = useSelector((state: RootState) => state.auth)
  useGetUserMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    skip: !!user,
  })

  return (
    <ParticleLayout>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center flex-col justify-center bg-background">
          <Spinner className="size-10 text-primary" />
          Please wait...
        </div>
      )}
      <div className="relative z-10 min-h-dvh w-full">
        <div className="sticky z-10 mx-auto w-full max-w-[1200px] px-6 pt-6">
          <TopBar />
        </div>
        <div className="mx-auto w-full max-w-[1200px] grid grid-cols-12 gap-8 px-6 py-6">
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-4">
              <LeftNav />
            </div>
          </aside>

          <main className="col-span-12 lg:col-span-6">
            <div>{children}</div>
          </main>

          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-4">
              <RightSidebar />
            </div>
          </aside>
        </div>
      </div>
    </ParticleLayout>
  )
}
