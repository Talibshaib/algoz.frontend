"use client"
import React, { useState, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { NetworkStatus } from "@/components/ui/NetworkStatus";
import { Toaster } from "sonner";
import { checkAPIHealth, loadSavedEndpoint } from "@/services/healthCheck";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isServerOnline, setIsServerOnline] = useState(true);

  // Load any saved custom endpoint and check server status on initial load
  useEffect(() => {
    // First load any saved custom endpoint
    loadSavedEndpoint();
    
    // Then check server status
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
    
    // Set up periodic health checks
    const intervalId = setInterval(async () => {
      try {
        const { isOnline } = await checkAPIHealth();
        setIsServerOnline(isOnline);
      } catch (error) {
        console.error("Periodic health check failed:", error);
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
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
