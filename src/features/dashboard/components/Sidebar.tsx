"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOut } from "@/features/auth/utils";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LineChart,
  KeyIcon,
  Bot,
  CreditCard,
  LifeBuoy,
  LogOut,
  Shield,
  Users,
  FileCode,
  Copy,
  Code,
  PanelLeft,
  Binary,
  Globe,
  DollarSign
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  // Context and hooks
  const { open, isMobile, openMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  
  // Local state
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>("tradingview");

  // Set active item based on current pathname
  useEffect(() => {
    if (pathname === "/dashboard") {
      setActiveItem("dashboard");
      setOpenSection(null); 
    } else if (pathname === "/dashboard/webhook") {
      setActiveItem("webhook");
      setOpenSection("tradingview");
    } else if (pathname.includes("/dashboard/pricing")) {
      setActiveItem("pricing");
      setOpenSection(null);
    } else if (pathname.includes("/dashboard/support")) {
      setActiveItem("support");
      setOpenSection(null);
    } else if (pathname.includes("/dashboard/broker-management")) {
      setActiveItem("broker-management");
      setOpenSection(null);
    } else if (pathname.includes("/dashboard/api-credentials")) {
      setActiveItem("api-credentials");
      setOpenSection(null);
    } else if (pathname.includes("/dashboard/symbol-json")) {
      setActiveItem("symbol-json");
      setOpenSection("tradingview");
    } else if (pathname.includes("/dashboard/trade-logs")) {
      setActiveItem("trade-logs");
      setOpenSection("tradingview");
    } else if (pathname.includes("/dashboard/scalping-tool")) {
      setActiveItem("scalping-tool");
      setOpenSection("scalping-tool");
    } else if (pathname.includes("/dashboard/copy-trading")) {
      setActiveItem("copy-trading");
      setOpenSection("copy-trading");
    } else if (pathname.includes("/dashboard/strategy")) {
      setActiveItem("strategy");
      setOpenSection("strategy");
    } else if (pathname.includes("/dashboard/bots")) {
      setActiveItem("bots");
      setOpenSection("bots");
    } else {
      // For other routes, check if they match any known section
      const pathSegments = pathname.split("/");
      if (pathSegments.length > 2) {
        const section = pathSegments[2];
        if (["brokerauth", "tradingview", "pricing", "support", "help"].includes(section)) {
          setActiveItem(section);
          if (section === "tradingview") {
            setOpenSection("tradingview");
          }
        } else {
          // Don't automatically open any section for unknown routes
          setOpenSection(null);
        }
      } else {
        // Default - don't open any section
        setOpenSection(null);
      }
    }
  }, [pathname]);

  // Handle navigation
  const handleNavigation = (e: React.MouseEvent, path: string, itemName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setActiveItem(itemName);
    
    if (isMobile) {
      setOpenMobile(false);
    }
    
    router.push(path);
  };

  // Handle section toggle
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Handle logout
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await signOut();
  };

  // NavItem component for consistent styling
  const NavItem = ({ 
    icon: Icon, 
    label, 
    path, 
    itemName,
    isActive,
    hasChildren = false,
    isOpen = false,
    onClick 
  }: { 
    icon: React.ElementType; 
    label: string; 
    path: string; 
    itemName: string;
    isActive: boolean;
    hasChildren?: boolean;
    isOpen?: boolean;
    onClick?: (e: React.MouseEvent) => void;
  }) => (
    <a
      href={path}
      className={cn(
        "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-accent text-foreground hover:text-foreground",
        !open && "justify-center"
      )}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        } else {
          handleNavigation(e, path, itemName);
        }
      }}
    >
      <Icon className="h-5 w-5 min-w-5" />
      {open && (
        <div className="flex justify-between items-center w-full">
          <span className="ml-3 font-medium">{label}</span>
          {hasChildren && (
            isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </div>
      )}
    </a>
  );

  return (
    <div
      className={cn(
        "bg-card border-r border-border h-full transition-all duration-300 flex flex-col overflow-hidden",
        open ? "w-60" : "w-[64px]",
        isMobile && "w-full",
        className
      )}
      data-state={open ? "open" : "closed"}
    >
      {/* Sidebar header - removed toggle button */}
      {open && !isMobile && (
        <div className="border-b border-border p-4">
          <h2 className="font-semibold text-lg">Navigation</h2>
        </div>
      )}
      
      {/* Scrollable navigation */}
      <ScrollArea className="flex-1">
        <div className="px-3 py-4 space-y-6">
          {/* Main navigation */}
          <div className="space-y-1">
            <NavItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              path="/dashboard" 
              itemName="dashboard"
              isActive={activeItem === "dashboard"}
            />
          </div>

          {/* Features section */}
          <div className="space-y-1">
            {open && (
              <div className="px-3 mb-2">
                <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                  Features
                </p>
              </div>
            )}
            <Separator className={open ? "mb-2" : "hidden"} />
            
            <NavItem 
              icon={KeyIcon} 
              label="API Credentials" 
              path="/dashboard/broker-management" 
              itemName="broker-management"
              isActive={activeItem === "broker-management"}
            />
            
            {/* TradingView Section with children */}
            <div>
              <NavItem 
                icon={LineChart} 
                label="TradingView" 
                path="#" 
                itemName="tradingview"
                isActive={openSection === "tradingview"}
                hasChildren={true}
                isOpen={openSection === "tradingview"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSection("tradingview");
                }}
              />
              
              {/* Submenu for TradingView */}
              {open && openSection === "tradingview" && (
                <div className="ml-7 mt-1 space-y-1 border-l border-border pl-2">
                  <a 
                    href="/dashboard/webhook" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      activeItem === "webhook" ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    onClick={(e) => handleNavigation(e, "/dashboard/webhook", "webhook")}
                  >
                    Webhook
                  </a>
                  <a 
                    href="/dashboard/symbol-json" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      activeItem === "symbol-json" ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    onClick={(e) => handleNavigation(e, "/dashboard/symbol-json", "symbol-json")}
                  >
                    Symbol JSON
                  </a>
                  <a 
                    href="/dashboard/trade-logs" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      activeItem === "trade-logs" ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    onClick={(e) => handleNavigation(e, "/dashboard/trade-logs", "trade-logs")}
                  >
                    Trade Logs
                  </a>
                </div>
              )}
            </div>
            
            {/* Scalping Tool Section */}
            <div>
              <NavItem 
                icon={PanelLeft} 
                label="Scalping Tool" 
                path="#" 
                itemName="scalping-tool"
                isActive={openSection === "scalping-tool"}
                hasChildren={true}
                isOpen={openSection === "scalping-tool"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSection("scalping-tool");
                }}
              />
              
              {/* Submenu for Scalping Tool */}
              {open && openSection === "scalping-tool" && (
                <div className="ml-7 mt-1 space-y-1 border-l border-border pl-2">
                  <a 
                    href="/dashboard/trade-panel" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      activeItem === "trade-panel" ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    onClick={(e) => handleNavigation(e, "/dashboard/trade-panel", "trade-panel")}
                  >
                    Trade Panel
                  </a>
                </div>
              )}
            </div>
            
            {/* Copy Trading Section */}
            <div>
              <NavItem 
                icon={Copy} 
                label="Copy Trading" 
                path="#" 
                itemName="copy-trading"
                isActive={openSection === "copy-trading"}
                hasChildren={true}
                isOpen={openSection === "copy-trading"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSection("copy-trading");
                }}
              />
              
              {/* Submenu for Copy Trading */}
              {open && openSection === "copy-trading" && (
                <div className="ml-7 mt-1 space-y-1 border-l border-border pl-2">
                  <a 
                    href="/dashboard/copy-strategy" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      activeItem === "copy-strategy" ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    onClick={(e) => handleNavigation(e, "/dashboard/copy-strategy", "copy-strategy")}
                  >
                    Strategy
                  </a>
                </div>
              )}
            </div>
            
            {/* Strategy Section */}
            <div>
              <NavItem 
                icon={Code} 
                label="Strategy" 
                path="#" 
                itemName="strategy"
                isActive={openSection === "strategy"}
                hasChildren={true}
                isOpen={openSection === "strategy"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSection("strategy");
                }}
              />
              
              {/* Submenu for Strategy */}
              {open && openSection === "strategy" && (
                <div className="ml-7 mt-1 space-y-1 border-l border-border pl-2">
                  <a 
                    href="/dashboard/pine-script" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      activeItem === "pine-script" ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    onClick={(e) => handleNavigation(e, "/dashboard/pine-script", "pine-script")}
                  >
                    Pine Script
                  </a>
                  <a 
                    href="/dashboard/mql" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      activeItem === "mql" ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    onClick={(e) => handleNavigation(e, "/dashboard/mql", "mql")}
                  >
                    MQL
                  </a>
                  <a 
                    href="/dashboard/afl" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      activeItem === "afl" ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    onClick={(e) => handleNavigation(e, "/dashboard/afl", "afl")}
                  >
                    AFL
                  </a>
                </div>
              )}
            </div>
            
            {/* Bots Section */}
            <div>
              <NavItem 
                icon={Bot} 
                label="Bots" 
                path="#" 
                itemName="bots"
                isActive={openSection === "bots"}
                hasChildren={true}
                isOpen={openSection === "bots"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSection("bots");
                }}
              />
              
              {/* Submenu for Bots */}
              {open && openSection === "bots" && (
                <div className="ml-7 mt-1 space-y-1 border-l border-border pl-2">
                  <a 
                    href="/dashboard/bots/nse-bse" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      activeItem === "nse-bse" ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    onClick={(e) => handleNavigation(e, "/dashboard/bots/nse-bse", "nse-bse")}
                  >
                    NSE/BSE
                  </a>
                  <a 
                    href="/dashboard/bots/forex" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      activeItem === "forex" ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    onClick={(e) => handleNavigation(e, "/dashboard/bots/forex", "forex")}
                  >
                    Forex
                  </a>
                  <a 
                    href="/dashboard/bots/crypto" 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                      activeItem === "crypto" ? "bg-accent/80 text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                    onClick={(e) => handleNavigation(e, "/dashboard/bots/crypto", "crypto")}
                  >
                    Crypto
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {/* Tools section */}
          <div className="space-y-1">
            {open && (
              <div className="px-3 mb-2">
                <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                  Tools
                </p>
              </div>
            )}
            <Separator className={open ? "mb-2" : "hidden"} />
            
            <NavItem 
              icon={CreditCard} 
              label="Pricing" 
              path="/dashboard/pricing" 
              itemName="pricing"
              isActive={activeItem === "pricing"}
            />
          </div>
          
          {/* Support section */}
          <div className="space-y-1">
            {open && (
              <div className="px-3 mb-2">
                <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                  Support
                </p>
              </div>
            )}
            <Separator className={open ? "mb-2" : "hidden"} />
            
            <NavItem 
              icon={LifeBuoy} 
              label="Help & Support" 
              path="/dashboard/support" 
              itemName="support"
              isActive={activeItem === "support"}
            />
            
            <NavItem 
              icon={Shield} 
              label="Security" 
              path="/dashboard/security" 
              itemName="security"
              isActive={activeItem === "security"}
            />
            
            <NavItem 
              icon={Users} 
              label="Community" 
              path="/dashboard/community" 
              itemName="community"
              isActive={activeItem === "community"}
            />
          </div>
        </div>
      </ScrollArea>
      
      {/* Footer with logout button */}
      <div className="border-t border-border p-3 mt-auto">
        <a
          href="#"
          className={cn(
            "flex items-center px-3 py-2 rounded-md hover:bg-accent transition-colors text-red-600",
            !open && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 min-w-5" />
          {open && <span className="ml-3 text-sm font-medium">Logout</span>}
        </a>
      </div>
    </div>
  );
}
