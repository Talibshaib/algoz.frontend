"use client"
import React, { useState, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { NetworkStatus } from "@/components/ui/NetworkStatus";
import { Toaster } from "sonner";
import { checkAPIHealth } from "@/services/healthCheck";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isServerOnline, setIsServerOnline] = useState(true);

  // Check server status on initial load
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const { isOnline } = await checkAPIHealth();
        setIsServerOnline(isOnline);
      } catch (error) {
        console.error("Failed to check server status:", error);
        setIsServerOnline(false);
      }
    };
    
    checkServerStatus();
  }, []);

  return (
    <NextUIProvider>
      <AuthProvider>
        <AdminAuthProvider>
          {children}
          <NetworkStatus 
            onStatusChange={setIsServerOnline} 
          />
          <Toaster 
            position="top-right"
            richColors
            closeButton
          />
        </AdminAuthProvider>
      </AuthProvider>
    </NextUIProvider>
  );
}
