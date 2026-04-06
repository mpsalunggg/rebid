import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Gavel,
  TrendingUp,
  Zap,
  Laptop,
  Camera,
  Watch,
  Smartphone,
  Gem,
  Bike,
  Headphones,
  Paintbrush,
  Github,
  Twitter,
  Instagram,
} from 'lucide-react'

import ToggleSwitch from '@/components/common/ToggleSwitch'

const MARQUEE_ITEMS = [
  {
    icon: Laptop,
    name: 'MacBook Pro M4',
    price: 'Rp 18.500.000',
    bids: 24,
    gradient: 'from-blue-500/20 to-indigo-500/20',
    iconColor: 'text-blue-400',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
  },
  {
    icon: Camera,
    name: 'Sony A7C II',
    price: 'Rp 32.000.000',
    bids: 17,
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
  },
  {
    icon: Watch,
    name: 'Rolex Submariner',
    price: 'Rp 145.000.000',
    bids: 41,
    gradient: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-400',
    image:
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80',
  },
  {
    icon: Smartphone,
    name: 'iPhone 16 Pro Max',
    price: 'Rp 21.750.000',
    bids: 33,
    gradient: 'from-slate-500/20 to-gray-500/20',
    iconColor: 'text-slate-400',
    image:
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80',
  },
  {
    icon: Gem,
    name: 'Diamond Ring 2ct',
    price: 'Rp 78.000.000',
    bids: 19,
    gradient: 'from-cyan-500/20 to-teal-500/20',
    iconColor: 'text-cyan-400',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
  },
  {
    icon: Bike,
    name: 'Brompton M6L',
    price: 'Rp 28.500.000',
    bids: 12,
    gradient: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-400',
    image:
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80',
  },
  {
    icon: Headphones,
    name: 'Sony WH-1000XM5',
    price: 'Rp 5.200.000',
    bids: 28,
    gradient: 'from-rose-500/20 to-pink-500/20',
    iconColor: 'text-rose-400',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  },
  {
    icon: Paintbrush,
    name: 'Abstract Art Print',
    price: 'Rp 9.800.000',
    bids: 8,
    gradient: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-400',
    image:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&q=80',
  },
]

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-600/8 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-emerald-400/8 blur-3xl" />
      </div>

      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/rebid.svg" alt="Rebid" width={32} height={32} />
          <span className="text-lg font-bold tracking-tight">Rebid</span>
        </Link>

        <div className="flex items-center gap-3">
          <ToggleSwitch />
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs font-medium tracking-wide text-emerald-500 dark:text-emerald-400">
            Live Auction Platform
          </span>
        </div>

        <h1 className="mb-6 max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          Bid Smart,{' '}
          <span className="bg-linear-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent">
            Win Big
          </span>
        </h1>

        <p className="mb-10 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Rebid adalah platform lelang real-time yang transparan dan adil.
          Temukan item eksklusif, pasang penawaran, dan menangkan dengan harga
          terbaik.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30"
          >
            Mulai Sekarang
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-7 py-3.5 text-sm font-semibold text-muted-foreground backdrop-blur-sm transition-all hover:border-border hover:bg-muted hover:text-foreground"
          >
            Lihat Lelang
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-border pt-10">
          {[
            { icon: Gavel, value: '2,400+', label: 'Lelang Aktif' },
            { icon: TrendingUp, value: 'Rp 4.8M', label: 'Total Volume Bid' },
            { icon: Zap, value: '< 1 dtk', label: 'Update Real-time' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15">
                <Icon className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold leading-none">{value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Marquee auction cards */}
        <div className="mt-16 w-full">
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Item Lelang Terkini
          </p>
          <style>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .marquee-track {
              animation: marquee 30s linear infinite;
            }
            .marquee-track:hover {
              animation-play-state: paused;
            }
          `}</style>

          {/* Fade masks */}
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-background to-transparent" />

            <div className="flex">
              <div className="marquee-track flex shrink-0 gap-4">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                  <div
                    key={i}
                    className="flex w-64 shrink-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Image */}
                    <div
                      className={`relative h-20 w-20 shrink-0 bg-linear-to-br ${item.gradient} overflow-hidden`}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover opacity-80 mix-blend-luminosity"
                        sizes="80px"
                      />

                      <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/40 px-1.5 py-0.5 backdrop-blur-sm">
                        <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />
                        <span className="text-[9px] font-medium text-white">
                          Live
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-2">
                      <p className="truncate text-sm font-semibold leading-tight">
                        {item.name}
                      </p>
                      <p className="text-sm font-bold text-emerald-500 dark:text-emerald-400">
                        {item.price}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.bids} bids
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 w-full max-w-2xl">
          <div className="relative rounded-2xl border border-border bg-card/50 p-1.5 backdrop-blur-sm">
            <div className="space-y-2 rounded-xl bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Live Bids
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-500 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  3 bidder aktif
                </span>
              </div>
              {[
                {
                  name: 'MacBook Pro M4',
                  price: 'Rp 18.500.000',
                  time: '2m ago',
                  hot: true,
                },
                {
                  name: 'Sony A7C II',
                  price: 'Rp 32.000.000',
                  time: '5m ago',
                  hot: false,
                },
                {
                  name: 'iPhone 16 Pro Max',
                  price: 'Rp 21.750.000',
                  time: '8m ago',
                  hot: false,
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/20">
                      <Gavel className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-500 dark:text-emerald-400">
                      {item.price}
                    </p>
                    {item.hot && (
                      <span className="text-[10px] font-medium text-orange-400">
                        🔥 trending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

            <div className="md:col-span-1">
              <Link href="/" className="mb-4 flex items-center gap-2">
                <Image src="/rebid.svg" alt="Rebid" width={28} height={28} />
                <span className="text-base font-bold tracking-tight">
                  Rebid
                </span>
              </Link>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Platform lelang real-time yang transparan, aman, dan mudah
                digunakan.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Github, label: 'GitHub' },
                  { icon: Twitter, label: 'X' },
                  { icon: Instagram, label: 'Instagram' },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-500"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {[
              {
                title: 'Platform',
                links: ['Lelang Aktif', 'Cara Kerja', 'Harga & Biaya', 'FAQ'],
              },
              {
                title: 'Perusahaan',
                links: ['Tentang Kami', 'Blog', 'Karir', 'Kontak'],
              },
              {
                title: 'Legal',
                links: [
                  'Syarat & Ketentuan',
                  'Kebijakan Privasi',
                  'Cookie Policy',
                ],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-foreground">
                  {title}
                </p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="/login"
                        className="text-sm text-muted-foreground transition-colors hover:text-emerald-500"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Rebid. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
