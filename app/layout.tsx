import './globals.css'
import { ReactNode } from 'react'
import { ConvexAuthProvider } from '@/lib/convex'
import Header from '@/components/Header'

export const metadata = {
  title: 'Elise | Book & Art Sharing',
  description: 'A vibrant, safe space for teens to share reviews and art',
  openGraph: {
    title: 'Elise | Book & Art Sharing',
    description: 'A vibrant, safe space for teens to share reviews and art',
    type: 'website'
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-inkBlack dark:bg-inkBlack dark:text-white transition-colors">
        <ConvexAuthProvider>
          <Header />
          <div className="mx-auto max-w-7xl px-4">
            {children}
          </div>
        </ConvexAuthProvider>
      </body>
    </html>
  )
}