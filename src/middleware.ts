import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the session cookie (Firebase creates this if you set it up, 
  // or you can use your own 'auth-token' cookie)
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // 2. Define your Route Groups
  const isPublicRoute = pathname === '/' || pathname === '/auth';
  const isProtectedRoute = pathname.startsWith('/practice') || 
                           pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/topics');

  // 3. LOGIC: If trying to access a protected route without a session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // 4. LOGIC: If logged in, don't let them go to the Auth/Login page
  if (pathname === '/auth' && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// 5. MATCHERS: Only run middleware on these specific paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};