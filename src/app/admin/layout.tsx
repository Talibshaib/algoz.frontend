"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/contexts/AdminAuthContext"

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

  return children
}