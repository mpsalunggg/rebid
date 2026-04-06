import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetUserMeQuery } from '@/features/auth/auth.api'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

export function RightSidebar() {
  const { user } = useSelector((state: RootState) => state.auth)
  const { isFetching } = useGetUserMeQuery(undefined, { skip: !!user })

  const getInitials = (name: string) => {
    const words = name.trim().split(' ')
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase()
    }
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  const userName = user?.name || 'User'
  const userEmail = user?.email || ''
  const userInitials = getInitials(userName)

  return (
    <div className="space-y-4">
      {!isFetching ? (
        <Card className="overflow-hidden p-0 border shadow-none">
          <div
            className="relative h-26 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1539780280971-74e98d5d3e5c?q=80&w=2208&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          ></div>

          <CardContent className="pb-4 pt-0 px-4">
            <div className="-mt-12 mb-3 flex items-end gap-3">
              <div className="relative">
                <div className="flex h-13 w-13 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/80 text-lg font-bold text-primary-foreground shadow-lg ring-4 ring-card">
                  {userInitials}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="truncate text-base font-semibold text-foreground">
                {userName}
              </h3>
              <p className="truncate text-sm text-muted-foreground">
                {userEmail}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Skeleton className="w-full h-56" />
      )}

      {/* <section className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-black/5">
        <div className="text-sm font-semibold">Trending Auctions</div>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="rounded-xl bg-neutral-50 px-3 py-2">Vintage Rolex</li>
          <li className="rounded-xl bg-neutral-50 px-3 py-2">
            Street Art Prints
          </li>
          <li className="rounded-xl bg-neutral-50 px-3 py-2">
            Classic Muscle Cars
          </li>
        </ul>
      </section> */}
    </div>
  )
}
