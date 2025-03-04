"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  username?: string;
  clientCode?: string;
  zCoins?: number;
}

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-screen border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between w-full px-4">
        <div className="flex items-center">
          <SidebarTrigger className="md:hidden mr-2" />
          <Link href="/" className="flex items-center space-x-2 ml-2">
            <span className="font-bold">AlgoZ</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
            <span>{user?.balance || 0}</span>
          </div>
          
          <div className="text-right mr-2">
            <div className="font-medium">{user?.fullName || user?.username || "Guest"}</div>
            <div className="text-sm text-muted-foreground">
              Client #{user?._id?.substring(0, 5) || ""}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8 cursor-pointer">
                {user?.avatar && <AvatarImage src={user.avatar} alt={user.fullName || user.username} />}
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {(user?.fullName || user?.username || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                try {
                  await logout();
                } catch (error) {
                  console.error("Error during logout:", error);
                }
              }}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

