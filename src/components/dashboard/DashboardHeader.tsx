"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import Sidebar from "./Sidebar"
import { Bell, Settings, LogOut, User, Menu } from "lucide-react"

// Import NextUI components
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react"

// Import custom UI components for shadcn
import { Button as ShadcnButton } from "@/components/ui/button"
import { Avatar as ShadcnAvatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DashboardHeaderProps {
  username?: string;
  clientCode?: string;
  zCoins?: number;
}

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const { toggleSidebar, isMobile, setOpenMobile, openMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await logout()
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
          {/* Mobile menu button */}
          <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetTrigger asChild>
              <ShadcnButton
                variant="ghost"
                size="sm"
                className="md:hidden mr-1 sm:mr-2 h-8 w-8"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </ShadcnButton>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] [&>button]:hidden">
              <Sidebar className="border-none" />
            </SheetContent>
          </Sheet>

          {/* Desktop menu button */}
          <ShadcnButton
            variant="ghost"
            size="sm"
            className="hidden md:flex mr-1 sm:mr-2 h-8 w-8"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </ShadcnButton>

          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 ml-1 sm:ml-2">
            <span className="font-bold text-sm sm:text-base">AlgoZ</span>
          </Link>
        </div>
        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <Button
              isIconOnly
              variant="light"
              aria-label="Notifications"
              className="text-gray-600"
            >
              <Bell size={20} />
            </Button>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="p-0"
                >
                  <Avatar
                    src={user?.avatar || ""}
                    size="sm"
                    className="transition-transform"
                  >
                    {user?.fullName?.charAt(0) || "U"}
                  </Avatar>
                  <div className="text-right mr-1 sm:mr-2 hidden sm:block">
                    <div className="font-medium text-sm sm:text-base">{user?.fullName || user?.username || "Guest"}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Client #{user?._id?.substring(0, 5) || ""}
                    </div>
                  </div>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu actions">
                <DropdownItem key="profile" startContent={<User size={18} />}>
                  <Link href="/dashboard/profile" className="w-full block">
                    Profile
                  </Link>
                </DropdownItem>
                <DropdownItem key="settings" startContent={<Settings size={18} />}>
                  <Link href="/dashboard/settings" className="w-full block">
                    Settings
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  )
}

