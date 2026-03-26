import type { Metadata } from 'next'
import { Outfit, Instrument_Serif } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"]
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'Sound Search - Find Songs by Singing',
  description: 'Find any song by singing the lyrics. Got a melody stuck in your head? Just hum it, sing it, or say the lyrics you remember.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased bg-black`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
