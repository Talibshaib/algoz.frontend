"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DashboardHeader, Sidebar } from "@/features/dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Loader2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  // Close mobile sidebar when navigating
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  // Show loading state while checking authentication
  if (isLoading || !isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <DashboardHeader>
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <div className="flex h-16 items-center border-b px-4">
                <div className="font-semibold">AlgoZ</div>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="py-2">
                <Sidebar className="border-0" />
              </div>
            </SheetContent>
          </Sheet>
        </DashboardHeader>
        
        <div className="flex flex-1 overflow-hidden">
          <div className={cn("hidden md:block border-r")}>
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto bg-background" suppressHydrationWarning>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}