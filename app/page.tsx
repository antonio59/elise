'use client'
import Link from 'next/link'

export default function Landing() {
  return (
    <main className="py-16">
      <section className="flex flex-col items-center text-center gap-6">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          Splash your stories in color
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl">
          Track books, share reviews, and publish digital art in a playful Splatoon-inspired interface with Obscura polish.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/gallery" className="rounded-full bg-inkPink px-6 py-3 text-white text-base">View Gallery</Link>
          <Link href="/bookshelf" className="rounded-full bg-inkCyan px-6 py-3 text-white text-base">View Bookshelf</Link>
          <Link href="/login" className="rounded-full bg-inkPurple px-6 py-3 text-white text-base">Start Your Collection</Link>
        </div>
        <div aria-hidden className="relative mt-10 flex gap-3">
          <span className="h-6 w-6 rounded-full bg-inkPink" />
          <span className="h-6 w-6 rounded-full bg-inkLime" />
          <span className="h-6 w-6 rounded-full bg-inkCyan" />
          <span className="h-6 w-6 rounded-full bg-inkPurple" />
        </div>
      </section>
    </main>
  )
}