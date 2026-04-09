'use client'

import { type ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { LeftNav } from './App/LeftNav'
import { TopBar } from './App/TopBar'
import ParticleLayout from './ParticleLayout'
import { RootState } from '@/store'
import { useGetUserMeQuery } from '@/features/auth/auth.api'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ParticleLayout>
      <div className="relative z-10 min-h-dvh w-full">
        <div className="sticky top-0 z-10 mx-auto w-full max-w-[1200px] px-6">
          <TopBar />
        </div>
        <div className="mx-auto w-full max-w-[1200px] grid grid-cols-12 gap-5 px-6 py-5">
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-19">
              <LeftNav />
            </div>
          </aside>

          {children}
        </div>
      </div>
    </ParticleLayout>
  )
}
