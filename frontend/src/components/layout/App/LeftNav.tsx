'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/notifications', label: 'Notifications' },
  { href: '/bookmarks', label: 'Bookmarks' },
  { href: '/profile', label: 'Profile' },
]

export function LeftNav() {
  const pathname = usePathname()

  return (
    <nav className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-black/5">
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              className={cn(
                'block rounded-lg px-3 py-2 text-sm hover:bg-primary/10',
                pathname === it.href && 'bg-primary/10 text-primary',
              )}
              href={it.href}
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>

      <Button className="mt-4 w-full">+ Auction</Button>
    </nav>
  )
}
