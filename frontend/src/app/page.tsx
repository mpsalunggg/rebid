import { AppLayout } from '@/components/layout/AppLayout'

export default function HomePage() {
  return (
    <AppLayout>
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <div className="text-sm text-neutral-600">
          What's happening in the auction world?
        </div>
        <div className="mt-4 h-64 rounded-xl bg-neutral-100" />
      </section>
    </AppLayout>
  )
}
