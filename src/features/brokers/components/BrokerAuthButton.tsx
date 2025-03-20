"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { authenticateBroker, deactivateBroker, getBrokerStatus } from '../services/brokerAuthService';

interface BrokerAuthButtonProps {
  brokerId: string;
  brokerName: string;
  isActive: boolean;
  onSuccess: () => void;
  authenticateFunction?: (brokerId: string) => Promise<any>;
}

export const BrokerAuthButton: React.FC<BrokerAuthButtonProps> = ({
  brokerId,
  brokerName,
  isActive: initialIsActive,
  onSuccess,
  authenticateFunction
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(initialIsActive);
  
  // Check the broker status on component mount
  useEffect(() => {
    const checkBrokerStatus = async () => {
      try {
        const status = await getBrokerStatus(brokerId);
        if (status.isActive !== isActive) {
          setIsActive(status.isActive);
        }
      } catch (error) {
        console.error(`Error checking broker status for ${brokerName}:`, error);
        // Don't show error toast on initial load
      }
    };
    
    checkBrokerStatus();
  }, [brokerId, brokerName, isActive]);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isActive) {
        // Deactivate the broker
        await deactivateBroker(brokerId);
        toast.success(`${brokerName} has been disconnected successfully.`);
        setIsActive(false);
      } else {
        // Authenticate with the broker
        if (authenticateFunction) {
          // Use the provided broker-specific authentication function if available
          await authenticateFunction(brokerId);
        } else {
          // Use the generic authentication function
          await authenticateBroker(brokerId);
        }
        toast.success(`Successfully connected to ${brokerName}.`);
        setIsActive(true);
      }
      onSuccess();
    } catch (error: any) {
      console.error(`Error toggling ${brokerName} broker:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to ${isActive ? 'disconnect from' : 'connect to'} ${brokerName}: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isActive ? (
        <ToggleRight className="h-5 w-5 text-green-500" />
      ) : (
        <ToggleLeft className="h-5 w-5 text-gray-400" />
      )}
      {isActive ? 'Connected' : 'Connect'}
    </Button>
  );
};