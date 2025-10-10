import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

// Routes that require authentication
const protectedRoutes = ["/problems/new", "/settings", "/admin"]

// Routes that should redirect to problems if already authenticated
const authRoutes = ["/login", "/register"]
const landingPage = "/"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  // Check if user is authenticated
  let isAuthenticated = false
  if (token) {
    const payload = await verifyToken(token)
    isAuthenticated = !!payload
  }

  // Redirect to login if accessing protected route without auth
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = new URL("/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
  }

  // Redirect to profile if accessing auth routes while authenticated
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      // We need to get the username from the token to redirect to profile
      const payload = await verifyToken(token!)
      if (payload && payload.username) {
        return NextResponse.redirect(new URL(`/profile/${payload.username}`, request.url))
      }
      // Fallback to problems if username not available
      return NextResponse.redirect(new URL("/problems", request.url))
    }
  }

  // Redirect authenticated users from landing page to their profile
  if (pathname === landingPage && isAuthenticated) {
    const payload = await verifyToken(token!)
    if (payload && payload.username) {
      return NextResponse.redirect(new URL(`/profile/${payload.username}`, request.url))
    }
    // Fallback to problems if username not available
    return NextResponse.redirect(new URL("/problems", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
}
