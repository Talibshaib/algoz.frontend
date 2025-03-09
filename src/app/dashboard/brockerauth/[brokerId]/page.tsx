"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Define broker configurations
const brokers: Record<string, { name: string; fields: { name: string; label: string; type: string; }[] }> = {
  aliceblue: {
    name: "ALICEBLUE",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  alpaca: {
    name: "ALPACA",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  angelone: {
    name: "ANGELONE",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "clientId", label: "Client ID", type: "text" },
      { name: "clientPin", label: "Client PIN", type: "password" },
    ]
  },
  ats: {
    name: "ATS",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  binance: {
    name: "BINANCE",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  binancev2: {
    name: "BINANCEV2",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  bitbns: {
    name: "BITBNS",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  bitmex: {
    name: "BITMEX",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  bybit: {
    name: "BYBIT",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  coindcx: {
    name: "COINDCX",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  delta: {
    name: "DELTA",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  dhanhq: {
    name: "DHANHQ",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  finvasia: {
    name: "FINVASIA",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "vendorCode", label: "Vendor Code", type: "text" },
    ]
  },
  forex: {
    name: "FOREX",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  ftx: {
    name: "FTX",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  fyers: {
    name: "FYERS",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  iifl: {
    name: "IIFL",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  metatrader5: {
    name: "METATRADER 5",
    fields: [
      { name: "login", label: "Login", type: "text" },
      { name: "password", label: "Password", type: "password" },
      { name: "server", label: "Server", type: "text" },
    ]
  },
  metatrader4: {
    name: "METATRADER 4",
    fields: [
      { name: "login", label: "Login", type: "text" },
      { name: "password", label: "Password", type: "password" },
      { name: "server", label: "Server", type: "text" },
    ]
  },
  spaisa: {
    name: "SPAISA",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  upstox: {
    name: "UPSTOX",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
  zerodha: {
    name: "ZERODHA",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
    ]
  },
};

// MetaTrader Form Component
const MetaTraderForm = ({ brokerId }: { brokerId: string }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  // Get broker info
  const broker = brokers[brokerId];

  useEffect(() => {
    // Check if credentials are saved
    const savedCredentials = localStorage.getItem(`broker_${brokerId}_credentials`);
    const isAuthenticated = localStorage.getItem(`broker_${brokerId}_authenticated`) === 'true';
    
    if (savedCredentials) {
      setFormData(JSON.parse(savedCredentials));
    }
    
    setIsAuthenticated(isAuthenticated);
  }, [brokerId]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Save credentials to localStorage (for demo purposes)
      localStorage.setItem(`broker_${brokerId}_credentials`, JSON.stringify(formData));
      
      // Show success message
      setSuccess(`${broker.name} credentials saved successfully!`);
      
      // Reset form after submission
      setTimeout(() => {
        setSuccess(null);
        setIsDialogOpen(false);
      }, 2000);
    } catch (error) {
      setError('Failed to save credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle authentication toggle
  const handleAuthToggle = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (isAuthenticated) {
        // Disconnect from MetaAPI
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        localStorage.setItem(`broker_${brokerId}_authenticated`, 'false');
        setIsAuthenticated(false);
        setSuccess(`Disconnected from ${broker.name} successfully!`);
      } else {
        // Connect to MetaAPI
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        localStorage.setItem(`broker_${brokerId}_authenticated`, 'true');
        setIsAuthenticated(true);
        setSuccess(`Connected to ${broker.name} successfully!`);
        
        // If it's a MetaTrader broker, redirect to the MetaTrader dashboard
        if (brokerId === 'metatrader4' || brokerId === 'metatrader5') {
          setTimeout(() => {
            router.push(`/dashboard/metatrader?brokerId=${brokerId}`);
          }, 1000);
        }
      }
    } catch (error) {
      setError('Failed to connect. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect {broker.name}</DialogTitle>
          <DialogDescription>
            Enter your {broker.name} API credentials to connect your account.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {broker.fields.map(field => (
            <div key={field.name} className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
              </label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}
          
          <DialogFooter className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Connect'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Regular Broker Form Component
const RegularBrokerForm = ({ brokerId }: { brokerId: string }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  // Get broker info
  const broker = brokers[brokerId];

  useEffect(() => {
    // Check if credentials are saved
    const savedCredentials = localStorage.getItem(`broker_${brokerId}_credentials`);
    const isAuthenticated = localStorage.getItem(`broker_${brokerId}_authenticated`) === 'true';
    
    if (savedCredentials) {
      setFormData(JSON.parse(savedCredentials));
    }
    
    setIsAuthenticated(isAuthenticated);
  }, [brokerId]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Save credentials to localStorage (for demo purposes)
      localStorage.setItem(`broker_${brokerId}_credentials`, JSON.stringify(formData));
      localStorage.setItem(`broker_${brokerId}_authenticated`, 'true');
      
      // Show success message
      setSuccess(`${broker.name} credentials saved successfully!`);
      setIsAuthenticated(true);
      
      // Reset form after submission
      setTimeout(() => {
        setSuccess(null);
        setIsDialogOpen(false);
      }, 2000);
    } catch (error) {
      setError('Failed to save credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect {broker.name}</DialogTitle>
          <DialogDescription>
            Enter your {broker.name} API credentials to connect your account.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {broker.fields.map(field => (
            <div key={field.name} className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
              </label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}
          
          <DialogFooter className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Connect'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Page Component
export default function BrokerAuthDetailPage({ params }: { params: { brokerId: string } }) {
  const router = useRouter();
  const { brokerId } = params;
  
  // Check if broker exists
  if (!brokers[brokerId]) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push('/dashboard/brockerauth')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Brokers
        </Button>
        <p>Broker not found.</p>
      </div>
    );
  }

  // Render MetaTrader form for MetaTrader brokers
  if (brokerId === 'metatrader4' || brokerId === 'metatrader5') {
    return <MetaTraderForm brokerId={brokerId} />;
  }

  // Render regular broker form for other brokers
  return <RegularBrokerForm brokerId={brokerId} />;
} 