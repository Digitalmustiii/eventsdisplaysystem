// app/layout.tsx
import '@/styles/globals.css'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen w-full overflow-hidden">
        {children}
      </body>
    </html>
  )
}
