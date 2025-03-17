"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";

export default function BrokerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // If not loading and no user, the useEffect will handle the redirect
  if (!user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    );
  }

  // Render children with dashboard layout when authenticated
  return (
    <SidebarProvider defaultOpen>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
} 