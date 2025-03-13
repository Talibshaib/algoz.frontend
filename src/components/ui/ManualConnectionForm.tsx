"use client";

import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { setCustomEndpoint, checkAPIHealth } from "@/services/healthCheck";
import { MotionDiv } from "./motion";
import { toast } from "sonner";

interface ManualConnectionFormProps {
  onConnectionSuccess: () => void;
}

export function ManualConnectionForm({ onConnectionSuccess }: ManualConnectionFormProps) {
  const [ipAddress, setIpAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!ipAddress.trim()) {
      setError("Please enter a valid IP address or URL");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format the IP address as a proper URL if it doesn't already include http/https
      let formattedEndpoint = ipAddress.trim();
      if (!formattedEndpoint.startsWith("http")) {
        formattedEndpoint = `https://${formattedEndpoint}`;
      }
      
      // Ensure the endpoint ends with /api/v1
      if (!formattedEndpoint.includes("/api/v1")) {
        formattedEndpoint = formattedEndpoint.endsWith("/") 
          ? `${formattedEndpoint}api/v1` 
          : `${formattedEndpoint}/api/v1`;
      }
      
      // Try to set the custom endpoint
      const success = await setCustomEndpoint(formattedEndpoint);
      
      if (success) {
        // Force a health check to update the status
        await checkAPIHealth(true);
        
        toast.success("Successfully connected to server", {
          description: "Using custom endpoint for API requests"
        });
        
        // Notify parent component
        onConnectionSuccess();
        
        // Reset form
        setIpAddress("");
        setIsExpanded(false);
      } else {
        setError("Could not connect to the specified endpoint. Please check the address and try again.");
      }
    } catch (error) {
      console.error("Error setting custom endpoint:", error);
      setError("Invalid endpoint format or connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-medium">Advanced: Manual Connection</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      
      {isExpanded && (
        <MotionDiv
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3"
        >
          <p className="text-xs text-gray-600 mb-3">
            If you're experiencing DNS resolution issues, you can try connecting directly using the server's IP address.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="text"
              label="Server Address"
              placeholder="Enter IP address or URL (e.g., 123.456.789.101)"
              value={ipAddress}
              onChange={(e) => {
                setIpAddress(e.target.value);
                if (error) setError("");
              }}
              isInvalid={!!error}
              errorMessage={error}
              size="sm"
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                color="primary"
                isLoading={isLoading}
                className="text-white"
              >
                {isLoading ? "Connecting..." : "Connect"}
              </Button>
            </div>
          </form>
        </MotionDiv>
      )}
    </div>
  );
} 