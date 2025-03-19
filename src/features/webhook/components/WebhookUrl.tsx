"use client"

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Info, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthenticatedApi } from "@/features/auth/hooks";
import supabase from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_ROUTES } from "@/constants/routes";

const WebhookUrl = () => {
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  
  // Replace the axiosInstance reference with our authenticated client
  const { axiosInstance } = useAuthenticatedApi();
  
  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Load user data when component mounts
  useEffect(() => {
    const loadUser = async () => {
      setAuthLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
        setSession(data.session);
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    
    loadUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setSession(session);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Refresh access token if needed
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error.message);
        return false;
      }
      setSession(data.session);
      setUser(data.session?.user || null);
      return true;
    } catch (err) {
      console.error("Failed to refresh session:", err);
      return false;
    }
  }, []);
  
  // Fetch webhook URL function - extracted for reuse
  const fetchWebhookUrl = useCallback(async () => {
    if (!user || !mounted) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure we have a valid token
      if (session && new Date(session.expires_at * 1000) < new Date()) {
        const refreshed = await refreshSession();
        if (!refreshed) {
          setError("Your session has expired. Please log in again.");
          router.push(AUTH_ROUTES.LOGIN);
          return;
        }
      }
      
      // Make API request - axios interceptor will handle adding the token
      const response = await axiosInstance.get('/api/v1/webhook/url');
      
      // Process response
      const data = response.data;
      
      if (data.data && data.data.webhookUrl) {
        setWebhookUrl(data.data.webhookUrl);
      } else {
        console.error("Invalid response format:", data);
        setError("Invalid response format from server");
      }
    } catch (err: any) {
      console.error("Error fetching webhook URL:", err);
      
      // Provide specific error messages based on the error type
      if (err.response) {
        if (err.response.status === 401) {
          setError("Authentication session expired. Please log out and log back in.");
          
          // Try to refresh the token
          const refreshed = await refreshSession();
          if (!refreshed) {
            toast.error("Session expired. Please log in again.");
            router.push(AUTH_ROUTES.LOGIN);
          } else {
            // If token refreshed successfully, retry the request
            fetchWebhookUrl();
          }
        } else if (err.response.status === 404) {
          setError("Webhook URL not found. You may need to generate one.");
        } else {
          setError(`Failed to load webhook URL: ${err.response.data?.message || err.message}`);
        }
      } else if (err.request) {
        setError("Failed to connect to server. Please check your internet connection.");
      } else {
        setError(`Failed to load webhook URL: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, mounted, session, refreshSession, router, axiosInstance]);
  
  // Fetch webhook URL when component mounts or user changes
  useEffect(() => {
    // Only fetch if user is authenticated and not in loading state
    if (user && !authLoading && mounted) {
      fetchWebhookUrl();
    } else if (!authLoading && !user && mounted) {
      // If not loading and no user, we shouldn't be here
      // Dashboard layout should handle redirect, but just in case
      setIsLoading(false);
      setError("Authentication required");
    }
  }, [user, authLoading, fetchWebhookUrl, mounted]);

  const handleRegenerateWebhook = async () => {
    if (!user) {
      setError("Authentication required. Please try logging out and back in.");
      return;
    }
    
    setIsRegenerating(true);
    setError(null);
    
    try {
      // Ensure we have a valid token
      if (session && new Date(session.expires_at * 1000) < new Date()) {
        const refreshed = await refreshSession();
        if (!refreshed) {
          setError("Your session has expired. Please log in again.");
          return;
        }
      }
      
      // Use axios instance which already handles auth headers
      const response = await axiosInstance.post('/api/v1/webhook/regenerate');
      
      const data = response.data;
      if (data.data && data.data.webhookUrl) {
        setWebhookUrl(data.data.webhookUrl);
        
        toast.success("Webhook URL Regenerated", {
          description: "Your webhook URL has been successfully regenerated.",
          duration: 3000,
        });
      } else {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format from server");
      }
    } catch (err: any) {
      console.error("Error regenerating webhook URL:", err);
      
      // Provide specific error messages based on the error type
      if (err.response && err.response.status === 401) {
        setError("Authentication error. Please try logging out and back in.");
        
        // Try to refresh the token
        const refreshed = await refreshSession();
        if (!refreshed) {
          toast.error("Session expired. Please log in again.");
        }
      } else {
        setError("Failed to regenerate webhook URL. Please try again later.");
        toast.error(err.response?.data?.message || "Failed to regenerate webhook URL. Please try again.");
      }
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSessionRefresh = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use Supabase to refresh the token
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Failed to refresh auth session:", error.message);
        toast.error("Failed to refresh session. Please try logging in again.");
        router.push(AUTH_ROUTES.LOGIN);
        return;
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        toast.success("Session refreshed successfully");
        // Fetch the webhook URL again with the new token
        fetchWebhookUrl();
      } else {
        toast.error("Unable to refresh session. Please log in again.");
        router.push(AUTH_ROUTES.LOGIN);
      }
    } catch (err) {
      console.error("Error refreshing session:", err);
      setIsLoading(false);
      toast.error("Failed to refresh session");
    }
  };

  const copyToClipboard = () => {
    if (!webhookUrl) return;
    
    navigator.clipboard.writeText(webhookUrl)
      .then(() => {
        toast.success("URL Copied", {
          description: "Webhook URL has been copied to clipboard.",
          duration: 3000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err);
        toast.error("Failed to copy URL to clipboard.");
      });
  };

  // Don't render anything on the server
  if (!mounted) {
    return null;
  }

  // Show loading state while authentication is in progress
  if (authLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  // If no user, don't render the component
  if (!user && mounted && !authLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to view and manage your webhook URL.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Webhook URL</CardTitle>
          <CardDescription>
            Use this URL to receive real-time trade signals from our platform.
            Keep this URL confidential as it provides access to your account's incoming signals.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="space-y-4">
                <p>{error}</p>
                {error.includes("session expired") && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSessionRefresh}
                    className="mt-2"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Session
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {webhookUrl ? (
                <>
                  <div className="relative">
                    <div className="p-3 bg-muted rounded-md pr-12 break-all font-mono text-sm border">
                      {webhookUrl}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={copyToClipboard}
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>How to use</AlertTitle>
                    <AlertDescription>
                      <p className="mt-2 text-sm">
                        Use this URL in your trading platform to send signals to AlgoZ. This webhook accepts POST requests with JSON data.
                      </p>
                      <p className="mt-2 text-sm">
                        <strong>Note:</strong> Regenerating your webhook URL will invalidate the previous one.
                      </p>
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <Alert variant="default">
                  <AlertTitle>No Webhook URL Found</AlertTitle>
                  <AlertDescription>
                    You need to generate a webhook URL to receive trading signals.
                    Click the "Generate Webhook URL" button below.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={handleRegenerateWebhook}
            disabled={isLoading || isRegenerating}
          >
            {isRegenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : webhookUrl ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Webhook URL
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Generate Webhook URL
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleSessionRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Session
          </Button>
        </CardFooter>
      </Card>
      
      {/* Documentation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Documentation</CardTitle>
          <CardDescription>
            Learn how to integrate your trading platform with AlgoZ
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Format</h3>
              <p className="text-sm text-muted-foreground">
                Send POST requests to your webhook URL with the following JSON structure:
              </p>
              <pre className="bg-muted p-4 rounded-md mt-2 text-xs overflow-x-auto">
                {`{
  "symbol": "BTCUSDT",
  "type": "MARKET",
  "side": "BUY",
  "quantity": 0.001,
  "price": 65000,
  "timestamp": "${new Date().toISOString()}",
  "source": "TradingView"
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">TradingView Integration</h3>
              <p className="text-sm text-muted-foreground">
                For TradingView alerts, use the webhook URL in the TradingView alert settings.
                Make sure to format your alert message as JSON.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Security</h3>
              <p className="text-sm text-muted-foreground">
                Your webhook URL contains a unique identifier that is specific to your account.
                Keep this URL private and secure. If compromised, regenerate a new URL immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookUrl;