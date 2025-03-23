"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
import { signOut } from "@/features/auth/utils"
import supabase from "@/lib/supabase"
import { Bell, Settings, LogOut, User, Menu, Sun, Moon, Search } from "lucide-react"

// Import custom UI components for shadcn
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
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
  const [notificationCount, setNotificationCount] = useState(2)

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

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between w-full px-4 sm:px-6"></div>
    </header>
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center justify-between w-full px-4 sm:px-6">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden mr-2 h-9 w-9"
            onClick={() => setOpenMobile(!openMobile)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          {/* Desktop menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex mr-2 h-9 w-9"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 mr-6">
            <span className="font-bold text-lg sm:text-xl">AlgoZ</span>
          </Link>         
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Theme toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="h-9 w-9 text-muted-foreground"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground">
                <Bell size={18} />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <div className="p-3 text-sm hover:bg-muted cursor-pointer">
                  <div className="font-medium">Account connected</div>
                  <div className="text-muted-foreground">Your broker account was successfully connected.</div>
                  <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                </div>
                <div className="p-3 text-sm hover:bg-muted cursor-pointer">
                  <div className="font-medium">New feature available</div>
                  <div className="text-muted-foreground">Automated strategy deployment is now available on your account.</div>
                  <div className="text-xs text-muted-foreground mt-1">1 day ago</div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="outline" size="sm" className="w-full">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="pl-1 pr-2 py-1.5 h-9 flex items-center space-x-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.user_metadata?.full_name || "User"} />
                  <AvatarFallback>
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <div className="font-medium text-sm">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Guest"}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
      
      {/* Mobile search section removed as requested */}
    </header>
  )
}
