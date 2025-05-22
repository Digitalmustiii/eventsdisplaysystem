// app/admin/page.tsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import EventAdmin from '@/app/components/EventAdmin'
import LogoutButton from '@/app/components/LogoutButton'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
     
  if (!session) {
    redirect('/admin/signin')
  }
     
  return (
    <div className="min-h-screen bg-[#101926] text-white">
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-700">
          <div>
            <h1 className="text-3xl font-bold text-white"
                style={{
                  background: 'linear-gradient(to right, #163E8C, #0367A6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
              Manage Upcoming Events
            </h1>
            <p className="text-gray-300 mt-1">Admin dashboard for event management</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
              <span className="text-gray-300">Admin Access</span>
            </div>
            <LogoutButton />
          </div>
        </div>
                
        <EventAdmin />
      </div>
    </div>
  )
}