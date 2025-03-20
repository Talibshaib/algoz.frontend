"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Search, X, Settings, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";
import { 
  getAvailableBrokers,
  getSavedBrokers, 
  saveBrokerCredentials, 
  updateBrokerCredentials, 
  deleteBrokerCredentials, 
  toggleBrokerStatus,
  Broker,
  SavedBroker,
  BrokerField
} from "@/services/brokerService";
import Image from "next/image";

// Dynamically import the DhanAuthModal with no SSR to avoid hydration issues
const DhanAuthModal = dynamic(
  () => import("@/features/brokers/components/DhanAuth").then(mod => ({ default: mod.DhanAuthModal })),
  { ssr: false }
);

// Dynamically import the DhanAuthButton with no SSR to avoid hydration issues
const DhanAuthButton = dynamic(
  () => import("@/features/brokers/components/DhanAuth").then(mod => ({ default: mod.DhanAuthButton })),
  { ssr: false }
);

// Dynamically import the MetaTrader5AuthModal with no SSR to avoid hydration issues
const MetaTrader5AuthModal = dynamic(
  () => import("@/features/brokers/components/MetaTrader5Auth").then(mod => ({ default: mod.MetaTrader5AuthModal })),
  { ssr: false }
);

// Dynamically import the MetaTrader5AuthButton with no SSR to avoid hydration issues
const MetaTrader5AuthButton = dynamic(
  () => import("@/features/brokers/components/MetaTrader5Auth").then(mod => ({ default: mod.MetaTrader5AuthButton })),
  { ssr: false }
);

// Create a completely isolated modal component
const BrokerCredentialsModal = ({
  isOpen,
  onClose,
  broker,
  onSubmit,
  isLoading,
  savedBrokers
}: {
  isOpen: boolean;
  onClose: () => void;
  broker: Broker | null;
  onSubmit: (formData: Record<string, string>) => void;
  isLoading: boolean;
  savedBrokers: SavedBroker[];
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  // Load saved credentials when broker changes
  useEffect(() => {
    if (broker) {
      // Find if this broker is already saved
      const savedBroker = savedBrokers.find(b => b.brokerId === broker.id);
      
      if (savedBroker) {
        // In a real implementation, we would fetch the credentials from the API
        // For now, we'll just use empty credentials
        setFormData({});
      } else {
        // Reset form for new broker
        setFormData({});
      }
    }
  }, [broker, savedBrokers]);
  
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
  
  // Check if this broker is already saved
  const isSaved = savedBrokers.some(b => b.brokerId === broker.id);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isSaved ? `Update ${broker.name}` : `Connect ${broker.name}`}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {isSaved 
            ? `Update your ${broker.name} API credentials.`
            : `Enter your ${broker.name} API credentials to connect your account.`
          }
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {broker.fields.map((field: BrokerField) => (
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
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                    Processing...
                  </div>
                : isSaved ? 'Update' : 'Connect'
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function BrokerManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBrokerId, setLoadingBrokerId] = useState<string | null>(null);
  const [savedBrokers, setSavedBrokers] = useState<SavedBroker[]>([]);
  const [availableBrokers, setAvailableBrokers] = useState<Broker[]>([]);
  const [isDhanModalOpen, setIsDhanModalOpen] = useState(false);
  const [isMetaTrader5ModalOpen, setIsMetaTrader5ModalOpen] = useState(false);
  
  // Load brokers on component mount
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
        const hasDhan = availableBrokersData.some(broker => broker.id === 'dhan');
        
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
        setLoadingBrokerId(null);
      }
    };

    fetchBrokers();

    // Cleanup function to reset loading states when component unmounts
    return () => {
      setIsLoading(false);
      setLoadingBrokerId(null);
    };
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
      const hasDhan = availableBrokersData.some(broker => broker.id === 'dhan');
      
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
  const filteredBrokers = availableBrokers.filter(broker => 
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle broker selection for adding or updating credentials
  const handleBrokerSelect = (brokerId: string) => {
    const broker = availableBrokers.find(b => b.id === brokerId);
    if (broker) {
      if (broker.id === 'dhan') {
        setIsDhanModalOpen(true);
      } else if (broker.id === 'metatrader5') {
        setIsMetaTrader5ModalOpen(true);
      } else {
        setSelectedBroker(broker);
        // Use setTimeout to ensure this runs after the current call stack is clear
        setTimeout(() => {
          setIsModalOpen(true);
        }, 0);
      }
    }
  };
  
  // Handle form submission from modal - save or update broker credentials
  const handleFormSubmit = async (formData: Record<string, string>) => {
    if (!selectedBroker) return;
    
    setIsLoading(true);
    
    try {
      // Check if broker already exists
      const existingBroker = savedBrokers.find(b => b.brokerId === selectedBroker.id);
      
      if (existingBroker) {
        // Update existing broker
        const updatedBroker = await updateBrokerCredentials(existingBroker.id, formData);
        
        // Update the broker in the state
        setSavedBrokers(prev => 
          prev.map(b => b.id === updatedBroker.id ? updatedBroker : b)
        );
        
        toast.success(`${selectedBroker.name} credentials updated successfully`);
      } else {
        // Save new broker
        const newBroker = await saveBrokerCredentials(selectedBroker.id, formData);
        
        // Add the new broker to the state
        setSavedBrokers(prev => [...prev, newBroker]);
        
        toast.success(`${selectedBroker.name} connected successfully`);
      }
      
      // Close the modal after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
      }, 500);
    } catch (error: any) {
      console.error("Error saving broker credentials:", error);
      const isUpdate = savedBrokers.some(b => b.brokerId === selectedBroker.id);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      toast.error(`Failed to ${isUpdate ? 'update' : 'connect'} ${selectedBroker.name}: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle broker toggle
  const handleBrokerToggle = async (brokerId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Find the broker in the state
    const savedBroker = savedBrokers.find((broker) => broker.brokerId === brokerId);
    if (!savedBroker) {
      toast.error("Broker not found");
      return;
    }

    try {
      setLoadingBrokerId(brokerId);
      
      // Use let instead of const for token-related variables to support refreshing
      let updatedBroker;
      
      // Toggle the broker status via the service
      try {
        updatedBroker = await toggleBrokerStatus(brokerId, savedBroker.isActive);
      } catch (error: any) {
        console.error("Error toggling broker status:", error);
        const errorMessage = error.response?.data?.message || error.message || "Unknown error";
        throw new Error(errorMessage);
      }
      
      // Refresh the brokers list to ensure we have the latest data
      await refreshBrokers();
      
      toast.success(`Broker ${savedBroker.name} ${savedBroker.isActive ? "deactivated" : "activated"} successfully`);
    } catch (error: any) {
      console.error("Error toggling broker status:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to toggle broker status: ${errorMessage}`);
    } finally {
      setLoadingBrokerId(null);
    }
  };
  
  // Handle broker deletion
  const handleBrokerDelete = async (brokerId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Find the broker in the state
    const savedBroker = savedBrokers.find((broker) => broker.id === brokerId);
    if (!savedBroker) {
      toast.error("Broker not found");
      return;
    }

    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete broker "${savedBroker.name}"? This action cannot be undone.`
    );
    
    if (!confirmed) {
      return;
    }

    try {
      setLoadingBrokerId(brokerId);
      
      // Delete the broker using the service
      await deleteBrokerCredentials(brokerId);

      // Remove the broker from the state
      setSavedBrokers((prev) => prev.filter((broker) => broker.id !== brokerId));

      toast.success(`Broker ${savedBroker.name} deleted successfully`);
    } catch (error: any) {
      console.error("Error deleting broker:", error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      toast.error(`Failed to delete broker: ${errorMessage}`);
    } finally {
      setLoadingBrokerId(null);
    }
  };
  
  // Get broker initial for avatar
  const getBrokerInitial = (name: string) => {
    return name.charAt(0);
  };

  return (
    <div className="container mx-auto py-6 space-y-8" suppressHydrationWarning>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Broker Management</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search brokers..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          suppressHydrationWarning
        />
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-sm text-muted-foreground">Loading...</span>
        </div>
      )}

      {/* Saved brokers section */}
      {!isLoading && savedBrokers.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-4">Saved Brokers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {savedBrokers.map((broker) => (
              <Card key={broker.id} className="border overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        {getBrokerInitial(broker.name)}
                      </div>
                      <CardTitle className="text-base">{broker.name}</CardTitle>
                    </div>
                    {/* Toggle button to enable/disable the broker */}
                    {broker.brokerId === 'dhan' ? (
                      <DhanAuthButton 
                        brokerId={broker.id} 
                        isActive={broker.isActive} 
                        onSuccess={() => refreshBrokers()}
                      />
                    ) : broker.brokerId === 'metatrader5' ? (
                      <MetaTrader5AuthButton 
                        brokerId={broker.id} 
                        isActive={broker.isActive} 
                        onSuccess={() => refreshBrokers()}
                      />
                    ) : (
                      <button
                        onClick={(e) => handleBrokerToggle(broker.id, e)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        disabled={isLoading || loadingBrokerId === broker.id}
                      >
                        {loadingBrokerId === broker.id ? (
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : broker.isActive ? (
                          <ToggleRight className="h-6 w-6 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 pb-4">
                  <p className="text-xs text-muted-foreground">Saved</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 pb-4 flex justify-between">
                  {/* Settings icon to update broker credentials */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBrokerSelect(broker.brokerId);
                    }}
                    className="text-gray-400 hover:text-primary transition-colors"
                    title="Update credentials"
                    disabled={isLoading || loadingBrokerId === broker.id}
                  >
                    <Settings size={18} />
                  </button>
                  {/* Delete icon to remove saved broker */}
                  <button
                    onClick={(e) => handleBrokerDelete(broker.id, e)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete broker"
                    disabled={isLoading || loadingBrokerId === broker.id}
                  >
                    {loadingBrokerId === broker.id ? (
                      <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available brokers section */}
      {!isLoading && (
        <div>
          <h2 className="text-lg font-medium mb-4">Available Brokers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBrokers
              .filter(broker => !savedBrokers.some(sb => sb.brokerId === broker.id))
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
                      disabled={isLoading}
                    >
                      Connect
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      )}

      {!isLoading && filteredBrokers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No brokers found matching your search.</p>
        </div>
      )}
      
      {/* Broker credentials modal */}
      {typeof window !== 'undefined' && (
        <>
          <BrokerCredentialsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            broker={selectedBroker}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            savedBrokers={savedBrokers}
          />
          
          {/* Dhan Auth Modal */}
          <DhanAuthModal
            brokerId="dhan"
            isModalOpen={isDhanModalOpen}
            onOpenModal={() => setIsDhanModalOpen(true)}
            onCloseModal={() => setIsDhanModalOpen(false)}
            onSuccess={() => refreshBrokers()}
          />
          
          {/* MetaTrader 5 Auth Modal */}
          <MetaTrader5AuthModal
            brokerId="metatrader5"
            isModalOpen={isMetaTrader5ModalOpen}
            onOpenModal={() => setIsMetaTrader5ModalOpen(true)}
            onCloseModal={() => setIsMetaTrader5ModalOpen(false)}
            onSuccess={() => refreshBrokers()}
          />
        </>
      )}
    </div>
  );
} 