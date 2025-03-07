"use client";
import React from "react";
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
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { open, toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar();
  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedBroker, setSelectedBroker] = React.useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isApiCredentialsOpen, setIsApiCredentialsOpen] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [server, setServer] = React.useState("");
  const { logout } = useAuth(); // Get logout function from AuthContext

  // Set active item based on current pathname
  React.useEffect(() => {
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

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
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
      <div className="flex justify-between items-center p-4">
        {open && <span className="font-bold">Menu</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleSidebar()}
          className="h-8 w-8 rounded-full"
        >
          {open ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      <nav className="sticky p-4 space-y-2">
        {/* <a
          href="#"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Home className="h-5 w-5" />
          {open && <span>Home</span>}
        </a> */}

        <a
          href="/dashboard"
          className={cn(
            "flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors",
            activeItem === "dashboard" && "bg-black text-white"
          )}
          onClick={() => handleItemClick("dashboard")}
        >
          <LayoutDashboard className="h-5 w-5 min-w-5" />
          {open && <span className="ml-3 text-sm md:text-base">Dashboard</span>}
        </a>

        {open && (
          <div className="py-2">
            <div className="h-[1px] bg-border" />
          </div>
        )}

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="brokerauth" className="border-none">
            <AccordionTrigger
              className={cn(
                "flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                activeItem === "brokerauth" && "bg-black text-white",
                !open && "justify-center",
                open && "space-x-3"
              )}
              onClick={() => handleItemClick("brokerauth")}
            >
              <div className={cn("flex items-center", open ? "space-x-3" : "justify-center w-full")}>
                <KeyIcon className="h-5 w-5 min-w-5" />
                {open && <span className="text-sm md:text-base">Broker Auth</span>}
              </div>
            </AccordionTrigger>
            {open && (
              <AccordionContent>
                <div className="pl-11 space-y-4">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {selectedBroker && (
                    <Button 
                      className="w-full bg-black text-white hover:bg-accent hover:text-primary transition-colors" 
                      onClick={() => setIsApiCredentialsOpen(true)}
                    >
                      {selectedBroker}
                    </Button>
                  )}
                  <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                    {["Angel One", "Dhan", "Flattrade", "Zerodha", "Fyers", "Finvisia", "Forex", "Delta Exchange", "Kotak", "Upstox", "Metatrader 4", "Metatrader 5"].sort()
                      .filter((broker) =>
                        broker.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((broker) => (
                        <button
                          key={broker}
                          className={cn(
                            "block py-2 px-2 hover:bg-accent hover:text-primary transition-colors w-full text-left rounded-md",
                            selectedBroker === broker && "bg-accent/50 text-primary font-medium"
                          )}
                          onClick={() => setSelectedBroker(broker)}
                        >
                          {broker}
                        </button>
                      ))}
                  </div>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="tradingview" className="border-none">
            <AccordionTrigger
              className={cn(
                "flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                activeItem === "tradingview" && "bg-black text-white",
                !open && "justify-center",
                open && "space-x-3"
              )}
              onClick={() => handleItemClick("tradingview")}
            >
              <div className={cn("flex items-center", open ? "space-x-3" : "justify-center w-full")}>
                <LineChart className="h-5 w-5 min-w-5" />
                {open && <span className="text-sm md:text-base">TradingView</span>}
              </div>
            </AccordionTrigger>
            {open && (
              <AccordionContent>
                <div className="pl-11 space-y-2">

                  <a
                    href="/dashboard/webhook"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Webhook URL
                  </a>
                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Symbol
                  </a>
                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    JSON
                  </a>
                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Trade Logs
                  </a>
                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Manage
                  </a>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>

          <AccordionItem value="scalping" className="border-none">
            <AccordionTrigger
              className={cn(
                "flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                activeItem === "scalping" && "bg-black text-white",
                !open && "justify-center",
                open && "space-x-3"
              )}
              onClick={() => handleItemClick("scalping")}
            >
              <div className={cn("flex items-center", open ? "space-x-3" : "justify-center w-full")}>
                <Zap className="h-5 w-5 min-w-5" />
                {open && <span className="text-sm md:text-base">Scalping Tool</span>}
              </div>
            </AccordionTrigger>
            {open && (
              <AccordionContent>
                <div className="pl-11 space-y-2">

                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Trade Panel
                  </a>
                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Manage
                  </a>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>

          <AccordionItem value="copytrading" className="border-none">
            <AccordionTrigger
              className={cn(
                "flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                activeItem === "copytrading" && "bg-black text-white",
                !open && "justify-center",
                open && "space-x-3"
              )}
              onClick={() => handleItemClick("copytrading")}
            >
              <div className={cn("flex items-center", open ? "space-x-3" : "justify-center w-full")}>
                <Copy className="h-5 w-5 min-w-5" />
                {open && <span className="text-sm md:text-base">Copy Trading</span>}
              </div>
            </AccordionTrigger>
            {open && (
              <AccordionContent>
                <div className="pl-11 space-y-2">

                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Strategy
                  </a>
                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Manage
                  </a>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>

          <AccordionItem value="strategy" className="border-none">
            <AccordionTrigger
              className={cn(
                "flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                activeItem === "strategy" && "bg-black text-white",
                !open && "justify-center",
                open && "space-x-3"
              )}
              onClick={() => handleItemClick("strategy")}
            >
              <div className={cn("flex items-center", open ? "space-x-3" : "justify-center w-full")}>
                <LineChart className="h-5 w-5 min-w-5" />
                {open && <span className="text-sm md:text-base">Strategy</span>}
              </div>
            </AccordionTrigger>
            {open && (
              <AccordionContent>
                <div className="pl-11 space-y-2">
                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Pine Script
                  </a>
                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    MQL
                  </a>
                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    AFL
                  </a>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="bots" className="border-none">
            <AccordionTrigger
              className={cn(
                "flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                activeItem === "bots" && "bg-black text-white",
                !open && "justify-center",
                open && "space-x-3"
              )}
              onClick={() => handleItemClick("bots")}
            >
              <div className={cn("flex items-center", open ? "space-x-3" : "justify-center w-full")}>
                <Bot className="h-5 w-5 min-w-5" />
                {open && <span className="text-sm md:text-base">Bots</span>}
              </div>
            </AccordionTrigger>
            {open && (
              <AccordionContent>
                <div className="pl-11 space-y-2">
                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    NSE/BSE
                  </a>
                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Forex
                  </a>
                  <a
                    href="#"
                    className="block py-2 hover:text-primary transition-colors"
                  >
                    Crypto
                  </a>
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        </Accordion>

        <a
          href="/dashboard/pricing"
          className={cn(
            "flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors",
            activeItem === "pricing" && "bg-black text-white",
            !open && "justify-center",
            open && "space-x-3"
          )}
          onClick={() => handleItemClick("pricing")}
        >
          <div className={cn("flex items-center", open ? "space-x-3" : "justify-center w-full")}>
            <CreditCard className="h-5 w-5 min-w-5" />
            {open && <span className="ml-3 text-sm md:text-base">Pricing</span>}
          </div>
        </a>

        {open && (
          <div className="py-2">
            <div className="h-[1px] bg-border" />
          </div>
        )}

        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="contact" className="border-none">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors cursor-pointer",
                activeItem === "contact" && "bg-black text-white",
                !open && "justify-center",
                open && "space-x-3"
              )}
              onClick={() => handleItemClick("contact")}
            >
              <div className={cn("flex items-center", open ? "space-x-3" : "justify-center w-full")}>
                <HeadphonesIcon className="h-5 w-5 min-w-5" />
                {open && <span className="ml-3 text-sm md:text-base">Contact Us</span>}
              </div>
            </div>
          </AccordionItem>

          <AccordionItem value="faq" className="border-none">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors cursor-pointer",
                activeItem === "faq" && "bg-black text-white",
                !open && "justify-center",
                open && "space-x-3"
              )}
              onClick={() => handleItemClick("faq")}
            >
              <div className={cn("flex items-center", open ? "space-x-3" : "justify-center w-full")}>
                <HelpCircle className="h-5 w-5 min-w-5" />
                {open && <span className="ml-3 text-sm md:text-base">FAQ</span>}
              </div>
            </div>
          </AccordionItem>

          <AccordionItem value="logout" className="border-none">
            <div
              className={cn(
                "flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors cursor-pointer",
                activeItem === "logout" && "bg-black text-white",
                !open && "justify-center",
                open && "space-x-3"
              )}
              onClick={() => {
                // Logout function is already available from the useAuth hook at component level
                logout().then(() => {
                  // Redirect will be handled in the logout function
                  toast.success("Logged out successfully");
                });
              }}
            >
              <div className={cn("flex items-center", open ? "space-x-3" : "justify-center w-full")}>
                <KeyIcon className="h-5 w-5 min-w-5" />
                {open && <span className="ml-3 text-sm md:text-base">Logout</span>}
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </nav>
      <Sheet open={isApiCredentialsOpen} onOpenChange={setIsApiCredentialsOpen}>
        <SheetContent className={cn("sm:max-w-md", open ? "w-[17.6rem]" : "w-[5.975rem]")}>
          <SheetHeader>
            <SheetTitle>
              API Credentials{selectedBroker ? `: ${selectedBroker}` : ""}
            </SheetTitle>
          </SheetHeader>
          <SheetDescription>
            {/* Add your API credentials form or content here */}
            {selectedBroker === "Metatrader 4" || selectedBroker === "Metatrader 5" ? (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="userId" className="text-right inline-block">
                    User ID
                  </label>
                  <Input
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="server" className="text-right inline-block">
                    Server
                  </label>
                  <Input
                    id="server"
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                  />
                </div>
                <Button>Save</Button>
              </div>
            ) : null}
          </SheetDescription>
        </SheetContent>
      </Sheet>
    </div>
  );
}
