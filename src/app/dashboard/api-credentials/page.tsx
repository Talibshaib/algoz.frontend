"use client";

import React, { useState, useEffect } from "react";
import { Key, Copy, RefreshCw, Check, AlertCircle, Eye, EyeOff, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { DashboardCard, DashboardCardGroup, DashboardSection } from "@/features/dashboard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Mock API key data - would normally come from a backend
interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  permissions: string[];
  active: boolean;
}

export default function ApiCredentialsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(["read"]);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState<string | null>(null);

  // Load API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Function to fetch API keys
  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const mockApiKeys: ApiKey[] = [
          {
            id: "key_1",
            name: "Trading Bot API Key",
            key: "ak_1a2b3c4d5e6f7g8h9i0j",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            lastUsed: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            permissions: ["read", "write", "trade"],
            active: true
          },
          {
            id: "key_2",
            name: "Analytics Read-Only",
            key: "ak_0z9y8x7w6v5u4t3s2r1q",
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            lastUsed: null,
            permissions: ["read"],
            active: true
          }
        ];
        setApiKeys(mockApiKeys);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("Failed to fetch API keys");
      setIsLoading(false);
    }
  };

  // Function to toggle API key visibility
  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  // Function to copy API key to clipboard
  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(`${keyName} copied to clipboard`);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  // Function to toggle API key status
  const toggleKeyStatus = async (keyId: string, active: boolean) => {
    try {
      // Simulate API call
      setApiKeys(prev => 
        prev.map(key => 
          key.id === keyId 
            ? { ...key, active: !active } 
            : key
        )
      );
      
      toast.success(`API key ${!active ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Error toggling API key status:", error);
      toast.error("Failed to update API key status");
    }
  };

  // Function to delete API key
  const deleteApiKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return;
    }
    
    try {
      // Simulate API call
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
      toast.success("API key deleted successfully");
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Failed to delete API key");
    }
  };

  // Function to generate new API key
  const generateNewApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for your API key");
      return;
    }
    
    setGeneratingKey(true);
    try {
      // Simulate API call
      setTimeout(() => {
        const newKey = `ak_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        const newApiKey: ApiKey = {
          id: `key_${Date.now()}`,
          name: newKeyName,
          key: newKey,
          createdAt: new Date().toISOString(),
          lastUsed: null,
          permissions: selectedPermissions,
          active: true
        };
        
        setApiKeys(prev => [newApiKey, ...prev]);
        setNewlyGeneratedKey(newKey);
        setNewKeyName("");
        setSelectedPermissions(["read"]);
        setGeneratingKey(false);
        toast.success("API key generated successfully");
      }, 1500);
    } catch (error) {
      console.error("Error generating API key:", error);
      toast.error("Failed to generate API key");
      setGeneratingKey(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get relative time from now
  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">API Credentials</h1>
          <p className="text-gray-400">Manage API keys for programmatic access to your account</p>
        </div>
        
        <Button 
          onClick={() => document.getElementById("generateKey")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Key className="mr-2 h-4 w-4" />
          Generate New Key
        </Button>
      </div>
      
      <DashboardSection>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            title={
              <div className="flex items-center">
                <Key className="h-5 w-5 mr-2 text-blue-400" />
                <span>API Keys Overview</span>
              </div>
            }
          >
            <div className="mt-4">
              <div className="flex items-center justify-between p-2 rounded-md bg-gray-800">
                <span className="text-sm">Total API Keys</span>
                <Badge variant="secondary" className="font-mono">
                  {apiKeys.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-gray-800 mt-2">
                <span className="text-sm">Active Keys</span>
                <Badge variant="secondary" className="font-mono">
                  {apiKeys.filter(key => key.active).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-gray-800 mt-2">
                <span className="text-sm">Inactive Keys</span>
                <Badge variant="secondary" className="font-mono">
                  {apiKeys.filter(key => !key.active).length}
                </Badge>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title={
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                <span>Security Recommendations</span>
              </div>
            }
          >
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">Rotate API keys regularly for enhanced security</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">Use specific permission scopes for each key</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">Never share API keys in code repositories or public places</p>
              </div>
            </div>
          </DashboardCard>
          
          <DashboardCard 
            title={
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-400" />
                <span>Recent Activity</span>
              </div>
            }
          >
            <div className="mt-4 space-y-3">
              {apiKeys.filter(key => key.lastUsed).length > 0 ? (
                apiKeys
                  .filter(key => key.lastUsed)
                  .sort((a, b) => new Date(b.lastUsed || 0).getTime() - new Date(a.lastUsed || 0).getTime())
                  .slice(0, 3)
                  .map(key => (
                    <div key={key.id} className="flex items-center justify-between p-2 rounded-md bg-gray-800">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{key.name}</span>
                        <span className="text-xs text-gray-400">{getTimeAgo(key.lastUsed)}</span>
                      </div>
                      <Badge variant={key.active ? "default" : "secondary"} className="text-xs">
                        {key.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))
              ) : (
                <div className="flex items-center justify-center p-4 text-gray-400">
                  <p className="text-sm">No recent API key activity</p>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>
      </DashboardSection>
      
      <Separator className="my-8" />
      
      <DashboardSection title="Your API Keys" description="View and manage existing API keys">
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-8">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <Key size={40} className="text-gray-500" />
                <h3 className="text-lg font-medium text-gray-300">No API Keys Found</h3>
                <p className="text-gray-400 max-w-md">
                  You haven't created any API keys yet. Generate your first key to start using the API.
                </p>
                <Button 
                  onClick={() => document.getElementById("generateKey")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Generate New Key
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-4 sm:p-6 hover:bg-gray-750">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{apiKey.name}</h3>
                        <Badge variant={apiKey.active ? "default" : "secondary"} className="text-xs">
                          {apiKey.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 flex items-center">
                        <div className="relative flex-1">
                          <Input 
                            value={showKeys[apiKey.id] ? apiKey.key : "•".repeat(20)} 
                            readOnly
                            className="pr-20 font-mono text-sm bg-gray-900 border-gray-700"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-800"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                            >
                              {showKeys[apiKey.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-800"
                              onClick={() => copyToClipboard(apiKey.key, apiKey.name)}
                            >
                              <Copy size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400 block">Created</span>
                          <span className="text-gray-300">{formatDate(apiKey.createdAt)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Last Used</span>
                          <span className="text-gray-300">{formatDate(apiKey.lastUsed)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Permissions</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {apiKey.permissions.map(perm => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {perm.charAt(0).toUpperCase() + perm.slice(1)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-4 justify-end">
                      <div className="flex items-center gap-2">
                        <Switch 
                          id={`toggle-${apiKey.id}`}
                          checked={apiKey.active}
                          onCheckedChange={() => toggleKeyStatus(apiKey.id, apiKey.active)}
                        />
                        <Label htmlFor={`toggle-${apiKey.id}`} className="text-sm">
                          {apiKey.active ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs bg-red-900/30 hover:bg-red-900/50 text-red-400"
                        onClick={() => deleteApiKey(apiKey.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardSection>
      
      <div id="generateKey"></div>
      <DashboardSection title="Generate API Key" description="Create a new API key with specific permissions">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-white">
              <Key className="h-5 w-5 mr-2 text-blue-400" />
              New API Key
            </CardTitle>
            <CardDescription className="text-gray-400">
              Create a new API key to access your account programmatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">API Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Trading Bot Access"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-gray-750 border-gray-700"
              />
              <p className="text-xs text-gray-400">Choose a descriptive name to help you identify this key later</p>
            </div>
            
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {["read", "write", "trade"].map(permission => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Switch
                      id={`permission-${permission}`}
                      checked={selectedPermissions.includes(permission)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPermissions(prev => [...prev, permission]);
                        } else {
                          setSelectedPermissions(prev => prev.filter(p => p !== permission));
                        }
                      }}
                    />
                    <Label htmlFor={`permission-${permission}`}>
                      {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {newlyGeneratedKey && (
              <div className="p-4 rounded-md bg-blue-900/20 border border-blue-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-blue-400">Your New API Key</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs bg-blue-900/30 hover:bg-blue-800 border-blue-700"
                    onClick={() => copyToClipboard(newlyGeneratedKey, "New API key")}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-amber-400 mb-2 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Save this key now. You won't be able to see it again!
                </p>
                <div className="bg-gray-900 p-2 rounded border border-gray-700 overflow-x-auto">
                  <code className="text-sm font-mono text-blue-300">{newlyGeneratedKey}</code>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!newKeyName.trim() || selectedPermissions.length === 0 || generatingKey}
              onClick={generateNewApiKey}
            >
              {generatingKey ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Generate API Key
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </DashboardSection>
    </div>
  );
}
