"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Define broker configurations
const brokers: Record<string, { name: string; logo: string; fields: { name: string; label: string; type: string }[] }> = {
  spaisa: {
    name: "SPAISA",
    logo: "/brokers/spaisa.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "userId", label: "User ID", type: "text" }
    ]
  },
  aliceblue: {
    name: "ALICEBLUE",
    logo: "/brokers/aliceblue.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  alpaca: {
    name: "ALPACA",
    logo: "/brokers/alpaca.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  anandrathi: {
    name: "ANANDRATHI",
    logo: "/brokers/anandrathi.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "clientId", label: "Client ID", type: "text" }
    ]
  },
  angelbroking: {
    name: "ANGELBROKING",
    logo: "/brokers/angelbroking.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "clientId", label: "Client ID", type: "text" }
    ]
  },
  ats: {
    name: "ATS",
    logo: "/brokers/ats.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  binance: {
    name: "BINANCE",
    logo: "/brokers/binance.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  binanceV2: {
    name: "BINANCEV2",
    logo: "/brokers/binance.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  bitbns: {
    name: "BITBNS",
    logo: "/brokers/bitbns.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  bitmex: {
    name: "BITMEX",
    logo: "/brokers/bitmex.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  bybit: {
    name: "BYBIT",
    logo: "/brokers/bybit.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  coindcx: {
    name: "COINDCX",
    logo: "/brokers/coindcx.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  delta: {
    name: "DELTA",
    logo: "/brokers/delta.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  dhanhq: {
    name: "DHANHQ",
    logo: "/brokers/dhanhq.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  finvasia: {
    name: "FINVASIA",
    logo: "/brokers/finvasia.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "vendorCode", label: "Vendor Code", type: "text" }
    ]
  },
  forex: {
    name: "FOREX",
    logo: "/brokers/forex.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  ftx: {
    name: "FTX",
    logo: "/brokers/ftx.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  flattrader: {
    name: "FLATTRADER",
    logo: "/brokers/flattrader.png",
    fields: [
      { name: "apiKey", label: "API Key", type: "text" },
      { name: "apiSecret", label: "API Secret", type: "password" },
      { name: "accountId", label: "Account ID", type: "text" }
    ]
  },
  metatrader5: {
    name: "METATRADER 5",
    logo: "/brokers/mt5.png",
    fields: [
      { name: "login", label: "Login", type: "text" },
      { name: "password", label: "Password", type: "password" },
      { name: "server", label: "Server", type: "text" }
    ]
  },
  metatrader4: {
    name: "METATRADER 4",
    logo: "/brokers/mt4.png",
    fields: [
      { name: "login", label: "Login", type: "text" },
      { name: "password", label: "Password", type: "password" },
      { name: "server", label: "Server", type: "text" }
    ]
  }
};

export default function BrokerAuthDetailPage({ params }: { params: { brokerId: string } }) {
  const router = useRouter();
  const { brokerId } = params;
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get broker data
  const broker = brokers[brokerId as keyof typeof brokers];

  // If broker not found
  if (!broker) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Broker Not Found</h1>
        <p className="mb-6">The broker you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/dashboard/brockerauth")}>
          Back to Brokers
        </Button>
      </div>
    );
  }

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
      
      // Here you would make an API call to save the broker credentials
      console.log("Submitting credentials for", broker.name, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert(`Your ${broker.name} credentials have been saved successfully.`);
      
      // Redirect to broker list
      router.push("/dashboard/brockerauth");
      
    } catch (error) {
      console.error("Error saving credentials:", error);
      alert("Failed to save credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0"
        onClick={() => router.push("/dashboard/brockerauth")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Brokers
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Connect {broker.name}</h1>
        <p className="text-muted-foreground">
          Enter your {broker.name} API credentials to connect your account.
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
              {broker.name.charAt(0)}
            </div>
            <CardTitle>{broker.name} Authentication</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {broker.fields.map(field => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
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
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Connecting..." : "Connect Broker"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 