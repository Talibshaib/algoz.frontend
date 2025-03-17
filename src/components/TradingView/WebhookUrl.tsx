"use client"

import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export default function WebhookUrl() {
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();

  // Fetch the webhook URL when the component mounts
  useEffect(() => {
    if (user) {
      fetchWebhookUrl();
    }
  }, [user]);

  // Function to fetch the webhook URL
  const fetchWebhookUrl = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get("/api/v1/webhook/url");
      
      if (response.data.success) {
        setWebhookUrl(response.data.data.webhookUrl);
      } else {
        setError(response.data.message || "Failed to fetch webhook URL");
      }
    } catch (err: any) {
      console.error("Error fetching webhook URL:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch webhook URL");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to regenerate the webhook URL
  const regenerateWebhookUrl = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/api/v1/webhook/regenerate");
      
      if (response.data.success) {
        setWebhookUrl(response.data.data.webhookUrl);
        toast.success("Webhook URL regenerated successfully");
      } else {
        setError(response.data.message || "Failed to regenerate webhook URL");
      }
    } catch (err: any) {
      console.error("Error regenerating webhook URL:", err);
      setError(err.response?.data?.message || err.message || "Failed to regenerate webhook URL");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to copy the webhook URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl)
      .then(() => {
        toast.success("Webhook URL copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy webhook URL");
      });
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">TradingView Webhook URL</h2>
      
      {error && (
        <div className="p-3 mb-4 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Use this URL in TradingView to send trading signals to our platform.
        </p>
        
        {webhookUrl ? (
          <div className="flex flex-col gap-2">
            <div className="p-3 bg-gray-100 border rounded-md break-all">
              {webhookUrl}
            </div>
            <div className="flex gap-2">
              <Button 
                color="primary" 
                variant="flat" 
                size="sm" 
                onClick={copyToClipboard}
              >
                Copy URL
              </Button>
              <Button 
                color="danger" 
                variant="flat" 
                size="sm" 
                onClick={regenerateWebhookUrl}
                isLoading={isLoading}
              >
                Regenerate URL
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-100 border rounded-md text-gray-500">
            {isLoading ? "Loading webhook URL..." : "Failed to load webhook URL"}
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium mb-2">How to Use</h3>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
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
} 