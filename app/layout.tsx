//layout.tsx
import '@/styles/globals.css'
import type { ReactNode } from 'react'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex flex-col min-h-screen w-full overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}