"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/features/auth/utils";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LineChart,
  KeyIcon,
  Bot,
  CreditCard,
  LogOut,
  Shield,
  Users,
  Copy,
  Code,
  PanelLeft,
  ChevronLeft,
  Menu,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  // Context and hooks - correctly access sidebar context
  const { open, setOpen, toggleSidebar, openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  
  // Local state
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Set active item based on current pathname
  useEffect(() => {
    if (pathname === "/dashboard") {
      setActiveItem("dashboard");
      setOpenSection(null); 
    } else if (pathname === "/dashboard/webhook") {
      setActiveItem("webhook");
      setOpenSection("webhook");
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
      setOpenSection("symbol-json");
    } else if (pathname.includes("/dashboard/trade-logs")) {
      setActiveItem("trade-logs");
      setOpenSection("trade-logs");
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
        if (["brokerauth", "webhook", "pricing", "support", "help"].includes(section)) {
          setActiveItem(section);
          if (section === "webhook") {
            setOpenSection("webhook");
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

  // Function to handle logout
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut();
    router.push("/auth/signin");
  };

  // Function to toggle sections in the sidebar
  const toggleSection = (sectionName: string) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
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
    icon: React.ElementType | null; 
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
          ? "bg-accent/80 text-accent-foreground font-medium" 
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
        !open && !isMobile && "justify-center",
        "relative"
      )}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        } else if (path !== "#") {
          e.preventDefault();
          setActiveItem(itemName);
          router.push(path);
          
          // Always close mobile sidebar when navigating
          if (isMobile) {
            setOpenMobile(false);
          }
        }
      }}
    >
      {Icon && <Icon className="h-5 w-5 min-w-5" />}
      {(open || isMobile) && (
        <div className="flex justify-between items-center w-full">
          <span className={cn("ml-3 font-medium", !Icon && "ml-0")}>{label}</span>
          {hasChildren && (
            isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </div>
      )}
    </a>
  );

  return (
    <>
      {/* Floating Mobile Toggle Button (only visible when sidebar is closed on mobile) */}
      {isMobile && !openMobile && (
        <button
          onClick={() => setOpenMobile(true)}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg"
          aria-label="Open Sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Mobile overlay backdrop - for closing when clicking outside sidebar */}
      {isMobile && openMobile && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setOpenMobile(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <div
        className={cn(
          "group flex h-full flex-col overflow-y-auto border-r bg-background py-4 text-foreground",
          // Mobile specific classes
          isMobile && (openMobile 
            ? "fixed inset-y-0 left-0 z-50 w-[280px] animate-in slide-in-from-left" 
            : "hidden"),
          // Desktop specific classes
          !isMobile && (open ? "w-[280px]" : "w-[70px]"),
          className
        )}
      >
        {/* Scrollable navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-2">
            {/* Dashboard section */}
            <div className="pb-4">
              <NavItem 
                icon={LayoutDashboard} 
                label="Dashboard" 
                path="/dashboard" 
                itemName="dashboard"
                isActive={activeItem === "dashboard"}
              />
            </div>

            {/* FEATURES section */}
            <div className="pt-6">
              {open && (
                <div className="px-3 mb-2">
                  <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                    Features
                  </p>
                </div>
              )}
              {open && <Separator className="mb-2" />}
              <div className="space-y-1">
                <NavItem 
                  icon={KeyIcon} 
                  label="API Credentials" 
                  path="/dashboard/api-credentials" 
                  itemName="api-credentials"
                  isActive={activeItem === "api-credentials"}
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
                      <NavItem 
                        icon={() => null}
                        label="Webhook" 
                        path="/dashboard/webhook" 
                        itemName="webhook"
                        isActive={activeItem === "webhook"}
                      />
                      <NavItem 
                        icon={() => null}
                        label="Symbol JSON" 
                        path="/dashboard/symbol-json" 
                        itemName="symbol-json"
                        isActive={activeItem === "symbol-json"}
                      />
                      <NavItem 
                        icon={() => null}
                        label="Trade Logs" 
                        path="/dashboard/trade-logs" 
                        itemName="trade-logs"
                        isActive={activeItem === "trade-logs"}
                      />
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
                      <NavItem 
                        icon={PanelLeft} 
                        label="Trade Panel" 
                        path="/dashboard/trade-panel" 
                        itemName="trade-panel"
                        isActive={activeItem === "trade-panel"}
                      />
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
                      <NavItem 
                        icon={null}
                        label="Strategy" 
                        path="/dashboard/copy-strategy" 
                        itemName="copy-strategy"
                        isActive={activeItem === "copy-strategy"}
                      />
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
                      <NavItem 
                        icon={null}
                        label="Pine Script" 
                        path="/dashboard/pine-script" 
                        itemName="pine-script"
                        isActive={activeItem === "pine-script"}
                      />
                      <NavItem 
                        icon={null}
                        label="MQL" 
                        path="/dashboard/mql" 
                        itemName="mql"
                        isActive={activeItem === "mql"}
                      />
                      <NavItem 
                        icon={null}
                        label="AFL" 
                        path="/dashboard/afl" 
                        itemName="afl"
                        isActive={activeItem === "afl"}
                      />
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
                      <NavItem 
                        icon={null}
                        label="NSE/BSE" 
                        path="/dashboard/bots/nse-bse" 
                        itemName="nse-bse"
                        isActive={activeItem === "nse-bse"}
                      />
                      <NavItem 
                        icon={null}
                        label="Forex" 
                        path="/dashboard/bots/forex" 
                        itemName="forex"
                        isActive={activeItem === "forex"}
                      />
                      <NavItem 
                        icon={null}
                        label="Crypto" 
                        path="/dashboard/bots/crypto" 
                        itemName="crypto"
                        isActive={activeItem === "crypto"}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* TOOLS section */}
            <div className="pt-6">
              {open && (
                <div className="px-3 mb-2">
                  <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                    Tools
                  </p>
                </div>
              )}
              {open && <Separator className="mb-2" />}
              <div className="space-y-1">
                <NavItem 
                  icon={CreditCard} 
                  label="Pricing" 
                  path="/dashboard/pricing" 
                  itemName="pricing"
                  isActive={activeItem === "pricing"}
                />
              </div>
            </div>
            
            {/* SUPPORT section */}
            <div className="pt-6">
              {open && (
                <div className="px-3 mb-2">
                  <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                    Support
                  </p>
                </div>
              )}
              {open && <Separator className="mb-2" />}
              <div className="space-y-1">
                <NavItem 
                  icon={HelpCircle} 
                  label="Help & Support" 
                  path="/dashboard/help-support" 
                  itemName="help-support"
                  isActive={activeItem === "help-support"}
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
          </nav>
        </div>
        
        {/* Footer with logout button */}
        <div className="border-t border-border p-3 mt-auto">
          <button
            className={cn(
              "flex w-full items-center px-3 py-2 rounded-md hover:bg-accent transition-colors text-red-600",
              !open && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 min-w-5" />
            {open && <span className="ml-3 text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
