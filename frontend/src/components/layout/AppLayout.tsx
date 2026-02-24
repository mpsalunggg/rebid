import type { ReactNode } from 'react'
import { LeftNav } from './App/LeftNav'
import { TopBar } from './App/TopBar'
import { RightSidebar } from './App/RightSidebar'
import ParticleLayout from './ParticleLayout'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ParticleLayout>
      <div className="min-h-dvh w-full">
        <div className="mx-auto w-full max-w-[1200px] grid grid-cols-12 gap-8 px-6 py-6">
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-4">
              <LeftNav />
            </div>
          </aside>

          <main className="col-span-12 lg:col-span-6">
            <div className="sticky top-4 z-10">
              <TopBar />
            </div>

            <div className="mt-4">{children}</div>
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
