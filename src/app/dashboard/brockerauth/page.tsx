"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getConnectedBrokers, BrokerConnection } from "@/services/brokerService";
import { CheckCircle, Search, X } from "lucide-react";
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

// Define broker data
const brokers = [
  {
    id: "spaisa",
    name: "SPAISA",
    description: "Connect your SPAISA account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "userId", label: "User ID", type: "text" }
    ]
  },
  {
    id: "aliceblue",
    name: "ALICEBLUE",
    description: "Connect your ALICEBLUE account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "alpaca",
    name: "ALPACA",
    description: "Connect your ALPACA account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "anandrathi",
    name: "ANANDRATHI",
    description: "Connect your ANANDRATHI account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "clientId", label: "Client ID", type: "text" }
    ]
  },
  {
    id: "angelbroking",
    name: "ANGELBROKING",
    description: "Connect your ANGELBROKING account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "clientId", label: "Client ID", type: "text" }
    ]
  },
  {
    id: "ats",
    name: "ATS",
    description: "Connect your ATS account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "binance",
    name: "BINANCE",
    description: "Connect your BINANCE account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "binanceV2",
    name: "BINANCEV2",
    description: "Connect your BINANCE V2 account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "bitbns",
    name: "BITBNS",
    description: "Connect your BITBNS account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "bitmex",
    name: "BITMEX",
    description: "Connect your BITMEX account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "bybit",
    name: "BYBIT",
    description: "Connect your BYBIT account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "coindcx",
    name: "COINDCX",
    description: "Connect your COINDCX account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "delta",
    name: "DELTA",
    description: "Connect your DELTA account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "dhanhq",
    name: "DHANHQ",
    description: "Connect your DHANHQ account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "finvasia",
    name: "FINVASIA",
    description: "Connect your FINVASIA account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "vendorCode", label: "Vendor Code", type: "text" }
    ]
  },
  {
    id: "forex",
    name: "FOREX",
    description: "Connect your FOREX account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "ftx",
    name: "FTX",
    description: "Connect your FTX account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  {
    id: "flattrader",
    name: "FLATTRADER",
    description: "Connect your FLATTRADER account to automate trading.",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "accountId", label: "Account ID", type: "text" }
    ]
  },
  {
    id: "metatrader5",
    name: "METATRADER 5",
    description: "Connect your MetaTrader 5 account to automate trading.",
    fields: [
      { name: "login", label: "Login", type: "text" },
      { name: "password", label: "Password", type: "password" },
      { name: "server", label: "Server", type: "text" }
    ]
  },
  {
    id: "metatrader4",
    name: "METATRADER 4",
    description: "Connect your MetaTrader 4 account to automate trading.",
    fields: [
      { name: "login", label: "Login", type: "text" },
      { name: "password", label: "Password", type: "password" },
      { name: "server", label: "Server", type: "text" }
    ]
  }
];

export default function BrokerAuthPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedBrokers, setConnectedBrokers] = useState<BrokerConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Fetch connected brokers
  useEffect(() => {
    const fetchConnectedBrokers = async () => {
      try {
        setIsLoading(true);
        // For now, we'll just simulate a successful API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Uncomment this when the API is ready
        // const data = await getConnectedBrokers();
        // setConnectedBrokers(data);
        
        // Mock data for now
        setConnectedBrokers([
          {
            id: "conn-1",
            brokerId: "spaisa",
            userId: "user-1",
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      } catch (err) {
        console.error("Error fetching connected brokers:", err);
        setError("Failed to load connected brokers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnectedBrokers();
  }, []);

  // Filter brokers based on search query
  const filteredBrokers = brokers.filter(broker => 
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if a broker is connected
  const isBrokerConnected = (brokerId: string) => {
    return connectedBrokers.some(conn => conn.brokerId === brokerId);
  };

  // Get connection status for a broker
  const getBrokerConnectionStatus = (brokerId: string) => {
    const connection = connectedBrokers.find(conn => conn.brokerId === brokerId);
    return connection?.status || null;
  };

  // Handle broker selection
  const handleBrokerSelect = (brokerId: string) => {
    const broker = brokers.find(b => b.id === brokerId);
    if (broker) {
      setSelectedBroker(broker);
      setFormData({});
      setIsSheetOpen(true);
    }
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Here you would make an API call to save the broker credentials
      console.log("Submitting credentials for", selectedBroker.name, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add the new connection to the list
      const newConnection: BrokerConnection = {
        id: `conn-${Date.now()}`,
        brokerId: selectedBroker.id,
        userId: "user-1", // This would come from your auth context
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setConnectedBrokers(prev => [...prev, newConnection]);
      
      // Close the sheet
      setIsSheetOpen(false);
      setSelectedBroker(null);
      
    } catch (err) {
      console.error("Error connecting broker:", err);
      setError("Failed to connect broker");
    } finally {
      setIsLoading(false);
    }
  };

  // Get broker initial for avatar
  const getBrokerInitial = (name: string) => {
    return name.charAt(0);
  };

  const BrokerContent = () => (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Broker Authentication</h1>
        <p className="text-muted-foreground">
          Connect your broker accounts to enable automated trading.
        </p>
      </div>

      {/* Search input */}
      <div className="mb-8 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search brokers..."
            className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Connected brokers section */}
      {connectedBrokers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Connected Brokers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {connectedBrokers.map(connection => {
              const broker = brokers.find(b => b.id === connection.brokerId);
              if (!broker) return null;
              
              return (
                <Card key={connection.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-all">
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 relative">
                        <span className="text-lg font-bold">{getBrokerInitial(broker.name)}</span>
                        {connection.status === 'active' && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold">{broker.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Status: <span className="text-green-600 font-medium">Active</span>
                        </p>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => handleBrokerSelect(broker.id)}
                    >
                      Manage
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Available brokers section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Brokers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBrokers.map((broker) => {
            const isConnected = isBrokerConnected(broker.id);
            if (isConnected) return null; // Skip connected brokers
            
            return (
              <Card key={broker.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-all">
                <div className="p-4 flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl font-bold">{getBrokerInitial(broker.name)}</span>
                  </div>
                  <p className="text-sm text-center mb-4">{broker.description}</p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleBrokerSelect(broker.id)}
                  >
                    Add Api
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {filteredBrokers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No brokers found matching your search.</p>
        </div>
      )}

      {/* Side panel for entering credentials */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Connect {selectedBroker?.name}</SheetTitle>
            <SheetDescription>
              Enter your {selectedBroker?.name} API credentials to connect your account.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-6">
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
                />
              </div>
            ))}
            <div className="flex justify-end space-x-2 pt-4">
              <SheetClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </SheetClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Connecting...' : 'Connect'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
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