"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

export default function WebhookPage() {
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchWebhookUrl = async () => {
    try {
      setLoading(true);
      
      // Get fresh user session with the latest token
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error("Authentication error", {
          description: "Please sign in to view your webhook URL.",
        });
        setLoading(false);
        return;
      }
      
      // Store the user ID for display
      setUserId(user.id);
      
      // Get a fresh session to ensure we have the latest token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast.error("Session error", {
          description: "Please sign in again to refresh your session.",
        });
        setLoading(false);
        return;
      }
      
      // Call our backend API to get the webhook URL
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://algoz-backend-68rt.onrender.com";
      let token = session.access_token;
      
      // Verify token format - should be a JWT with 3 parts separated by dots
      if (!token || token.split('.').length !== 3) {
        console.error("Invalid token format:", token ? "Token doesn't have 3 parts" : "Token is empty");
        
        // Try to refresh the session instead of just showing an error
        const { data: refreshResult, error: refreshErr } = await supabase.auth.refreshSession();
        
        if (refreshErr || !refreshResult.session) {
          toast.error("Authentication error", {
            description: "Invalid authentication token. Please sign in again.",
          });
          setLoading(false);
          return;
        }
        
        // Use the refreshed token
        token = refreshResult.session.access_token;
      }
      
      // Log only minimal information for security
      console.log("Making webhook request to:", apiBaseUrl);
      
      const response = await fetch(`${apiBaseUrl}/api/v1/users/generate-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          // Try to parse as JSON for better error messages
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        console.error("Error response:", response.status, errorData);
        
        // If unauthorized, try to refresh the session
        if (response.status === 401 && !refreshing) {
          console.log("Trying to refresh session...");
          const { data: refreshResult, error: refreshErr } = await supabase.auth.refreshSession();
          
          if (!refreshErr && refreshResult.session) {
            console.log("Session refreshed successfully");
            // Try again after refresh
            setRefreshing(true);
            await fetchWebhookUrl();
            return;
          } else {
            console.error("Session refresh failed:", refreshErr);
          }
        }
        
        throw new Error(`Status: ${response.status}, Error: ${errorData.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      if (data.data?.webhookUrl) {
        setWebhookUrl(data.data.webhookUrl);
      } else {
        throw new Error("No webhook URL found in response");
      }
    } catch (error) {
      console.error("Error fetching webhook URL:", error);
      toast.error("Something went wrong", {
        description: error instanceof Error ? error.message : "Unable to fetch your webhook URL.",
      });
      setWebhookUrl(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWebhookUrl();
  };

  const handleCopyClick = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      toast.success("Copied to clipboard", {
        description: "Webhook URL has been copied to your clipboard."
      });
    }
  };

  useEffect(() => {
    fetchWebhookUrl();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Webhook Configuration</h1>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Webhook URL</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="ml-2"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Use this URL to receive real-time trade signals from our platform. Keep this URL confidential as it provides access to your account's incoming signals.
          </p>
          
          {loading ? (
            <Skeleton className="h-12 w-full" />
          ) : webhookUrl ? (
            <>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-muted p-3 rounded-md flex-1 overflow-x-auto font-mono text-sm">
                  {webhookUrl}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCopyClick} 
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              {userId && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Your unique ID: <span className="font-mono">{userId}</span></p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
              <p className="text-amber-800 dark:text-amber-200">
                No webhook URL found. Click the refresh button to generate one.
              </p>
            </div>
          )}
          
          <div className="mt-6 bg-muted p-4 rounded-md">
            <h3 className="font-semibold mb-2">How to use your webhook URL</h3>
            <p className="text-sm text-muted-foreground">
              1. Copy this URL and paste it into your trading platform's webhook settings.<br />
              2. Configure your platform to send trade signals to this URL in JSON format.<br />
              3. All signals sent to this URL will be processed for your account automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}