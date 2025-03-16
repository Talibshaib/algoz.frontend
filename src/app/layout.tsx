import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./provider"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AlgoZ - Algorithmic Trading Made Simple",
  description:
    "Leverage advanced trading algorithms and copy successful strategies with our automated trading platform.",
  metadataBase: new URL('https://algoz-trading.com'),
  openGraph: {
    title: "AlgoZ - Algorithmic Trading Made Simple",
    description: "Leverage advanced trading algorithms and copy successful strategies with our automated trading platform.",
    url: 'https://algoz-trading.com',
    siteName: 'AlgoZ',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AlgoZ Trading Platform',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}

