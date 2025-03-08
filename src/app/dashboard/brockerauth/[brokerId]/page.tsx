"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Define broker data
const brokers = {
  spaisa: {
    name: "SPAISA",
    logo: "/brokers/spaisa.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" },
      { id: "userId", label: "User ID", type: "text" }
    ]
  },
  aliceblue: {
    name: "ALICEBLUE",
    logo: "/brokers/aliceblue.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" },
      { id: "clientId", label: "Client ID", type: "text" }
    ]
  },
  alpaca: {
    name: "ALPACA",
    logo: "/brokers/alpaca.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  anandrathi: {
    name: "ANANDRATHI",
    logo: "/brokers/anandrathi.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" },
      { id: "userId", label: "User ID", type: "text" }
    ]
  },
  angelbroking: {
    name: "ANGELBROKING",
    logo: "/brokers/angelbroking.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "clientId", label: "Client ID", type: "text" },
      { id: "password", label: "Password", type: "password" }
    ]
  },
  ats: {
    name: "ATS",
    logo: "/brokers/ats.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  binance: {
    name: "BINANCE",
    logo: "/brokers/binance.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  binanceV2: {
    name: "BINANCEV2",
    logo: "/brokers/binance.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  bitbns: {
    name: "BITBNS",
    logo: "/brokers/bitbns.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  bitmex: {
    name: "BITMEX",
    logo: "/brokers/bitmex.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  bybit: {
    name: "BYBIT",
    logo: "/brokers/bybit.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  coindcx: {
    name: "COINDCX",
    logo: "/brokers/coindcx.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  delta: {
    name: "DELTA",
    logo: "/brokers/delta.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" }
    ]
  },
  dhanhq: {
    name: "DHANHQ",
    logo: "/brokers/dhanhq.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" },
      { id: "clientId", label: "Client ID", type: "text" }
    ]
  },
  finvasia: {
    name: "FINVASIA",
    logo: "/brokers/finvasia.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" },
      { id: "userId", label: "User ID", type: "text" }
    ]
  },
  forex: {
    name: "FOREX",
    logo: "/brokers/forex.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" },
      { id: "accountId", label: "Account ID", type: "text" }
    ]
  },
  ftx: {
    name: "FTX",
    logo: "/brokers/ftx.png",
    fields: [
      { id: "apiKey", label: "API Key", type: "text" },
      { id: "apiSecret", label: "API Secret", type: "password" }
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
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Create credentials object
      const credentials = {
        brokerId,
        ...formData
      };
      
      // Call the broker service to connect the broker
      // For now, we'll just simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Submitted broker credentials:", credentials);
      
      setSuccess("Broker connected successfully!");
      
      // Optionally redirect after successful connection
      // setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to connect broker. Please try again.");
      console.error("Error connecting broker:", err);
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
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  value={formData[field.id] || ""}
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