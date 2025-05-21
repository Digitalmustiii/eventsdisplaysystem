// lib/auth.ts
import NextAuth, { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null
        const { username, password } = credentials
        if (
          username === process.env.ADMIN_USER &&
          password === process.env.ADMIN_PASS
        ) {
          return { id: '1', name: 'Admin' } as User
        }
        return null
      }
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/admin/signin' }
}

export default NextAuth(authOptions)
