import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"
import { Toaster } from "@/components/ui/toaster"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Surat Local - Your Complete City Guide | सूरत लोकल",
  description:
    "Discover the best of Surat - restaurants, shopping, services, healthcare, education and more. Your trusted local business directory for Surat, Gujarat.",
   keywords: [
    "Surat",
    "Gujarat",
    "local business",
    "Surat directory",
    "restaurants in Surat",
    "services in Surat",
    "સુરત",
  ],

  verification: {
    google: "GAu90y62E2PDsrU4U1SSQYd_FtuHPz-czmbryanBPW8",
  },
  
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
