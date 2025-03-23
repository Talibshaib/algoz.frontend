import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
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
    
    // Update the session using our Supabase utility
    const res = await updateSession(request);
    
    // For public routes - always allow access
    if (isPublicRoute(pathname)) {
      return res;
    }
    
    // For API routes that require authentication
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/public/')) {
      // Authentication check will be handled by the API route handlers
      return res;
    }
    
    // For dashboard routes (client-side auth will also handle this)
    if (isDashboardRoute(pathname)) {
      return res;
    }
    
    // For auth routes (login, etc.)
    if (isAuthRoute(pathname)) {
      return res;
    }
    
    // Default allow access and let client handle auth redirections
    return res;
  } catch (error) {
    console.error("[Middleware] Error:", error);
    // Continue without blocking on error
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};