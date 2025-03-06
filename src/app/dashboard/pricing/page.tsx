"use client"

import React from "react";
import PricingSection from "@/components/dashboard/PricingSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function PricingPage() {
  return (
    <SidebarProvider defaultOpen>
      <div className="relative min-h-screen flex flex-col max-w-full overflow-x-hidden">
        <DashboardHeader />
        <div className="flex flex-1 w-full overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <PricingSection />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}