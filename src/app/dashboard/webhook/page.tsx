"use client"

import React from "react";
import WebhookUrl from "@/components/dashboard/WebhookUrl";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function WebhookPage() {
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