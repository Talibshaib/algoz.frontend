"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { 
  getAvailableBrokers, 
  getSavedBrokers,
  saveBrokerCredentials
} from "@/services/brokerService";
import { DhanAuthModal } from "@/components/ui/dhan-auth-modal";

export default function ApiCredentialsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedBrokers, setSavedBrokers] = useState<any[]>([]);
  const [availableBrokers, setAvailableBrokers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDhanModalOpen, setIsDhanModalOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        setIsLoading(true);
        
        // Fetch saved brokers
        const savedBrokersData = await getSavedBrokers();
        setSavedBrokers(savedBrokersData);
        
        // Fetch available brokers
        const availableBrokersData = await getAvailableBrokers();
        
        // Check if Dhan is in the available brokers
        const hasDhan = availableBrokersData.some((broker: any) => broker.id === 'dhan');
        
        // If Dhan is not in the available brokers, add it
        if (!hasDhan) {
          availableBrokersData.push({
            id: 'dhan',
            name: 'DHAN',
            description: 'Connect your Dhan account to automate trading.',
            fields: [
              { name: 'partner_id', label: 'Partner ID', type: 'text' },
              { name: 'partner_secret', label: 'Partner Secret', type: 'password' }
            ]
          });
        }
        
        setAvailableBrokers(availableBrokersData);
      } catch (error: any) {
        console.error("Error fetching brokers:", error);
        toast.error("Failed to load brokers: " + (error.response?.data?.message || error.message || "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  // Function to refresh brokers data
  const refreshBrokers = async () => {
    try {
      // Fetch saved brokers
      const savedBrokersData = await getSavedBrokers();
      setSavedBrokers(savedBrokersData);
      
      // Fetch available brokers
      const availableBrokersData = await getAvailableBrokers();
      
      // Check if Dhan is in the available brokers
      const hasDhan = availableBrokersData.some((broker: any) => broker.id === 'dhan');
      
      // If Dhan is not in the available brokers, add it
      if (!hasDhan) {
        availableBrokersData.push({
          id: 'dhan',
          name: 'DHAN',
          description: 'Connect your Dhan account to automate trading.',
          fields: [
            { name: 'partner_id', label: 'Partner ID', type: 'text' },
            { name: 'partner_secret', label: 'Partner Secret', type: 'password' }
          ]
        });
      }
      
      setAvailableBrokers(availableBrokersData);
    } catch (error: any) {
      console.error("Error refreshing brokers:", error);
      toast.error("Failed to refresh brokers: " + (error.response?.data?.message || error.message || "Unknown error"));
    }
  };

  // Filter brokers based on search query
  const filteredAvailableBrokers = availableBrokers.filter(broker => 
    broker.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !savedBrokers.some(sb => sb.brokerId === broker.id)
  );

  // Handle broker selection for Dhan
  const handleDhanConnect = () => {
    setIsDhanModalOpen(true);
  };

  // Get broker initial for display
  const getBrokerInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">API Credentials</h1>
      <p className="text-muted-foreground mb-6">
        Connect your broker accounts to enable automated trading
      </p>
      
      <div className="mb-6">
        <Input
          placeholder="Search brokers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      {savedBrokers.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-medium mb-4">Saved Brokers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {savedBrokers.map((broker) => (
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
                  <p className="text-xs text-muted-foreground">
                    {broker.isActive ? "Active" : "Inactive"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-lg font-medium mb-4">Available Brokers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAvailableBrokers.map((broker) => (
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
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {broker.description || `Connect your ${broker.name} account to automate trading.`}
                </p>
              </CardContent>
              <div className="p-4 pt-0 pb-4">
                <Button
                  className="w-full"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (broker.id === 'dhan') {
                      handleDhanConnect();
                    } else {
                      setSelectedBroker(broker);
                      setIsModalOpen(true);
                    }
                  }}
                  disabled={isLoading}
                >
                  Connect
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Dhan Auth Modal */}
      <DhanAuthModal
        isOpen={isDhanModalOpen}
        onClose={() => setIsDhanModalOpen(false)}
        onSuccess={refreshBrokers}
      />
    </div>
  );
} 