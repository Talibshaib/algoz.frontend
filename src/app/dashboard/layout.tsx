"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { HealthCheck } from "@/components/ui/HealthCheck"
import { toast } from "sonner"
import { checkAPIHealth } from "@/services/healthCheck"
import NetworkChangeAlert from "@/components/security/NetworkChangeAlert"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [serverStatus, setServerStatus] = useState<"online" | "offline" | "unknown">("unknown")

  useEffect(() => {
    // If authentication check is complete and user is not logged in, redirect to login
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  // Check server status on initial load
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const { isOnline } = await checkAPIHealth(true);
        setServerStatus(isOnline ? "online" : "offline");
        
        if (!isOnline) {
          toast.error("Server connection issue", {
            description: "You may experience issues with some features. We're working to resolve this.",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Server status check failed:", error);
        setServerStatus("offline");
      }
    };
    
    checkServerStatus();
  }, []);

  // Show loading state only when isLoading is true
  // This prevents the flash of dashboard content before redirect
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }
  
  // If not loading and no user, the useEffect will handle the redirect
  // We still need to render something while the redirect happens
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    )
  }

  // Only render children when we have a valid user
  return (
    <div className="min-h-screen bg-gray-50">
      {serverStatus === "offline" && (
        <div className="bg-amber-100 text-amber-800 p-2 text-center text-sm">
          Server connection issues detected. Some features may be unavailable.
          <button 
            className="ml-2 underline"
            onClick={async () => {
              const { isOnline } = await checkAPIHealth(true);
              setServerStatus(isOnline ? "online" : "offline");
              if (isOnline) {
                toast.success("Connection restored");
              }
            }}
          >
            Check again
          </button>
        </div>
      )}
      {children}
      <NetworkChangeAlert />
    </div>
  )
}

