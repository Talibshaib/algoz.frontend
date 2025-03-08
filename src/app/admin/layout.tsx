"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import { AdminHeader } from "@/components/admin/AdminHeader"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const { admin, isLoading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    // If authentication check is complete and admin is not logged in, redirect to regular login page
    if (!isLoading && !admin) {
      router.push("/login")
    }
  }, [admin, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg">Checking admin privileges...</p>
      </div>
    )
  }
  
  // If not loading and no admin, the useEffect will handle the redirect
  // We still need to render something while the redirect happens
  if (!admin) {
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