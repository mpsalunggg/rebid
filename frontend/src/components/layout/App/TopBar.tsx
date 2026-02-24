export function TopBar() {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-300"
            placeholder="Search auctions, sellers, items..."
          />
        </div>

        <button className="rounded-xl px-3 py-2 text-sm hover:bg-neutral-100">
          Theme
        </button>

        <div className="h-9 w-9 rounded-full bg-neutral-200" />
      </div>
    </div>
  )
}
