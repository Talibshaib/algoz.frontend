"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CheckCircle, Search, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

// Create a completely isolated modal component
const BrokerCredentialsModal = ({ 
  isOpen, 
  onClose, 
  broker, 
  onSubmit, 
  isLoading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  broker: any; 
  onSubmit: (formData: Record<string, string>) => void; 
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  // Load saved credentials when broker changes
  useEffect(() => {
    if (broker) {
      const savedCredentials = localStorage.getItem(`broker_${broker.id}_credentials`);
      if (savedCredentials) {
        try {
          setFormData(JSON.parse(savedCredentials));
        } catch (e) {
          console.error("Error parsing saved credentials", e);
          setFormData({});
        }
      } else {
        setFormData({});
      }
    }
  }, [broker]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  if (!isOpen || !broker) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Connect {broker.name}</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Enter your {broker.name} API credentials to connect your account.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {broker.fields.map((field: any) => (
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Connecting...' : 'Connect'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function BrokerAuthPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedBrokers, setConnectedBrokers] = useState<string[]>([]);
  
  // Load connected brokers on mount
  useEffect(() => {
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
      setSelectedBroker(broker);
      // Use setTimeout to ensure this runs after the current call stack is clear
      setTimeout(() => {
        setIsModalOpen(true);
      }, 0);
    }
  };
  
  // Handle form submission from modal
  const handleFormSubmit = (formData: Record<string, string>) => {
    setIsLoading(true);
    
    try {
      // Save credentials to localStorage
      localStorage.setItem(`broker_${selectedBroker.id}_credentials`, JSON.stringify(formData));
      localStorage.setItem(`broker_${selectedBroker.id}_authenticated`, 'true');
      
      // Add the broker to connected brokers if not already connected
      if (!connectedBrokers.includes(selectedBroker.id)) {
        setConnectedBrokers(prev => [...prev, selectedBroker.id]);
      }
      
      // Close the modal after a short delay
      setTimeout(() => {
        setIsLoading(false);
        setIsModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Error connecting broker:", error);
      setIsLoading(false);
    }
  };
  
  // Get broker initial for avatar
  const getBrokerInitial = (name: string) => {
    return name.charAt(0);
  };

  return (
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
                        onClick={() => handleBrokerSelect(broker.id)}
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
                      onClick={() => handleBrokerSelect(broker.id)}
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
      </div>
      
      {/* Completely isolated modal */}
      <BrokerCredentialsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        broker={selectedBroker}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}