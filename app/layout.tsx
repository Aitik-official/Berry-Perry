import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Berry Perry | Baby, Kids & Maternity Online Shopping Store',
  description: 'Berry Perry — India’s premier online store for baby products, kids wear, newborn essentials, toys, footwear, diapers, and maternity apparel.',
  keywords: ['baby clothes', 'kids fashion', 'newborn baby care', 'baby diapers', 'toys for kids', 'strollers', 'maternity wear', 'Berry Perry'],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

import { CartProvider } from '@/lib/cart-context'
import { BackToTop } from '@/components/back-to-top'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} style={{ scrollBehavior: 'smooth' }}>
      <body className={`${inter.className} antialiased`}>
        <CartProvider>
          {children}
          <BackToTop />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
