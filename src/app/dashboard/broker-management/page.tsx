"use client";

import React, { useState, useEffect } from "react";
import { Search, CheckCircle, AlertCircle, Trash2, ToggleRight, ToggleLeft, Code, Zap, Settings, RefreshCw, PlayCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardCard, DashboardCardGroup, DashboardSection } from "@/features/dashboard";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  getAvailableBrokers, 
  getSavedBrokers,
  deleteBrokerCredentials,
  toggleBrokerStatus 
} from "@/services/brokerService";
import { DhanAuthModal } from "@/features/brokers/components/DhanAuth";

// Types definitions
interface BrokerField {
  name: string;
  label: string;
  type: string;
}

interface Broker {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  fields: BrokerField[];
}

interface SavedBroker {
  id: string;
  brokerId: string;
  name: string;
  isActive: boolean;
  credentials?: Record<string, string>;
  updatedAt?: string;
}

// Sample API templates for testing
const API_TEMPLATES = [
  { 
    id: 'account_info', 
    name: 'Account Information', 
    endpoint: '/api/broker/account',
    method: 'GET',
    params: {}
  },
  {
    id: 'place_order',
    name: 'Place Market Order',
    endpoint: '/api/broker/order',
    method: 'POST',
    params: {
      symbol: 'AAPL',
      quantity: 1,
      side: 'BUY',
      type: 'MARKET'
    }
  },
  {
    id: 'get_positions',
    name: 'Get Positions',
    endpoint: '/api/broker/positions',
    method: 'GET',
    params: {}
  }
];

export default function BrokerManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingBrokerId, setLoadingBrokerId] = useState<string | null>(null);
  const [savedBrokers, setSavedBrokers] = useState<SavedBroker[]>([]);
  const [availableBrokers, setAvailableBrokers] = useState<Broker[]>([]);
  const [isDhanModalOpen, setIsDhanModalOpen] = useState(false);
  
  // API Testing states
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiMethod, setApiMethod] = useState("GET");
  const [apiParams, setApiParams] = useState("{}");
  const [apiResponse, setApiResponse] = useState("");
  const [isApiLoading, setIsApiLoading] = useState(false);
  
  // Load brokers on component mount
  useEffect(() => {
    fetchBrokers();
  }, []);
  
  // Function to fetch all brokers
  const fetchBrokers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch saved brokers
      const savedBrokersData = await getSavedBrokers();
      setSavedBrokers(savedBrokersData);
      
      // Fetch available brokers
      const availableBrokersData = await getAvailableBrokers();
      setAvailableBrokers(availableBrokersData as Broker[]);
    } catch (error: any) {
      console.error("Error fetching brokers:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to load brokers");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle form submission after successful connection
  const handleFormSubmit = async () => {
    try {
      await fetchBrokers();
      toast.success("Broker connected successfully!");
    } catch (error: any) {
      console.error("Error handling form submission:", error);
      toast.error(error.response?.data?.message || error.message || "Connection failed");
    }
  };
  
  // Function to handle broker deletion
  const handleDeleteBroker = async (id: string) => {
    try {
      setLoadingBrokerId(id);
      await deleteBrokerCredentials(id);
      
      // Update the savedBrokers list
      setSavedBrokers((prev) => prev.filter((broker) => broker.id !== id));
      
      toast.success("Connection deleted successfully");
    } catch (error: any) {
      console.error("Error deleting broker:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete broker");
    } finally {
      setLoadingBrokerId(null);
    }
  };
  
  // Function to handle broker status toggle
  const handleToggleBrokerStatus = async (id: string, isActive: boolean) => {
    try {
      setLoadingBrokerId(id);
      await toggleBrokerStatus(id, !isActive);
      
      // Update the savedBrokers list
      setSavedBrokers((prev) =>
        prev.map((broker) =>
          broker.id === id ? { ...broker, isActive: !isActive } : broker
        )
      );
      
      toast.success(`Broker ${!isActive ? "activated" : "deactivated"} successfully`);
    } catch (error: any) {
      console.error("Error toggling broker status:", error);
      toast.error(`Failed to ${!isActive ? "activate" : "deactivate"} broker: ${error.response?.data?.message || error.message || "Unknown error"}`);
    } finally {
      setLoadingBrokerId(null);
    }
  };
  
  // Function to handle API template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = API_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        setApiEndpoint(template.endpoint);
        setApiMethod(template.method);
        setApiParams(JSON.stringify(template.params, null, 2));
      }
    }
  };
  
  // Function to execute API test
  const handleApiTest = async () => {
    try {
      setIsApiLoading(true);
      setApiResponse("Loading...");
      
      // Mock API call for now
      setTimeout(() => {
        const mockResponse = {
          success: true,
          data: {
            account_id: "ABC123",
            balance: 10000.50,
            margin_used: 2500.25,
            status: "active",
            timestamp: new Date().toISOString()
          }
        };
        
        setApiResponse(JSON.stringify(mockResponse, null, 2));
        setIsApiLoading(false);
      }, 1000);
      
      // In a real implementation, this would be an actual API call
      // const response = await fetch(apiEndpoint, {
      //   method: apiMethod,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: apiMethod !== 'GET' ? apiParams : undefined
      // });
      // const data = await response.json();
      // setApiResponse(JSON.stringify(data, null, 2));
      
    } catch (error: any) {
      console.error("API test error:", error);
      setApiResponse(JSON.stringify({ error: error.message }, null, 2));
      toast.error(error.message || "API test failed");
    } finally {
      setIsApiLoading(false);
    }
  };
  
  // Filter brokers based on the search query
  const filteredBrokers = availableBrokers.filter((broker) => {
    return broker.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Function to check if a broker is connected
  const isBrokerConnected = (brokerId: string) => {
    return savedBrokers.some((sb) => sb.brokerId === brokerId);
  };
  
  // Function to find the saved broker object by broker ID
  const getSavedBrokerByBrokerId = (brokerId: string) => {
    return savedBrokers.find((sb) => sb.brokerId === brokerId);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 min-h-screen text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Broker Authentication</h1>
          <p className="text-gray-400">Connect and manage your trading platforms</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            type="text"
            placeholder="Search broker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-gray-800 border-gray-700 text-gray-100"
          />
        </div>
      </div>
      
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="bg-gray-800 border-b border-gray-700 w-full justify-start mb-6">
          <TabsTrigger value="available" className="data-[state=active]:bg-gray-700">
            Available Brokers
          </TabsTrigger>
          <TabsTrigger value="saved" className="data-[state=active]:bg-gray-700">
            Saved Connections
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-gray-700">
            API Testing
          </TabsTrigger>
        </TabsList>
        
        {/* Available Brokers Section */}
        <TabsContent value="available" className="mt-0">
          <DashboardSection>
            <DashboardCardGroup>
              {isLoading ? (
                <DashboardCard className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </DashboardCard>
              ) : filteredBrokers.length === 0 ? (
                <DashboardCard className="py-12 text-center">
                  <p className="text-gray-400">No brokers found matching your search.</p>
                </DashboardCard>
              ) : (
                filteredBrokers.map((broker) => {
                  const isConnected = isBrokerConnected(broker.id);
                  const savedBroker = isConnected ? getSavedBrokerByBrokerId(broker.id) : null;
                  
                  return (
                    <DashboardCard key={broker.id} className="overflow-hidden bg-gray-800 border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 hover:scale-[1.02]">
                      <div className="pb-4 bg-gradient-to-r from-gray-800 to-gray-750">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            {broker.logo ? (
                              <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-700 p-1">
                                <img
                                  src={broker.logo}
                                  alt={`${broker.name} logo`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-blue-900/30 flex items-center justify-center">
                                <Settings size={24} className="text-blue-400" />
                              </div>
                            )}
                            <div>
                              <h2 className="text-lg text-gray-100">{broker.name}</h2>
                              {isConnected && (
                                <Badge variant={savedBroker?.isActive ? "default" : "secondary"} className="mt-1">
                                  {savedBroker?.isActive ? "Active" : "Inactive"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="min-h-[40px] text-gray-400">
                        {broker.description || "Connect with this broker for automated trading."}
                      </div>
                      
                      <div className="flex justify-between pt-2 pb-4">
                        {isConnected && savedBroker ? (
                          <div className="flex flex-col w-full gap-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">
                                {savedBroker.isActive ? (
                                  <span className="flex items-center text-green-500">
                                    <CheckCircle size={16} className="mr-1" />
                                    Connected
                                  </span>
                                ) : (
                                  <span className="flex items-center text-amber-500">
                                    <AlertCircle size={16} className="mr-1" />
                                    Disconnected
                                  </span>
                                )}
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-gray-700"
                                  title={savedBroker.isActive ? "Deactivate broker" : "Activate broker"}
                                  onClick={() => handleToggleBrokerStatus(savedBroker.id, savedBroker.isActive)}
                                  disabled={loadingBrokerId === savedBroker.id}
                                >
                                  {loadingBrokerId === savedBroker.id ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full" />
                                  ) : savedBroker.isActive ? (
                                    <ToggleRight size={18} className="text-green-500" />
                                  ) : (
                                    <ToggleLeft size={18} className="text-gray-400" />
                                  )}
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-gray-700"
                                  title="Delete broker connection"
                                  onClick={() => handleDeleteBroker(savedBroker.id)}
                                  disabled={loadingBrokerId === savedBroker.id}
                                >
                                  {loadingBrokerId === savedBroker.id ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full" />
                                  ) : (
                                    <Trash2 size={18} />
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            <Button
                              className="w-full mt-2 bg-gray-700 hover:bg-gray-600 text-gray-100"
                              variant="secondary"
                              onClick={() => setIsDhanModalOpen(true)}
                            >
                              Update Connection
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => setIsDhanModalOpen(true)}
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </DashboardCard>
                  );
                })
              )}
            </DashboardCardGroup>
          </DashboardSection>
        </TabsContent>
        
        {/* Saved Brokers Section */}
        <TabsContent value="saved" className="mt-0">
          <DashboardSection>
            <DashboardCardGroup>
              {isLoading ? (
                <DashboardCard className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </DashboardCard>
              ) : savedBrokers.length === 0 ? (
                <DashboardCard className="py-12 text-center bg-gray-800/30 rounded-lg border border-gray-700">
                  <div className="flex flex-col items-center gap-3 p-6">
                    <AlertCircle size={40} className="text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-300">No Connected Brokers</h3>
                    <p className="text-gray-400 text-center max-w-md">
                      You haven't connected any brokers yet. Switch to the Available Brokers tab to connect your first broker.
                    </p>
                  </div>
                </DashboardCard>
              ) : (
                savedBrokers.map((broker) => (
                  <DashboardCard key={broker.id} className="overflow-hidden bg-gray-800 border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20">
                    <div className="pb-4 bg-gradient-to-r from-gray-800 to-gray-750">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-blue-900/30 flex items-center justify-center">
                            <Settings size={24} className="text-blue-400" />
                          </div>
                          <div>
                            <h2 className="text-lg text-gray-100">{broker.name}</h2>
                            <Badge variant={broker.isActive ? "default" : "secondary"} className="mt-1">
                              {broker.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gray-750 rounded-md p-2 mb-3">
                      <span className="text-sm text-gray-400">Status:</span>
                      <span className={`text-sm flex items-center gap-1 ${broker.isActive ? "text-green-500" : "text-amber-500"}`}>
                        {broker.isActive ? (
                          <>
                            <CheckCircle size={14} />
                            Connected
                          </>
                        ) : (
                          <>
                            <AlertCircle size={14} />
                            Disconnected
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-750 rounded-md p-2">
                      <span className="text-sm text-gray-400">Last Updated:</span>
                      <span className="text-sm text-gray-300">
                        {broker.updatedAt ? new Date(broker.updatedAt).toLocaleDateString() : "Unknown"}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2 pt-2 pb-4">
                      <div className="flex w-full gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-100"
                          onClick={() => setIsDhanModalOpen(true)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-100"
                          onClick={() => handleToggleBrokerStatus(broker.id, broker.isActive)}
                          disabled={loadingBrokerId === broker.id}
                        >
                          {loadingBrokerId === broker.id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full mr-2" />
                          ) : null}
                          {broker.isActive ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                      <Button
                        variant="destructive"
                        className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400"
                        onClick={() => handleDeleteBroker(broker.id)}
                        disabled={loadingBrokerId === broker.id}
                      >
                        {loadingBrokerId === broker.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full mr-2" />
                        ) : (
                          <Trash2 size={16} className="mr-2" />
                        )}
                        Delete Connection
                      </Button>
                    </div>
                  </DashboardCard>
                ))
              )}
            </DashboardCardGroup>
          </DashboardSection>
        </TabsContent>
        
        {/* API Testing Section */}
        <TabsContent value="api" className="mt-0">
          <DashboardSection>
            <DashboardCardGroup>
              <DashboardCard className="bg-gray-800 border-gray-700">
                <div className="pb-4 bg-gradient-to-r from-gray-800 to-gray-750">
                  <div className="flex items-center gap-2">
                    <Code size={18} className="text-blue-400" />
                    <h2 className="text-lg text-gray-100">API Request</h2>
                  </div>
                  <p className="text-gray-400">
                    Test broker API endpoints with your connected accounts
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Template</label>
                    <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                      <SelectTrigger className="bg-gray-750 border-gray-700">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="">Custom Request</SelectItem>
                        {API_TEMPLATES.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Endpoint</label>
                    <Input 
                      placeholder="API endpoint path" 
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                      className="bg-gray-750 border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Method</label>
                    <Select value={apiMethod} onValueChange={setApiMethod}>
                      <SelectTrigger className="bg-gray-750 border-gray-700">
                        <SelectValue placeholder="Select API method" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Parameters (JSON)</label>
                    <Textarea 
                      placeholder="Enter request parameters as JSON" 
                      value={apiParams}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApiParams(e.target.value)}
                      className="min-h-[120px] bg-gray-750 border-gray-700 font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2 pb-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleApiTest}
                    disabled={isApiLoading}
                  >
                    {isApiLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full mr-2" />
                        Testing API...
                      </>
                    ) : (
                      <>
                        <PlayCircle size={18} className="mr-2" />
                        Run API Test
                      </>
                    )}
                  </Button>
                </div>
              </DashboardCard>
              
              <DashboardCard className="bg-gray-800 border-gray-700">
                <div className="pb-4 bg-gradient-to-r from-gray-800 to-gray-750">
                  <div className="flex items-center gap-2">
                    <Zap size={18} className="text-blue-400" />
                    <h2 className="text-lg text-gray-100">API Response</h2>
                  </div>
                  <p className="text-gray-400">
                    View the response from the broker API
                  </p>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-md p-4 min-h-[300px] max-h-[500px] overflow-auto">
                  <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                    {apiResponse || "No response yet. Run an API test to see results here."}
                  </pre>
                </div>
                <div className="flex justify-between pt-2 pb-4">
                  <Button
                    variant="outline"
                    className="bg-gray-750 border-gray-700 hover:bg-gray-700 text-gray-300"
                    onClick={() => setApiResponse("")}
                    disabled={!apiResponse}
                  >
                    Clear Results
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-gray-750 border-gray-700 hover:bg-gray-700 text-gray-300"
                    disabled={!apiResponse}
                    onClick={() => {
                      // Mock copy function
                      toast.success("Response copied to clipboard");
                    }}
                  >
                    <RefreshCw size={16} className="mr-2" />
                    Refresh
                  </Button>
                </div>
              </DashboardCard>
            </DashboardCardGroup>
          </DashboardSection>
        </TabsContent>
      </Tabs>
      
      {/* Dhan Auth Modal */}
      {typeof window !== 'undefined' && (
        <DhanAuthModal
          brokerId="dhan"
          isModalOpen={isDhanModalOpen}
          onOpenModal={() => setIsDhanModalOpen(true)}
          onCloseModal={() => setIsDhanModalOpen(false)}
          onSuccess={handleFormSubmit}
        />
      )}
    </div>
  );
}