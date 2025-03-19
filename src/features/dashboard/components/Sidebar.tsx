"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Home,
  LayoutDashboard,
  LineChart,
  Zap,
  Copy,
  HeadphonesIcon,
  HelpCircle,
  CreditCard,
  ChevronLeft,
  Menu,
  KeyIcon,
  Bot,
  LogOut,
  Shield,
  ChevronDown
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
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useRouter, usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { signOut } from "@/features/auth/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  // Context and hooks
  const { open, toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  
  // Local state
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [isApiCredentialsOpen, setIsApiCredentialsOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [server, setServer] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Set active item based on current pathname
  useEffect(() => {
    if (pathname === "/dashboard") {
      setActiveItem("dashboard");
    } else if (pathname === "/dashboard/webhook") {
      setActiveItem("tradingview");
    } else if (pathname.includes("/dashboard/pricing")) {
      setActiveItem("pricing");
    } else if (pathname.includes("/dashboard/support")) {
      setActiveItem("support");
    } else {
      // For other routes, check if they match any known section
      const pathSegments = pathname.split("/");
      if (pathSegments.length > 2) {
        const section = pathSegments[2];
        if (["brokerauth", "tradingview", "pricing", "support", "help"].includes(section)) {
          setActiveItem(section);
        }
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

  // Handle logout
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await signOut();
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  // Handle input blur
  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  // Custom AccordionTrigger to show the chevron on the right
  const CustomAccordionTrigger = ({ className, children, ...props }: any) => (
    <AccordionTrigger {...props} className={className}>
      <div className="flex items-center justify-between w-full">
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </div>
    </AccordionTrigger>
  );

  return (
    <div
      className={cn(
        "bg-card border-r border-border h-full transition-all duration-300 flex flex-col",
        open ? "w-64" : "w-[70px] min-w-[70px]",
        isMobile && "w-full",
        className
      )}
    >
      {/* Scrollable navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <a
          href="/dashboard"
          className={cn(
            "flex items-center px-3 py-2 rounded-md hover:bg-accent transition-colors",
            activeItem === "dashboard" ? "bg-black text-white" : ""
          )}
          onClick={(e) => handleNavigation(e, "/dashboard", "dashboard")}
        >
          <LayoutDashboard className="h-5 w-5 min-w-5" />
          {open && <span className="ml-3 text-sm font-medium">Dashboard</span>}
        </a>

        {open && (
          <div className="py-2">
            <div className="h-[1px] bg-border" />
          </div>
        )}

        {/* FEATURES SECTION */}
        <div className="mb-4">
          {open && <p className="text-xs text-muted-foreground mb-2 px-3">FEATURES</p>}
          
          <a
            href="/dashboard/broker-management"
            className={cn(
              "flex items-center px-3 py-2 rounded-md hover:bg-accent transition-colors",
              activeItem === "broker-management" ? "bg-black text-white" : "",
              !open && "justify-center",
              open && "justify-between"
            )}
            onClick={(e) => handleNavigation(e, "/dashboard/broker-management", "broker-management")}
          >
            <div className="flex items-center space-x-3">
              <KeyIcon className="h-5 w-5 min-w-5" />
              {open && <span className="text-sm font-medium">Api Credentials</span>}
            </div>
          </a>

          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="tradingview" className="border-none">
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors",
                  activeItem === "tradingview" ? "bg-black text-white" : ""
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveItem(activeItem === "tradingview" ? null : "tradingview");
                }}
              >
                <div className="flex items-center space-x-3">
                  <LineChart className="h-5 w-5 min-w-5" />
                  {open && <span className="text-sm font-medium">TradingView</span>}
                </div>
                {open && (
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      activeItem === "tradingview" ? "text-white" : ""
                    )}
                    data-state={activeItem === "tradingview" ? "open" : "closed"}
                    style={{
                      transform: activeItem === "tradingview" ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                  />
                )}
              </div>
              {open && activeItem === "tradingview" && (
                <div className="mt-1 space-y-1">
                  <a
                    href="/dashboard/webhook"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => handleNavigation(e, "/dashboard/webhook", "tradingview")}
                  >
                    Webhook URL
                  </a>
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Symbol
                  </a>
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    JSON
                  </a>
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Trade Logs
                  </a>
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Manage
                  </a>
                </div>
              )}
            </AccordionItem>

            <AccordionItem value="scalping" className="border-none">
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors",
                  activeItem === "scalping" ? "bg-black text-white" : ""
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveItem(activeItem === "scalping" ? null : "scalping");
                }}
              >
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 min-w-5" />
                  {open && <span className="text-sm font-medium">Scalping Tool</span>}
                </div>
                {open && (
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      activeItem === "scalping" ? "text-white" : ""
                    )}
                    data-state={activeItem === "scalping" ? "open" : "closed"}
                    style={{
                      transform: activeItem === "scalping" ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                  />
                )}
              </div>
              {open && activeItem === "scalping" && (
                <div className="mt-1 space-y-1">
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Trade Panel
                  </a>
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Manage
                  </a>
                </div>
              )}
            </AccordionItem>

            <AccordionItem value="copytrading" className="border-none">
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors",
                  activeItem === "copytrading" ? "bg-black text-white" : ""
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveItem(activeItem === "copytrading" ? null : "copytrading");
                }}
              >
                <div className="flex items-center space-x-3">
                  <Copy className="h-5 w-5 min-w-5" />
                  {open && <span className="text-sm font-medium">Copy Trading</span>}
                </div>
                {open && (
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      activeItem === "copytrading" ? "text-white" : ""
                    )}
                    data-state={activeItem === "copytrading" ? "open" : "closed"}
                    style={{
                      transform: activeItem === "copytrading" ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                  />
                )}
              </div>
              {open && activeItem === "copytrading" && (
                <div className="mt-1 space-y-1">
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Strategy
                  </a>
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Manage
                  </a>
                </div>
              )}
            </AccordionItem>

            <AccordionItem value="strategy" className="border-none">
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors",
                  activeItem === "strategy" ? "bg-black text-white" : ""
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveItem(activeItem === "strategy" ? null : "strategy");
                }}
              >
                <div className="flex items-center space-x-3">
                  <LineChart className="h-5 w-5 min-w-5" />
                  {open && <span className="text-sm font-medium">Strategy</span>}
                </div>
                {open && (
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      activeItem === "strategy" ? "text-white" : ""
                    )}
                    data-state={activeItem === "strategy" ? "open" : "closed"}
                    style={{
                      transform: activeItem === "strategy" ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                  />
                )}
              </div>
              {open && activeItem === "strategy" && (
                <div className="mt-1 space-y-1">
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Pine Script
                  </a>
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    MQL
                  </a>
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    AFL
                  </a>
                </div>
              )}
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="bots" className="border-none">
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent transition-colors",
                  activeItem === "bots" ? "bg-black text-white" : ""
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveItem(activeItem === "bots" ? null : "bots");
                }}
              >
                <div className="flex items-center space-x-3">
                  <Bot className="h-5 w-5 min-w-5" />
                  {open && <span className="text-sm font-medium">Bots</span>}
                </div>
                {open && (
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      activeItem === "bots" ? "text-white" : ""
                    )}
                    data-state={activeItem === "bots" ? "open" : "closed"}
                    style={{
                      transform: activeItem === "bots" ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                  />
                )}
              </div>
              {open && activeItem === "bots" && (
                <div className="mt-1 space-y-1">
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    NSE/BSE
                  </a>
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Forex
                  </a>
                  <a
                    href="#"
                    className="block pl-11 py-1.5 text-sm hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Crypto
                  </a>
                </div>
              )}
            </AccordionItem>
          </Accordion>

          <a
            href="/dashboard/pricing"
            className={cn(
              "flex items-center px-3 py-2 rounded-md hover:bg-accent transition-colors",
              activeItem === "pricing" ? "bg-black text-white" : "",
              !open && "justify-center",
              open && "justify-between"
            )}
            onClick={(e) => handleNavigation(e, "/dashboard/pricing", "pricing")}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 min-w-5" />
              {open && <span className="text-sm font-medium">Pricing</span>}
            </div>
          </a>
        </div>

        {open && (
          <div className="py-2">
            <div className="h-[1px] bg-border" />
          </div>
        )}

        {/* SUPPORT SECTION */}
        <div className="mb-4">
          {open && <p className="text-xs text-muted-foreground mb-2 px-3">SUPPORT</p>}
          
          <a
            href="#"
            className={cn(
              "flex items-center px-3 py-2 rounded-md hover:bg-accent transition-colors",
              activeItem === "contact" ? "bg-black text-white" : "",
              !open && "justify-center",
              open && "justify-between"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setActiveItem("contact");
            }}
          >
            <div className="flex items-center space-x-3">
              <HeadphonesIcon className="h-5 w-5 min-w-5" />
              {open && <span className="text-sm font-medium">Contact Us</span>}
            </div>
          </a>

          <a
            href="#"
            className={cn(
              "flex items-center px-3 py-2 rounded-md hover:bg-accent transition-colors",
              activeItem === "faq" ? "bg-black text-white" : "",
              !open && "justify-center",
              open && "justify-between"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setActiveItem("faq");
            }}
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-5 w-5 min-w-5" />
              {open && <span className="text-sm font-medium">FAQ</span>}
            </div>
          </a>
        </div>

        {/* SECURITY SECTION */}
        <div className="mb-4">
          {open && <p className="text-xs text-muted-foreground mb-2 px-3">SECURITY</p>}
          
          <a
            href="/dashboard/security"
            className={cn(
              "flex items-center px-3 py-2 rounded-md hover:bg-accent transition-colors",
              activeItem === "security" ? "bg-black text-white" : "",
              !open && "justify-center",
              open && "justify-between"
            )}
            onClick={(e) => handleNavigation(e, "/dashboard/security", "security")}
          >
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 min-w-5" />
              {open && <span className="text-sm font-medium">Security</span>}
            </div>
          </a>
        </div>
      </nav>
      
      {/* Logout button at the bottom */}
      <div className="p-4 border-t border-border mt-auto">
        <a
          href="#"
          className={cn(
            "flex items-center px-3 py-2 rounded-md hover:bg-accent transition-colors",
            !open && "justify-center",
            open && "justify-between"
          )}
          onClick={handleLogout}
        >
          <div className="flex items-center space-x-3">
            <LogOut className="h-5 w-5 min-w-5" />
            {open && <span className="text-sm font-medium">Logout</span>}
          </div>
        </a>
      </div>
      
      {/* API Credentials Sheet */}
      <Sheet open={isApiCredentialsOpen} onOpenChange={setIsApiCredentialsOpen}>
        <SheetContent 
          className={cn("sm:max-w-md", open ? "w-[17.6rem]" : "w-[5.975rem]")}
          onClick={(e) => e.stopPropagation()}
        >
          <SheetHeader>
            <SheetTitle>
              API Credentials{selectedBroker ? `: ${selectedBroker}` : ""}
            </SheetTitle>
          </SheetHeader>
          <SheetDescription>
            {selectedBroker === "Metatrader 4" || selectedBroker === "Metatrader 5" ? (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="userId" className="text-right inline-block">
                    User ID
                  </label>
                  <Input
                    id="userId"
                    value={userId}
                    onChange={(e) => {
                      e.stopPropagation();
                      setUserId(e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="password" className="text-right inline-block">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      e.stopPropagation();
                      setPassword(e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="server" className="text-right inline-block">
                    Server
                  </label>
                  <Input
                    id="server"
                    value={server}
                    onChange={(e) => {
                      e.stopPropagation();
                      setServer(e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
                <Button onClick={(e) => e.stopPropagation()}>
                  Save
                </Button>
              </div>
            ) : null}
          </SheetDescription>
        </SheetContent>
      </Sheet>
    </div>
  );
}
