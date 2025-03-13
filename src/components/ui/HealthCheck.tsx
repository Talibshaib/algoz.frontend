"use client";

import React, { useState, useEffect } from "react";
import { checkAPIHealth } from "@/services/healthCheck";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@nextui-org/react";
import { MotionDiv } from "./motion";

interface HealthCheckProps {
  onStatusChange?: (isOnline: boolean) => void;
  showOfflineOnly?: boolean;
  className?: string;
  compact?: boolean;
}

export function HealthCheck({ 
  onStatusChange, 
  showOfflineOnly = false, 
  className = "",
  compact = false
}: HealthCheckProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const { isOnline } = await checkAPIHealth(true);
      setIsOnline(isOnline);
      if (onStatusChange) {
        onStatusChange(isOnline);
      }
      setLastChecked(new Date());
    } catch (error) {
      console.error("Health check failed:", error);
      setIsOnline(false);
      if (onStatusChange) {
        onStatusChange(false);
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Set up periodic checking
    const intervalId = setInterval(checkHealth, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  // If we should only show when offline and we're online, return null
  if (showOfflineOnly && isOnline) {
    return null;
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {isOnline ? (
          <Wifi size={16} className="text-green-500" />
        ) : (
          <WifiOff size={16} className="text-red-500" />
        )}
        <span className="text-xs">
          {isOnline ? "Online" : "Offline"}
        </span>
        <button
          onClick={checkHealth}
          disabled={isChecking}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <RefreshCw size={12} className={isChecking ? "animate-spin" : ""} />
        </button>
      </div>
    );
  }

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-3 rounded-lg border ${
        isOnline 
          ? "bg-green-50 border-green-200 text-green-700" 
          : "bg-red-50 border-red-200 text-red-700"
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          <div>
            <p className="font-medium">
              {isOnline ? "Server is online" : "Server is offline"}
            </p>
            {lastChecked && (
              <p className="text-xs opacity-70">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="flat"
          color={isOnline ? "success" : "danger"}
          isLoading={isChecking}
          onClick={checkHealth}
          className="min-w-0 px-2"
        >
          {isChecking ? "Checking..." : "Check"}
        </Button>
      </div>
    </MotionDiv>
  );
} 