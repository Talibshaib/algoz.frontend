"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
import { signOut } from "@/features/auth/utils"
import supabase from "@/lib/supabase"
import Sidebar from "./Sidebar"
import { Bell, Settings, LogOut, User, Menu } from "lucide-react"

// Import custom UI components for shadcn
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  children?: React.ReactNode;
}

export function DashboardHeader({ children }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const { toggleSidebar, isMobile, setOpenMobile, openMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Load user data when component mounts
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    loadUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    setMounted(true);
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [])

  const handleLogout = async () => {
    await signOut();
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between w-full px-2 sm:px-4"></div>
    </header>
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between w-full px-2 sm:px-4">
        <div className="flex items-center">
          {/* Mobile menu button - Only show if children aren't provided */}
          {!children && (
            <Sheet open={openMobile} onOpenChange={setOpenMobile}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden mr-1 sm:mr-2 h-8 w-8"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]">
                <Sidebar className="border-none" />
              </SheetContent>
            </Sheet>
          )}

          {/* Children (for custom mobile menu) */}
          {children}

          {/* Desktop menu button - Show only if children aren't provided */}
          {!children && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex mr-1 sm:mr-2 h-8 w-8"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}

          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 ml-1 sm:ml-2">
            <span className="font-bold text-sm sm:text-base">AlgoZ</span>
          </Link>
        </div>
        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="text-muted-foreground"
            >
              <Bell size={20} />
            </Button>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 flex items-center space-x-2 h-auto">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.user_metadata?.full_name || "User"} />
                    <AvatarFallback>
                      {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left mr-1 sm:mr-2 hidden sm:block">
                    <div className="font-medium text-sm sm:text-base">
                      {user?.user_metadata?.full_name || user?.email || "Guest"}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Client #{user?.id?.substring(0, 5) || ""}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

