export function RightSidebar() {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <div className="text-sm font-semibold">Profile</div>
        <div className="mt-3 h-24 rounded-xl bg-neutral-100" />
        <div className="mt-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-neutral-200" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">John Doe</div>
            <div className="truncate text-xs text-neutral-500">@johndoe</div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
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
      </section>
    </div>
  )
}
