"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import LoadingScreen from "@/components/ui/loading-screen";
import { isAuthRoute, isDashboardRoute, isAdminRoute, isPublicRoute } from "@/constants/routes";
import { LOGIN_ROUTE, DASHBOARD_ROUTE } from "@/constants/routes";

type RouteGuardProps = {
  children: ReactNode;
};

/**
 * Simplified RouteGuard component for client-side protection
 */
export default function RouteGuard({ children }: RouteGuardProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Simple effect to check authentication status once
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        setUser(session?.user || null);
        
        // Simple rules for authorization
        if (isPublicRoute(pathname)) {
          // Public routes are always accessible
          setAuthorized(true);
        } else if (isDashboardRoute(pathname) || isAdminRoute(pathname)) {
          // Protected routes require authentication
          if (!session) {
            router.replace(`${LOGIN_ROUTE}?redirectTo=${encodeURIComponent(pathname)}`);
            setAuthorized(false);
          } else {
            setAuthorized(true);
          }
        } else if (isAuthRoute(pathname) && session) {
          // Redirect logged-in users away from auth pages
          router.replace(DASHBOARD_ROUTE);
          setAuthorized(false);
        } else {
          // Default: allow access
          setAuthorized(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // Default to authorized in case of errors to prevent blocking users
        setAuthorized(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Listen for auth changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return authorized ? <>{children}</> : <LoadingScreen />;
} 