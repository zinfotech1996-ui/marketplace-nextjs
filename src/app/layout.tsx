import type { Metadata, Viewport } from "next"

import "./globals.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

const title = "Marketplace — buy and sell in your community"
const description =
  "A mini Facebook-style marketplace. Browse listings, post your own with a photo, and message sellers. Built with React 19, Next.js 16, Supabase Storage, and Tailwind CSS."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Marketplace",
  authors: [{ name: "Enrique Ferolino" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Marketplace",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1877f2",
  colorScheme: "light",
}

import { Suspense } from "react"

import { TopBar } from "@/components/marketplace/top-bar"

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<div className="h-14 border-b border-fb-border bg-white" />}>
          <TopBar />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
