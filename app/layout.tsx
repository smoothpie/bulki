import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'В поисках булок - Tbilisi Bun Map 🥐',
  description: 'Карта булочных в Тбилиси - найди свою любимую булочку!',
  manifest: '/manifest.json',
  themeColor: '#FF8C42',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Булки Тбилиси'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Булки Тбилиси" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>{children}</body>
    </html>
  )
}
