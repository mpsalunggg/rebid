import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const items = [
  { href: '/home', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/notifications', label: 'Notifications' },
  { href: '/bookmarks', label: 'Bookmarks' },
  { href: '/profile', label: 'Profile' },
]

export function LeftNav() {
  return (
    <nav className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <Link href="/" className="mb-4 flex items-center gap-2">
        <Image src="/rebid.svg" alt="Rebid" width={32} height={32} />
        <span className="text-lg font-semibold">Rebid</span>
      </Link>

      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              className="block rounded-xl px-3 py-2 text-sm hover:bg-neutral-100"
              href={it.href}
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>

      <Button className="mt-4 w-full">
        + Auction
      </Button>
    </nav>
  )
}
