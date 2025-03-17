"use client"

import React, { useState, useEffect } from "react";
import WebhookUrl from "@/components/dashboard/WebhookUrl";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function WebhookPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a minimal layout during server-side rendering
  // This prevents hydration errors by ensuring the server and client render the same initial HTML
  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto">
            <WebhookUrl />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}