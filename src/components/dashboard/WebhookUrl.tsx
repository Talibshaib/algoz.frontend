"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/constants/URI";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

const WebhookUrl = () => {
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  // Fetch webhook URL when component mounts or user changes
  useEffect(() => {
    const fetchWebhookUrl = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if user has an access token
        if (!user.accessToken) {
          console.error("No access token available - user may need to re-login");
          setError("Authentication error. Please try logging out and back in.");
          setIsLoading(false);
          return;
        }
        
        // Log the token for debugging
        console.log("Using access token:", user.accessToken.substring(0, 10) + "...");
        
        // Make API request with explicit Authorization header
        const response = await axiosInstance.get('/webhook/url', {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        });
        
        // Process response
        const data = response.data;
        console.log("Webhook URL response:", data);
        
        if (data.data && data.data.webhookUrl) {
          setWebhookUrl(data.data.webhookUrl);
        } else {
          console.error("Webhook URL not found in response:", data);
          setError("Invalid response format from server");
        }
      } catch (err: any) {
        console.error("Error fetching webhook URL:", err);
        
        // Provide specific error messages based on the error type
        if (err.response) {
          if (err.response.status === 401) {
            console.error("Authentication failed with 401 error");
            // Force re-login by clearing user data
            localStorage.removeItem("user");
            setError("Authentication session expired. Please log out and log back in.");
            
            // Add a logout button
            toast.error("Authentication Error", {
              description: "Your session has expired. Please log out and log back in.",
              action: {
                label: "Logout",
                onClick: () => router.push("/login")
              },
              duration: 10000,
            });
          } else {
            setError(`Failed to load webhook URL: ${err.response.data?.message || err.message}`);
          }
        } else if (err.request) {
          setError("Failed to connect to server. Please check your internet connection.");
        } else {
          setError("Failed to load webhook URL. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Only fetch if user is authenticated and not in loading state
    if (user && !authLoading) {
      fetchWebhookUrl();
    } else if (!authLoading && !user) {
      // If not loading and no user, we shouldn't be here
      // Dashboard layout should handle redirect, but just in case
      setIsLoading(false);
    }
  }, [user, authLoading, router]);

  const handleRegenerateWebhook = async () => {
    if (!user || !user.accessToken) {
      setError("Authentication required. Please try logging out and back in.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.post('/webhook/regenerate', {}, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      });
      
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
        // Force re-login by clearing user data
        localStorage.removeItem("user");
        toast.error("Authentication Error", {
          description: "Your session has expired. Please log out and log back in.",
          action: {
            label: "Logout",
            onClick: () => router.push("/login")
          },
          duration: 10000,
        });
      } else {
        setError("Failed to regenerate webhook URL. Please try again later.");
      }
      
      toast.error("Error", {
        description: "Failed to regenerate webhook URL. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
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
        toast.error("Error", {
          description: "Failed to copy URL to clipboard.",
          duration: 3000,
        });
      });
  };

  // Show loading state while authentication is in progress
  if (authLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse h-10 bg-muted rounded-md mb-4"></div>
      </div>
    );
  }

  // If not authenticated and not loading, we shouldn't be here
  // Dashboard layout should handle redirect, but just in case
  if (!user && !authLoading) {
    return null;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">TradingView Webhook URL</h1>
      
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-2">Your Webhook URL</h2>
        <p className="text-muted-foreground mb-4">
          Use this URL in TradingView to send trading signals to our platform.
        </p>
        
        {isLoading ? (
          <div className="animate-pulse h-10 bg-muted rounded-md mb-4"></div>
        ) : error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-muted p-3 rounded-md overflow-x-auto">
              <code className="text-sm">{webhookUrl}</code>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={copyToClipboard}
              title="Copy to clipboard"
              disabled={!webhookUrl}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Regenerate button removed as requested */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRegenerateWebhook}
            disabled
          >
            Regenerate Webhook URL
          </Button>
          <p className="text-xs text-muted-foreground">
            Note: Regenerating will invalidate your previous webhook URL.
          </p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-medium mb-2">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Copy the webhook URL above</li>
          <li>In TradingView, go to Pine Script strategy settings</li>
          <li>Enable "Alerts" in your strategy properties</li>
          <li>Create a new alert and select "Webhook URL" as the notification method</li>
          <li>Paste your webhook URL</li>
          <li>Configure the alert message format (JSON recommended)</li>
          <li>Save the alert</li>
        </ol>
      </div>
    </div>
  );
};

export default WebhookUrl;