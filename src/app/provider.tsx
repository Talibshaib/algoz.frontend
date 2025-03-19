"use client"
import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      {children}
      <Toaster 
        position="top-right"
        richColors
        closeButton
      />
    </NextUIProvider>
  );
}
