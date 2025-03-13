"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { API_URL } from "@/constants/URI";
import { MotionDiv } from "./motion";

interface NetworkStatusProps {
  onStatusChange?: (isOnline: boolean) => void;
  className?: string;
}

export function NetworkStatus({ onStatusChange, className = "" }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

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

      // Then try to ping the API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const apiUrl = new URL(API_URL);
      const baseUrl = `${apiUrl.protocol}//${apiUrl.host}`;
      
      const response = await fetch(`${baseUrl}/health`, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      clearTimeout(timeoutId);
      
      const newStatus = response.ok;
      setIsOnline(newStatus);
      if (onStatusChange) onStatusChange(newStatus);
      
      if (!newStatus) {
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
      className={`fixed top-20 right-4 z-50 p-3 rounded-lg shadow-lg ${
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
        >
          <RefreshCw
            size={16}
            className={`${isChecking ? "animate-spin" : ""}`}
          />
        </button>
      </div>
      {!isOnline && (
        <p className="text-xs mt-1">
          We're having trouble connecting to our servers. This might be due to network issues or server maintenance.
        </p>
      )}
    </MotionDiv>
  );
} 