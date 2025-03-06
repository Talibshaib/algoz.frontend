"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If authentication check is complete and user is not logged in, redirect to login
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

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

  return children
}

