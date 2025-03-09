"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getConnectedBrokers, BrokerConnection } from "@/services/brokerService";
import { CheckCircle, Search, X, KeyIcon } from "lucide-react";
import Image from "next/image";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define broker data - include all brokers
const brokers = [
  {
    id: "spaisa",
    name: "SPAISA",
    logo: "/brokers/spaisa.png",
    description: "Connect your SPAISA account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "aliceblue",
    name: "ALICEBLUE",
    logo: "/brokers/aliceblue.png",
    description: "Connect your ALICEBLUE account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "alpaca",
    name: "ALPACA",
    logo: "/brokers/alpaca.png",
    description: "Connect your ALPACA account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "angelone",
    name: "ANGELONE",
    logo: "/brokers/angelone.png",
    description: "Connect your ANGELONE account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "clientId", label: "Client ID", type: "text" },
      { name: "clientPin", label: "Client PIN", type: "password" },
    ]
  },
  {
    id: "ats",
    name: "ATS",
    logo: "/brokers/ats.png",
    description: "Connect your ATS account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "binance",
    name: "BINANCE",
    logo: "/brokers/binance.png",
    description: "Connect your BINANCE account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "binancev2",
    name: "BINANCEV2",
    logo: "/brokers/binance.png",
    description: "Connect your BINANCEV2 account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "bitbns",
    name: "BITBNS",
    logo: "/brokers/bitbns.png",
    description: "Connect your BITBNS account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "bitmex",
    name: "BITMEX",
    logo: "/brokers/bitmex.png",
    description: "Connect your BITMEX account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "bybit",
    name: "BYBIT",
    logo: "/brokers/bybit.png",
    description: "Connect your BYBIT account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "coindcx",
    name: "COINDCX",
    logo: "/brokers/coindcx.png",
    description: "Connect your COINDCX account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "delta",
    name: "DELTA",
    logo: "/brokers/delta.png",
    description: "Connect your DELTA account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "dhanhq",
    name: "DHANHQ",
    logo: "/brokers/dhanhq.png",
    description: "Connect your DHANHQ account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "finvasia",
    name: "FINVASIA",
    logo: "/brokers/finvasia.png",
    description: "Connect your FINVASIA account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "vendorCode", label: "Vendor Code", type: "text" },
    ]
  },
  {
    id: "forex",
    name: "FOREX",
    logo: "/brokers/forex.png",
    description: "Connect your FOREX account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "ftx",
    name: "FTX",
    logo: "/brokers/ftx.png",
    description: "Connect your FTX account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "fyers",
    name: "FYERS",
    logo: "/brokers/fyers.png",
    description: "Connect your FYERS account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "iifl",
    name: "IIFL",
    logo: "/brokers/iifl.png",
    description: "Connect your IIFL account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "metatrader5",
    name: "METATRADER 5",
    logo: "/brokers/mt5.png",
    description: "Connect your MetaTrader 5 account to automate trading.",
    fields: [
      { name: "login", label: "Login", type: "text" },
      { name: "password", label: "Password", type: "password" },
      { name: "server", label: "Server", type: "text" },
    ]
  },
  {
    id: "metatrader4",
    name: "METATRADER 4",
    logo: "/brokers/mt4.png",
    description: "Connect your MetaTrader 4 account to automate trading.",
    fields: [
      { name: "login", label: "Login", type: "text" },
      { name: "password", label: "Password", type: "password" },
      { name: "server", label: "Server", type: "text" },
    ]
  },
  {
    id: "upstox",
    name: "UPSTOX",
    logo: "/brokers/upstox.png",
    description: "Connect your UPSTOX account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "zerodha",
    name: "ZERODHA",
    logo: "/brokers/zerodha.png",
    description: "Connect your ZERODHA account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  {
    id: "flattrade",
    name: "FLATTRADE",
    logo: "/brokers/flattrade.png",
    description: "Connect your FlatTrade account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "toTp", label: "TO TP", type: "password" },
      { name: "clientId", label: "Client ID", type: "text" },
    ]
  }
];

export default function BrokerAuthPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Get connected brokers
  const [connectedBrokers, setConnectedBrokers] = useState<string[]>([]);
  
  useEffect(() => {
    // Check localStorage for connected brokers
    const connected: string[] = [];
    brokers.forEach(broker => {
      if (localStorage.getItem(`broker_${broker.id}_authenticated`) === 'true') {
        connected.push(broker.id);
      }
    });
    setConnectedBrokers(connected);
  }, []);

  // Filter brokers based on search query
  const filteredBrokers = brokers.filter(broker => 
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle broker selection
  const handleBrokerSelect = (brokerId: string) => {
    const broker = brokers.find(b => b.id === brokerId);
    if (broker) {
      // Load saved credentials if they exist
      const savedCredentials = localStorage.getItem(`broker_${brokerId}_credentials`);
      if (savedCredentials) {
        setFormData(JSON.parse(savedCredentials));
      } else {
        setFormData({});
      }
      
      setSelectedBroker(broker);
      setIsSheetOpen(true);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsLoading(true);
      
      // Save credentials to localStorage
      localStorage.setItem(`broker_${selectedBroker.id}_credentials`, JSON.stringify(formData));
      localStorage.setItem(`broker_${selectedBroker.id}_authenticated`, 'true');
      
      // Add the broker to connected brokers
      setConnectedBrokers(prev => [...prev, selectedBroker.id]);
      
      // Close the sheet
      setTimeout(() => {
        setIsSheetOpen(false);
        setSelectedBroker(null);
      }, 1000);
      
    } catch (error) {
      console.error("Error connecting broker:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get broker initial
  const getBrokerInitial = (name: string) => {
    return name.charAt(0);
  };

  const BrokerContent = () => (
    <div className="p-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">API Credentials</h1>
          <p className="text-muted-foreground mt-1">
            Connect your broker accounts to enable automated trading
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search brokers..."
            className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchQuery}
            onChange={(e) => {
              e.stopPropagation();
              setSearchQuery(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery("");
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {/* Connected brokers section */}
        {connectedBrokers.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-4">Connected Brokers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {brokers
                .filter(broker => connectedBrokers.includes(broker.id))
                .map(broker => (
                  <Card key={broker.id} className="border overflow-hidden hover:shadow-md transition-all">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                            {getBrokerInitial(broker.name)}
                          </div>
                          <CardTitle className="text-base">{broker.name}</CardTitle>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 pb-4">
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 pb-4">
                      <Button 
                        className="w-full" 
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBrokerSelect(broker.id);
                        }}
                      >
                        Manage
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        )}
        
        {/* Available brokers section */}
        <div>
          <h2 className="text-lg font-medium mb-4">Available Brokers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBrokers
              .filter(broker => !connectedBrokers.includes(broker.id))
              .map((broker) => (
                <Card key={broker.id} className="border overflow-hidden hover:shadow-md transition-all">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        {getBrokerInitial(broker.name)}
                      </div>
                      <CardTitle className="text-base">{broker.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 pb-4">
                    <p className="text-xs text-muted-foreground line-clamp-2">{broker.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 pb-4">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBrokerSelect(broker.id);
                      }}
                    >
                      Connect
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>

        {filteredBrokers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No brokers found matching your search.</p>
          </div>
        )}

        {/* Side panel for entering credentials */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
            <SheetHeader>
              <SheetTitle>Connect {selectedBroker?.name}</SheetTitle>
              <SheetDescription>
                Enter your {selectedBroker?.name} API credentials to connect your account.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-6" onClick={(e) => e.stopPropagation()}>
              {selectedBroker?.fields.map((field: any) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.label}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    required
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2 pt-4">
                <SheetClose asChild>
                  <Button type="button" variant="outline" onClick={(e) => e.stopPropagation()}>Cancel</Button>
                </SheetClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Connecting...' : 'Connect'}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );

  return (
    <SidebarProvider defaultOpen>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto">
            <BrokerContent />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
} 