"use client";

import React, { useState, ChangeEvent } from "react";
import { Input, Textarea } from "@nextui-org/react";
import { 
  Code, PlayCircle, RefreshCw, Zap
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { DashboardCard, DashboardCardGroup, DashboardSection } from "@/features/dashboard";

// Sample API templates for testing
const API_TEMPLATES = [
  { 
    id: 'account_info', 
    name: 'Account Information', 
    endpoint: '/api/v1/account',
    method: 'GET',
    params: {}
  },
  {
    id: 'place_order',
    name: 'Place Market Order',
    endpoint: '/api/v1/order',
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
    endpoint: '/api/v1/positions',
    method: 'GET',
    params: {}
  }
];

export default function ApiCredentialsPage() {
  // API Testing states
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiMethod, setApiMethod] = useState("GET");
  const [apiParams, setApiParams] = useState("{}");
  const [apiResponse, setApiResponse] = useState("");
  const [isApiLoading, setIsApiLoading] = useState(false);
  
  // Function to handle API template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (templateId && templateId !== "custom") {
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
  
  return (
    <div className="container mx-auto px-4 py-6 min-h-screen text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">API Credentials</h1>
          <p className="text-gray-400">Manage and test your API integration</p>
        </div>
      </div>
      
      <DashboardSection>
        <DashboardCardGroup>
          <DashboardCard className="bg-gray-800 border-gray-700">
            <div className="pb-4">
              <div className="flex items-center gap-2">
                <Code size={18} className="text-blue-400" />
                <h2 className="text-lg text-gray-100">API Request</h2>
              </div>
              <p className="text-gray-400">
                Test API endpoints with your credentials
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Template</label>
                <Select value={selectedTemplate} onValueChange={(value: string) => handleTemplateChange(value)}>
                  <SelectTrigger className="bg-gray-750 border-gray-700 text-gray-200">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="custom">Custom Request</SelectItem>
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
                  className="bg-gray-750 border-gray-700 text-gray-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Method</label>
                <Select value={apiMethod} onValueChange={(value: string) => setApiMethod(value)}>
                  <SelectTrigger className="bg-gray-750 border-gray-700 text-gray-200">
                    <SelectValue placeholder="Select API method" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
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
                  onChange={(e) => setApiParams(e.target.value)}
                  className="min-h-[120px] font-mono text-sm"
                  classNames={{
                    input: "bg-gray-750 border-gray-700 text-gray-200",
                    inputWrapper: "bg-gray-750 border-gray-700"
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end pt-2 pb-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
            <div className="pb-4">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-blue-400" />
                <h2 className="text-lg text-gray-100">API Response</h2>
              </div>
              <p className="text-gray-400">
                View the response from the API
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
    </div>
  );
}
