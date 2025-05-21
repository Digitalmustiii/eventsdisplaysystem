// Root layout component that would typically be in app/layout.tsx or similar
// This shows how the components should be arranged

'use client'

import Header from './components/Header'
import Body from './components/Body'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full">
      {/* No margin or padding between components */}
      <Header />
      <Body />
      {children}
    </div>
  )
}