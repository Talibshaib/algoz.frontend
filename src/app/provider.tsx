"use client"
import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <AuthProvider>
        <AdminAuthProvider>
          {children}
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
