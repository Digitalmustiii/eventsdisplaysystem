// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/admin/signin'
  }
})

export const config = {
  // protect /admin and all sub-paths
  matcher: ['/admin/:path*']
}
