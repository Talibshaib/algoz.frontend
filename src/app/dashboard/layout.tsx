"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DashboardHeader, Sidebar } from "@/features/dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";
import supabase from "@/lib/supabase";
import { LOGIN_ROUTE } from "@/constants/routes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // For client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Direct Supabase session check to ensure dashboard access is authorized
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          console.log("No valid Supabase session, redirecting to login");
          router.replace(LOGIN_ROUTE);
          return;
        }
        
        // Store the user
        setUser(data.session.user);
      } catch (err) {
        console.error("Error checking Supabase session:", err);
        router.replace(LOGIN_ROUTE);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.replace(LOGIN_ROUTE);
      } else if (session) {
        setUser(session.user);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading || !isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If not loading and no user, the useEffect will handle the redirect
  if (!user) {
    return null;
  }
  
  // Render children with dashboard layout when authenticated
  return (
    <SidebarProvider defaultOpen>
      <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
        <DashboardHeader />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-background p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}