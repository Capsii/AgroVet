import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/contexts/language-context'
import { AuthProvider } from '@/contexts/auth-context'
import { DiagnosisProvider } from '@/contexts/diagnosis-context'
import { CartProvider } from '@/contexts/cart-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AgroVet - Smart Cattle Health Guide',
  description: 'AI-powered cattle disease diagnosis platform for farmers in Gujarat. Get instant diagnosis, treatment guidance, and find nearby veterinary hospitals.',
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
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <DiagnosisProvider>
            <CartProvider>
              <LanguageProvider>
                {children}
              </LanguageProvider>
            </CartProvider>
          </DiagnosisProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
