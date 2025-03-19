import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { 
  DASHBOARD_ROUTE, 
  LOGIN_ROUTE,
  isBypassRoute, 
  isPublicRoute,
  isAuthRoute,
  isDashboardRoute
} from '@/constants/routes';

/**
 * Minimal middleware focusing only on API route protection
 * Let the RouteGuard handle most client-side redirections
 */
export async function middleware(request: NextRequest) {
  try {
    // Get the pathname
    const { pathname } = request.nextUrl;
    
    // Skip middleware for static assets, API routes, etc.
    if (isBypassRoute(pathname)) {
      return NextResponse.next();
    }
    
    // Create response and Supabase client
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    
    // Get session
    let session = null;
    try {
      const { data } = await supabase.auth.getSession();
      session = data?.session;
    } catch (error) {
      console.error("[Middleware] Session error:", error);
      // Continue without session if there's an error
      return NextResponse.next();
    }
    
    // For public routes - always allow access
    if (isPublicRoute(pathname)) {
      return res;
    }
    
    // For API routes that require authentication
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/public/')) {
      if (!session) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
    }
    
    // Let client-side handle most redirections
    return res;
  } catch (error) {
    // If anything fails, log and continue
    console.error("[Middleware] Error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 