"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Sidebar from "./Sidebar"
import { HealthCheck } from "@/components/ui/HealthCheck"
import { Bell, Settings, LogOut, User } from "lucide-react"
import { Dropdown, DropdownTrigger, DropdownItem } from "@nextui-org/react"

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
  const [isServerOnline, setIsServerOnline] = useState(true)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between w-full px-2 sm:px-4">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-1 sm:mr-2 h-8 w-8"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] [&>button]:hidden">
              <Sidebar className="border-none" />
            </SheetContent>
          </Sheet>
          
          {/* Desktop menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex mr-1 sm:mr-2 h-8 w-8"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 ml-1 sm:ml-2">
            <span className="font-bold text-sm sm:text-base">AlgoZ</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Server status indicator */}
          <div className="hidden md:block">
            <HealthCheck 
              compact={true} 
              onStatusChange={setIsServerOnline}
              className="mr-2"
            />
          </div>

          {/* Notifications */}
          <Button
            isIconOnly
            variant="light"
            aria-label="Notifications"
            className="text-gray-600"
          >
            <Bell size={20} />
          </Button>

          <div className="text-right mr-1 sm:mr-2 hidden sm:block">
            <div className="font-medium text-sm sm:text-base">{user?.fullName || user?.username || "Guest"}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Client #{user?._id?.substring(0, 5) || ""}
            </div>
          </div>
          <Avatar className="h-8 w-8">
            {user?.avatar && <AvatarImage src={user.avatar} alt={user.fullName || user.username} />}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {(user?.fullName || user?.username || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
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
                  name={user?.fullName?.charAt(0) || "U"}
                  src={user?.avatar || ""}
                  size="sm"
                  className="transition-transform"
                />
                <span className="ml-2 hidden md:inline-block">
                  {user?.fullName || "User"}
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu actions" className="w-56">
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
              <DropdownItem 
                key="logout" 
                color="danger" 
                startContent={<LogOut size={18} />}
                onClick={handleLogout}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}

