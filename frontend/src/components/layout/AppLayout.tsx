'use client'

import { type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { LeftNav } from './App/LeftNav'
import { TopBar } from './App/TopBar'
import { RightSidebar } from './App/RightSidebar'
import ParticleLayout from './ParticleLayout'
import { RootState } from '@/store'
import { useGetUserMeQuery } from '@/features/auth/auth.api'

export function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth)
  useGetUserMeQuery(undefined, {
    refetchOnMountOrArgChange: false,
    skip: !!user,
  })

  return (
    <ParticleLayout>
      <div className="relative z-10 min-h-dvh w-full">
        <div className="sticky top-0 z-10 mx-auto w-full max-w-[1200px] px-6">
          <TopBar />
        </div>
        <div className="mx-auto w-full max-w-[1200px] grid grid-cols-12 gap-8 px-6 py-6">
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-20">
              <LeftNav />
            </div>
          </aside>

          <main className="col-span-12 lg:col-span-6">
            <div>{children}</div>
          </main>

          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky  top-20">
              <RightSidebar />
            </div>
          </aside>
        </div>
      </div>
    </ParticleLayout>
  )
}
