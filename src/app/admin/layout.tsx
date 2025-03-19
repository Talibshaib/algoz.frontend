"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader, AdminSidebar } from "@/features/admin"
import { SidebarProvider } from "@/components/ui/sidebar"
import supabase from "@/lib/supabase"
import { LOGIN_ROUTE } from "@/constants/routes"
import { checkIsAdmin } from "@/features/auth/utils"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Get the current session
        const { data, error } = await supabase.auth.getSession()
        
        if (error || !data.session) {
          console.log("No valid session, redirecting to login")
          router.replace(LOGIN_ROUTE)
          return
        }
        
        // Check if the user is an admin
        const userId = data.session.user.id
        const adminStatus = await checkIsAdmin(userId)
        
        if (!adminStatus) {
          console.log("User is not an admin, redirecting to login")
          router.replace(LOGIN_ROUTE)
          return
        }
        
        // User is an admin
        setIsAdmin(true)
      } catch (err) {
        console.error("Error checking admin status:", err)
        router.replace(LOGIN_ROUTE)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAdminStatus()
    
    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        router.replace(LOGIN_ROUTE)
      } else if (session) {
        const adminStatus = await checkIsAdmin(session.user.id)
        setIsAdmin(adminStatus)
      }
    })
    
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg">Checking admin privileges...</p>
      </div>
    )
  }
  
  // If not loading and not admin, the useEffect will handle the redirect
  if (!isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <AdminHeader />
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <AdminSidebar />
          </div>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}