"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function BrokerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // If not loading and no user, the useEffect will handle the redirect
  if (!user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    );
  }

  // Render children when authenticated
  return children;
} 