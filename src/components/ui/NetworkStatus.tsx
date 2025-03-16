"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, Settings, ExternalLink } from "lucide-react";
import { API_URL } from "@/constants/URI";
import { MotionDiv } from "./motion";
import { checkAPIHealth, setCustomEndpoint } from "@/services/healthCheck";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { toast } from "sonner";

interface NetworkStatusProps {
  onStatusChange?: (isOnline: boolean) => void;
  className?: string;
}

export function NetworkStatus({ onStatusChange, className = "" }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showManualOptions, setShowManualOptions] = useState(false);
  const [manualIp, setManualIp] = useState("");
  const [isSettingManual, setIsSettingManual] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // First check browser's navigator.onLine
      if (!navigator.onLine) {
        setIsOnline(false);
        if (onStatusChange) onStatusChange(false);
        setShowStatus(true);
        return;
      }

      // Use our improved health check service
      const result = await checkAPIHealth(true);
      const apiOnline = result.isOnline;
      
      setIsOnline(apiOnline);
      if (onStatusChange) onStatusChange(apiOnline);
      
      if (!apiOnline) {
        setShowStatus(true);
      }
    } catch (error) {
      console.error("API connection check failed:", error);
      setIsOnline(false);
      if (onStatusChange) onStatusChange(false);
      setShowStatus(true);
    } finally {
      setIsChecking(false);
    }
  };

  // Handle manual IP connection
  const handleManualConnect = async () => {
    if (!manualIp.trim()) {
      toast.error("Please enter a valid IP address or URL");
      return;
    }
    
    setIsSettingManual(true);
    
    try {
      // Format the IP address as a proper URL if it doesn't already include http/https
      let formattedEndpoint = manualIp.trim();
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
        toast.success("Successfully connected to server");
        setIsOnline(true);
        if (onStatusChange) onStatusChange(true);
        setShowManualOptions(false);
        setManualIp("");
      } else {
        toast.error("Could not connect to the specified endpoint");
      }
    } catch (error) {
      console.error("Error setting custom endpoint:", error);
      toast.error("Invalid endpoint format or connection failed");
    } finally {
      setIsSettingManual(false);
    }
  };

  useEffect(() => {
    // Check connection on mount
    checkConnection();

    // Set up event listeners for online/offline events
    const handleOnline = () => {
      checkConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (onStatusChange) onStatusChange(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set up periodic checking
    const intervalId = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [onStatusChange]);

  // Auto-hide the status after 5 seconds if online
  useEffect(() => {
    if (isOnline && showStatus) {
      const timerId = setTimeout(() => {
        setShowStatus(false);
        setShowManualOptions(false);
      }, 5000);
      
      return () => clearTimeout(timerId);
    }
  }, [isOnline, showStatus]);

  if (!showStatus) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-20 right-4 z-50 p-3 rounded-lg shadow-lg max-w-md ${
        isOnline ? "bg-green-50 text-green-700 border border-green-200" : 
        "bg-red-50 text-red-700 border border-red-200"
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Wifi size={18} className="text-green-600" />
        ) : (
          <WifiOff size={18} className="text-red-600" />
        )}
        <span className="text-sm font-medium">
          {isOnline ? "Connected to server" : "Server connection issue"}
        </span>
        <button
          onClick={() => {
            checkConnection();
          }}
          className={`ml-2 p-1 rounded-full ${
            isOnline ? "hover:bg-green-100" : "hover:bg-red-100"
          } transition-colors`}
          disabled={isChecking}
          aria-label="Refresh connection status"
        >
          <RefreshCw
            size={16}
            className={`${isChecking ? "animate-spin" : ""}`}
          />
        </button>
        {!isOnline && (
          <button
            onClick={() => setShowManualOptions(!showManualOptions)}
            className="ml-auto p-1 rounded-full hover:bg-red-100 transition-colors"
            aria-label="Manual connection options"
          >
            <Settings size={16} />
          </button>
        )}
      </div>
      
      {!isOnline && (
        <div className="mt-1">
          <p className="text-xs mb-2">
            We're having trouble connecting to our servers. This might be due to:
          </p>
          <ul className="text-xs list-disc pl-4 mb-2 space-y-0.5">
            <li>Temporary server maintenance</li>
            <li>Network connectivity issues</li>
            <li>DNS resolution problems</li>
          </ul>
          
          {showManualOptions ? (
            <div className="mt-3 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualIp}
                  onChange={(e) => setManualIp(e.target.value)}
                  placeholder="Enter IP address or URL"
                  className="flex-1 text-xs p-1.5 border border-red-200 rounded bg-white text-gray-800"
                />
                <Button
                  size="sm"
                  className="text-xs bg-red-600 text-white"
                  onClick={handleManualConnect}
                  isLoading={isSettingManual}
                  isDisabled={isSettingManual || !manualIp.trim()}
                >
                  Connect
                </Button>
              </div>
              <p className="text-xs text-red-600">
                If you know the server's IP address, enter it above to bypass DNS resolution.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                size="sm"
                className="text-xs bg-red-600 text-white"
                onClick={checkConnection}
                isLoading={isChecking}
                isDisabled={isChecking}
              >
                Retry Connection
              </Button>
              <Button
                size="sm"
                variant="flat"
                className="text-xs bg-white text-red-600 border border-red-200"
                onClick={() => setShowManualOptions(true)}
              >
                Manual Connection
              </Button>
              <Link href="/login" className="inline-flex">
                <Button
                  size="sm"
                  variant="flat"
                  className="text-xs bg-white text-red-600 border border-red-200 flex items-center gap-1"
                >
                  <ExternalLink size={12} />
                  Login Page
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </MotionDiv>
  );
} 