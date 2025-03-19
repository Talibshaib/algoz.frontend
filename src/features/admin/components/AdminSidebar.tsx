"use client"

import React from "react";
import {
  Users,
  Settings,
  BarChart3,
  CreditCard,
  Shield,
  Home,
  ChevronLeft,
  Menu,
  LogOut,
  Bell,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { signOut } from "@/features/auth/utils";

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const { open, toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar();
  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  
  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div
      className={cn(
        "bg-card border-r border-border h-full transition-all duration-300",
        open ? "w-64" : "w-[70px] min-w-[70px]",
        isMobile && "w-full",
        className
      )}
    >
      <div className="flex justify-between items-center p-3 sm:p-4">
        {open && <span className="font-bold text-sm sm:text-base">Admin Panel</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleSidebar()}
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
        >
          {open ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="p-4 space-y-2">
        <Link
          href="/admin"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
            activeItem === "dashboard" && "bg-black text-white"
          )}
          onClick={() => handleItemClick("dashboard")}
        >
          <Home className="h-5 w-5" />
          {open && <span>Dashboard</span>}
        </Link>

        <Link
          href="/admin/users"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
            activeItem === "users" && "bg-black text-white"
          )}
          onClick={() => handleItemClick("users")}
        >
          <Users className="h-5 w-5" />
          {open && <span>User Management</span>}
        </Link>

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="analytics" className="border-none">
            <AccordionTrigger 
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                activeItem === "analytics" && "bg-black text-white"
              )}
              onClick={() => handleItemClick("analytics")}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5" />
                {open && <span>Analytics</span>}
              </div>
            </AccordionTrigger>
            {open && (
              <AccordionContent>
                <div className="pl-11 space-y-2">
                  <Link
                    href="/admin/analytics/users"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    User Analytics
                  </Link>
                  <Link
                    href="/admin/analytics/revenue"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Revenue
                  </Link>
                  <Link
                    href="/admin/analytics/usage"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Platform Usage
                  </Link>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        </Accordion>

        <Link
          href="/admin/payments"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
            activeItem === "payments" && "bg-black text-white"
          )}
          onClick={() => handleItemClick("payments")}
        >
          <CreditCard className="h-5 w-5" />
          {open && <span>Payments</span>}
        </Link>

        <Link
          href="/admin/notifications"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
            activeItem === "notifications" && "bg-black text-white"
          )}
          onClick={() => handleItemClick("notifications")}
        >
          <Bell className="h-5 w-5" />
          {open && <span>Notifications</span>}
        </Link>

        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
            activeItem === "settings" && "bg-black text-white"
          )}
          onClick={() => handleItemClick("settings")}
        >
          <Settings className="h-5 w-5" />
          {open && <span>Settings</span>}
        </Link>

        {open && (
          <div className="py-2">
            <div className="h-[1px] bg-border" />
          </div>
        )}

        <Link
          href="/admin/help"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
            activeItem === "help" && "bg-black text-white"
          )}
          onClick={() => handleItemClick("help")}
        >
          <HelpCircle className="h-5 w-5" />
          {open && <span>Help & Support</span>}
        </Link>

        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left",
            activeItem === "logout" && "bg-black text-white"
          )}
          onMouseDown={() => handleItemClick("logout")}
        >
          <LogOut className="h-5 w-5" />
          {open && <span>Logout</span>}
        </button>
      </nav>
    </div>
  );
}