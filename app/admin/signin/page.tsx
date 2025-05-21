'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignInPage() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      redirect: false,
      username: user,
      password: pass,
      callbackUrl: '/admin'
    })

    setLoading(false)
    if (res?.error) {
      setError('Invalid credentials')
    } else {
      // NextAuth puts the cookie; now navigate
      window.location.href = res?.url || '/admin'
    }
  }

  return (
    <main className="h-screen flex items-center justify-center bg-[#101926] text-white">
      <div className="w-full max-w-md">
        {/* Title Banner - matching the gradient from UpcomingEvents */}
        <div
          className="py-4 px-6 font-bold text-2xl text-center text-white rounded-t-lg"
          style={{
            background: 'linear-gradient(to right, #163E8C, #0367A6)',
          }}
        >
          ADMIN ACCESS
        </div>
        
        {/* Form Container */}
        <form onSubmit={submit} className="space-y-6 p-8 bg-[#1A2736] rounded-b-lg border border-gray-700 border-t-0 shadow-xl">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded flex items-center">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <input
                id="username"
                placeholder="Enter your username"
                className="block w-full pl-10 pr-3 py-3 rounded bg-[#101926] border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-150"
                value={user}
                onChange={e => setUser(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="block w-full pl-10 pr-3 py-3 rounded bg-[#101926] border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-150"
                value={pass}
                onChange={e => setPass(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 flex justify-center items-center rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50"
              style={{
                background: 'linear-gradient(to right, #163E8C, #0367A6)',
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
          
          <div className="text-sm text-center text-gray-400 mt-6">
            Secure admin access only. Unauthorized access is prohibited.
          </div>
        </form>
      </div>
    </main>
  )
}