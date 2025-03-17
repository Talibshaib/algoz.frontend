"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface BrokerAuthButtonProps {
  brokerId: string;
  brokerName: string;
  isActive: boolean;
  onSuccess: () => void;
  authenticateFunction: (brokerId: string) => Promise<any>;
}

export const BrokerAuthButton: React.FC<BrokerAuthButtonProps> = ({
  brokerId,
  brokerName,
  isActive,
  onSuccess,
  authenticateFunction
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthenticate = async () => {
    setIsLoading(true);
    try {
      await authenticateFunction(brokerId);
      toast.success(`Successfully authenticated with ${brokerName}`);
      onSuccess();
    } catch (error: any) {
      console.error(`Error authenticating with ${brokerName}:`, error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to authenticate with ${brokerName}: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleAuthenticate}
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