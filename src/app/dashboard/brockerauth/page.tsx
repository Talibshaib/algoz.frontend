"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Search, X, Settings, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
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

// Define default brokers to use as fallback when API fails
const defaultBrokers: Broker[] = [
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
  }
];

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

  // Reset form data when broker changes
  useEffect(() => {
    if (broker) {
      setFormData({});
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
                ? 'Processing...' 
                : isSaved ? 'Update' : 'Connect'
              }
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
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedBrokers, setSavedBrokers] = useState<SavedBroker[]>([]);
  const [availableBrokers, setAvailableBrokers] = useState<Broker[]>([]);

  // Load brokers on mount
  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        setIsLoading(true);
        
        // Fetch saved brokers from API
        try {
          const savedBrokersData = await getSavedBrokers();
          setSavedBrokers(savedBrokersData);
        } catch (error) {
          console.error("Error fetching saved brokers:", error);
          
          // Load locally saved brokers as fallback
          const localBrokers = loadLocalBrokers();
          setSavedBrokers(localBrokers);
          
          if (localBrokers.length > 0) {
            toast.info(`Loaded ${localBrokers.length} locally saved brokers (API unavailable)`);
          } else {
            setSavedBrokers([]);
          }
        }
        
        // Fetch available brokers from API
        try {
          const availableBrokersData = await getAvailableBrokers();
          setAvailableBrokers(availableBrokersData);
        } catch (error) {
          console.error("Error fetching available brokers:", error);
          // Use default brokers as fallback
          setAvailableBrokers(defaultBrokers);
          toast.info("Using default broker list as fallback");
        }
      } catch (error: any) {
        console.error("Error in broker initialization:", error);
        // Ensure we at least have the default brokers
        setAvailableBrokers(defaultBrokers);
        toast.error("Failed to initialize brokers properly: " + (error.message || "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  // Load locally saved brokers from localStorage
  const loadLocalBrokers = (): SavedBroker[] => {
    const localBrokers: SavedBroker[] = [];
    
    // Check localStorage for saved brokers
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith('_authenticated') && localStorage.getItem(key) === 'true') {
        const brokerId = key.replace('broker_', '').replace('_authenticated', '');
        
        // Find the broker in default brokers
        const defaultBroker = defaultBrokers.find(b => b.id === brokerId);
        if (defaultBroker) {
          const isActive = localStorage.getItem(`broker_${brokerId}_active`) !== 'false';
          
          localBrokers.push({
            id: `local_${brokerId}`,
            brokerId: brokerId,
            name: defaultBroker.name,
            logo: defaultBroker.logo,
            isActive: isActive,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
    }
    
    return localBrokers;
  };

  // Filter brokers based on search query
  const filteredBrokers = availableBrokers.filter(broker => 
    broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle broker selection for adding or updating credentials
  const handleBrokerSelect = (brokerId: string) => {
    const broker = availableBrokers.find(b => b.id === brokerId);
    if (broker) {
      setSelectedBroker(broker);
      setIsModalOpen(true);
    }
  };

  // Handle form submission from modal - save or update broker credentials
  const handleFormSubmit = async (formData: Record<string, string>) => {
    if (!selectedBroker) return;
    
    setIsLoading(true);
    
    try {
      // Check if this broker is already saved
      const savedBroker = savedBrokers.find(b => b.brokerId === selectedBroker.id);
      
      if (savedBroker) {
        try {
          // Update existing credentials via API
          await updateBrokerCredentials(savedBroker.id, formData);
          
          // Update the broker in state
          setSavedBrokers(prev => 
            prev.map(b => b.id === savedBroker.id 
              ? { ...b, updatedAt: new Date().toISOString() } 
              : b
            )
          );
          
          toast.success(`${selectedBroker.name} credentials updated successfully`);
        } catch (error: any) {
          console.error("API error updating broker credentials:", error);
          
          // Fallback to localStorage
          localStorage.setItem(`broker_${selectedBroker.id}_credentials`, JSON.stringify(formData));
          
          // Update the broker in state anyway
          setSavedBrokers(prev => 
            prev.map(b => b.id === savedBroker.id 
              ? { ...b, updatedAt: new Date().toISOString() } 
              : b
            )
          );
          
          toast.info(`${selectedBroker.name} credentials saved locally (API unavailable)`);
        }
      } else {
        try {
          // Save new credentials via API
          const newBroker = await saveBrokerCredentials(selectedBroker.id, formData);
          
          // Add the new broker to state
          setSavedBrokers(prev => [...prev, newBroker]);
          
          toast.success(`${selectedBroker.name} connected successfully`);
        } catch (error: any) {
          console.error("API error saving broker credentials:", error);
          
          // Fallback to localStorage
          localStorage.setItem(`broker_${selectedBroker.id}_credentials`, JSON.stringify(formData));
          localStorage.setItem(`broker_${selectedBroker.id}_authenticated`, 'true');
          
          // Create a local broker object
          const localBroker: SavedBroker = {
            id: `local_${selectedBroker.id}`,
            brokerId: selectedBroker.id,
            name: selectedBroker.name,
            logo: selectedBroker.logo,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          // Add the local broker to state
          setSavedBrokers(prev => [...prev, localBroker]);
          
          toast.info(`${selectedBroker.name} connected locally (API unavailable)`);
        }
      }
      
      // Close the modal
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving broker credentials:", error);
      toast.error("Failed to save credentials: " + (error.response?.data?.message || error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle broker deletion
  const handleBrokerDelete = async (brokerId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    try {
      // Find the broker to get its name for the success message
      const broker = savedBrokers.find(b => b.id === brokerId);
      if (!broker) return;
      
      try {
        // Delete broker from API
        await deleteBrokerCredentials(brokerId);
      } catch (error) {
        console.error("API error deleting broker:", error);
        
        // Fallback to localStorage if it's a local broker
        if (brokerId.startsWith('local_')) {
          const actualBrokerId = brokerId.replace('local_', '');
          localStorage.removeItem(`broker_${actualBrokerId}_credentials`);
          localStorage.removeItem(`broker_${actualBrokerId}_authenticated`);
          localStorage.removeItem(`broker_${actualBrokerId}_active`);
        } else {
          // If it's not a local broker and API failed, show warning
          toast.error("API unavailable. Changes may not persist after reload.");
        }
      }
      
      // Remove from state regardless of API success
      setSavedBrokers(prev => prev.filter(b => b.id !== brokerId));
      
      toast.success(`${broker.name} deleted successfully`);
    } catch (error: any) {
      console.error("Error deleting broker:", error);
      toast.error("Failed to delete broker: " + (error.response?.data?.message || error.message || "Unknown error"));
    }
  };

  // Handle broker toggle
  const handleBrokerToggle = async (brokerId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    try {
      // Find the broker in state
      const broker = savedBrokers.find(b => b.id === brokerId);
      if (!broker) return;
      
      try {
        // Toggle the broker's active status via API
        const updatedBroker = await toggleBrokerStatus(brokerId, !broker.isActive);
        
        // Update the broker in state
        setSavedBrokers(prev => 
          prev.map(b => b.id === updatedBroker.id ? updatedBroker : b)
        );
      } catch (error) {
        console.error("API error toggling broker status:", error);
        
        // Fallback to localStorage
        if (brokerId.startsWith('local_')) {
          const actualBrokerId = brokerId.replace('local_', '');
          const isActive = localStorage.getItem(`broker_${actualBrokerId}_active`) === 'true';
          localStorage.setItem(`broker_${actualBrokerId}_active`, isActive ? 'false' : 'true');
        }
        
        // Update the broker in state anyway
        setSavedBrokers(prev => 
          prev.map(b => b.id === brokerId ? { ...b, isActive: !broker.isActive } : b)
        );
        
        toast.info("API unavailable. Changes saved locally.");
      }
      
      toast.success(`Broker ${!broker.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      console.error("Error toggling broker status:", error);
      toast.error("Failed to update broker status: " + (error.response?.data?.message || error.message || "Unknown error"));
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

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading brokers...</span>
          </div>
        )}

        {/* Saved brokers section */}
        {!isLoading && savedBrokers.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-4">Saved Brokers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {savedBrokers.map(broker => (
                <Card key={broker.id} className="border overflow-hidden hover:shadow-md transition-all">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                          {getBrokerInitial(broker.name)}
                        </div>
                        <CardTitle className="text-base">{broker.name}</CardTitle>
                      </div>
                      <button
                        onClick={(e) => handleBrokerToggle(broker.id, e)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        disabled={isLoading}
                      >
                        {broker.isActive ?
                          <ToggleRight className="h-6 w-6 text-green-500" /> :
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                        }
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 pb-4">
                    <p className="text-xs text-muted-foreground">Saved</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 pb-4 flex justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBrokerSelect(broker.brokerId);
                      }}
                      className="text-gray-400 hover:text-primary transition-colors"
                      title="Update credentials"
                      disabled={isLoading}
                    >
                      <Settings size={18} />
                    </button>
                    <button
                      onClick={(e) => handleBrokerDelete(broker.id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete broker"
                      disabled={isLoading}
                    >
                      <Trash2 size={18} />
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
                .filter(broker => !savedBrokers.some(saved => saved.brokerId === broker.id))
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
      </div>

      {/* Completely isolated modal */}
      <BrokerCredentialsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        broker={selectedBroker}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        savedBrokers={savedBrokers}
      />
    </div>
  );
}